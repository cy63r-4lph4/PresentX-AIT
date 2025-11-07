<?php
namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\AcademicYear;
use App\Models\AttendanceToken;
use App\Models\Course;
use App\Models\Event;
use App\Models\Stream;
use Carbon\Carbon;
use Cron\HoursField;
use Illuminate\Http\Request;
use Log;
use Str;
use Illuminate\Support\Facades\DB;


class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('academicYear');

        if ($request->has('streams')) {
            $raw = $request->input('streams');
            $requestedStreams = is_array($raw) ? $raw : json_decode($raw, true);

            if (is_array($requestedStreams)) {
                $streamIds = Stream::whereIn('name', $requestedStreams)->pluck('id')->toArray();

                $query->where(function ($q) use ($streamIds) {
                    foreach ($streamIds as $id) {
                        $q->orWhereJsonContains('streams', $id);
                    }
                });
            }
        }

        return EventResource::collection($query->get())->resolve();
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string', // Course code or custom title
            'type' => 'required|in:recurring,one-time',
            'hall_id' => 'required|numeric|exists:halls,id',
            'date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'streams' => 'required|array',  // Must be provided now
            'streams.*' => 'string', // stream names
            'description' => 'nullable|string',
            'semester_id' => 'nullable|exists:academic_years,id',
        ]);

        // Resolve academic year
        $semesterId = $validated['semester_id'] ?? AcademicYear::where('is_current', true)->value('id');
        if (!$semesterId) {
            return response()->json([
                'message' => 'No current academic year is set and no semester_id was provided.',
            ], 422);
        }
        $validated['academic_year_id'] = $semesterId;
        unset($validated['semester_id']);

        // ✅ Check if course exists (validation only)
        $course = Course::where('code', $validated['title'])->first();

        if ($course && empty($validated['description'])) {
            $validated['description'] = "{$course->code} - {$course->title}";
        }

        // ✅ Resolve stream names to IDs
        $streamIds = Stream::whereIn('name', $validated['streams'])->pluck('id')->toArray();
        if (empty($streamIds)) {
            return response()->json([
                'message' => 'Provided stream names are invalid.',
            ], 422);
        }
        $validated['streams'] = $streamIds;



        $start = Carbon::createFromFormat('H:i', $validated['start_time']);
        $end =Carbon::createFromFormat('H:i', $validated['end_time']);

        $conflict = Event::where('date', $validated['date'])
            ->where('hall_id', $validated['hall_id'])
            ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end->format('H:i'))
                    ->where('end_time', '>', $start->format('H:i'));
            })->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This hall is already booked for the selected time slot.',
            ], 422);
        }

        // ✅ Create the event
        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully',
            'data' => $event,
        ], 201);
    }





    public function show(Event $event)
    {
        return $event->load('academicYear');
    }

    public function update(Request $request, Event $event)
    {
        $input = $request->all();

        $rules = [
            'title' => 'sometimes|string',
            'type' => 'sometimes|in:recurring,one-time',
            'hall_id' => 'sometimes|numeric|exists:halls,id',
            'date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'streams' => 'sometimes|array',
            'streams.*' => 'string',
            'description' => 'nullable|string',
            'semester_id' => 'sometimes|exists:academic_years,id',
        ];

        $validated = $request->validate($rules);

        // ✅ Normalize semester_id
        if (isset($validated['semester_id'])) {
            $validated['academic_year_id'] = $validated['semester_id'];
            unset($validated['semester_id']);
        }

        // ✅ Normalize hall_id
        if (isset($validated['hall'])) {
            $validated['hall_id'] = $validated['hall'];
            unset($validated['hall']);
        }

        // ✅ Course code fallback
        if (isset($validated['title'])) {
            $course = Course::where('code', $validated['title'])->first();
            if ($course) {
                if (!isset($validated['streams'])) {
                    $validated['streams'] = [$course->stream_id];
                }
                if (!isset($validated['description'])) {
                    $validated['description'] = "{$course->code} - {$course->title}";
                }
            }
        }

        // ✅ Stream name resolution
        if (isset($validated['streams']) && is_array($validated['streams'])) {
            $validated['streams'] = Stream::whereIn('name', $validated['streams'])->pluck('id')->toArray();
        }

        // ✅ Hall conflict detection (only if hall_id, date, start_time, or end_time is changing)
        $checkConflict = collect(['hall_id', 'date', 'start_time', 'end_time'])->some(fn($key) => array_key_exists($key, $validated));

        if ($checkConflict) {
            $hallId = $validated['hall_id'] ?? $event->hall_id;
            $date = $validated['date'] ?? $event->date;
            $start = $validated['start_time'] ?? $event->start_time;
            $end = $validated['end_time'] ?? $event->end_time;

            $conflict = Event::where('id', '!=', $event->id)
                ->where('hall_id', $hallId)
                ->where('date', $date)
                ->where(function ($query) use ($start, $end) {
                    $query->where('start_time', '<', $end)
                        ->where('end_time', '>', $start);
                })->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'This hall is already booked for the selected time slot.',
                ], 422);
            }
        }

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'data' => $event,
        ]);
    }



    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    public function lecturerEvents(Request $request)
    {
        $lecturerId = $request->input('lecturer_id');

        if (!$lecturerId) {
            return response()->json(['message' => 'Lecturer ID is required'], 400);
        }

        $currentSemesterId = AcademicYear::where('is_current', true)->value('id');
        if (!$currentSemesterId) {
            return response()->json(['message' => 'No current academic year found'], 404);
        }

        $courses = Course::where('lecturer_id', $lecturerId)
            ->select('code', 'stream_id')
            ->get();

        if ($courses->isEmpty()) {
            return response()->json([]);
        }

        $events = Event::with('academicYear')
            ->where('academic_year_id', $currentSemesterId)
            ->where(function ($query) use ($courses) {
                foreach ($courses as $course) {
                    $query->orWhere(function ($subQuery) use ($course) {
                        $subQuery->where('title', $course->code);
                        
                    });
                }
            })
            ->get();


        return EventResource::collection($events)->resolve();
    }

    public function getTokenStatus(Request $request)
    {
        $eventId = $request->query('event_id');

        if (!$eventId) {
            return response()->json(['message' => 'event_id is required'], 422);
        }

        $token = AttendanceToken::where('event_id', $eventId)
            ->orderByDesc('created_at')
            ->first();

        if (!$token) {
            return response()->json([
                'has_token' => false,
                'message' => 'No token found for this event',
            ]);
        }

        $now = now();

        return response()->json([
            'has_token' => true,
            'token' => $token->token,
            'starts_at' => $token->starts_at,
            'expires_at' => $token->expires_at,
            'is_active' => $token->is_active,
            'sms_code' => $token->sms_code,
            'is_expired' => $now->greaterThan($token->expires_at),
            'can_be_reused' => $token->is_active && $now->lessThanOrEqualTo($token->expires_at),
        ]);
    }

    public function generateToken(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        $autoExpiry = $request->input('auto_expiry', false);
        $expiryMinutes = $request->input('expires_in', 15);


        $existingToken = AttendanceToken::where('event_id', $eventId)
            ->where('is_active', true)
            ->first();

        if ($existingToken) {
            // $existingToken->update(['is_active' => false]);

            $existingToken->delete();
        }

        $token = Str::uuid()->toString();
        $smsCode = strtoupper(Str::random(6));

        $newToken = AttendanceToken::create([
            'event_id' => $eventId,
            'token' => $token,
            'sms_code' => $smsCode,
            'starts_at' => $autoExpiry ? $event->start_time : now(),
            'expires_at' => $autoExpiry ? $event->end_time : now()->addMinutes($expiryMinutes),
            'is_active' => true,
        ]);
        

        return response()->json([
            'message' => 'New token generated. Previous token replaced.',
            'token' => $newToken->token,
            'sms_code' => $newToken->sms_code,
            'expires_at' => $newToken->expires_at,
            'reused' => false,
        ]);
    }

    public function extend(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer|exists:events,id',
            'additional_minutes' => 'required|integer|min:1',
        ]);

        $token = AttendanceToken::where('event_id', $request->event_id)
            ->where('is_active', true)
            ->latest()
            ->first();

        if (!$token) {
            return response()->json(['message' => 'No active token found for this event.'], 404);
        }

        $token->expires_at = now()->addMinutes($request->additional_minutes);
        $token->is_active = true;
        $token->save();

        return response()->json([
            'message' => 'Token extended successfully.',
            'expires_at' => $token->expires_at,
            'sms_code' => $token->sms_code,
        ]);
    }


    public function curtail(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer|exists:events,id',
            'reduce_by_minutes' => 'required|integer|min:1',
        ]);

        $token = AttendanceToken::where('event_id', $request->event_id)
            ->where('is_active', true)
            ->latest()
            ->first();

        if (!$token) {
            return response()->json(['message' => 'No active token found for this event.'], 404);
        }

        $newExpiry = Carbon::parse($token->expires_at)->subMinutes($request->reduce_by_minutes);
        // Optional: prevent expiry from being in the past
        if ($newExpiry->isPast()) {
            $token->expires_at = now();
            $token->is_active = false;
        } else {
            $token->expires_at = $newExpiry;
        }

        $token->save();

        return response()->json([
            'message' => 'Token curtailed successfully.',
            'expires_at' => $token->expires_at,
        ]);
    }

    public function invalidate(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer|exists:events,id',
        ]);

        $token = AttendanceToken::where('event_id', $request->event_id)
            ->where('is_active', true)
            ->latest()
            ->first();

        if (!$token) {
            return response()->json(['message' => 'No active token found to invalidate.'], 404);
        }

        $token->is_active = false;
        $token->expires_at = now();
        $token->save();

        return response()->json(['message' => 'Token invalidated successfully.']);
    }




    public function getTodaysEventsForStudent(Request $request)
    {
        $studentId = $request->user()->student_id ?? $request->student_id;
        $today = Carbon::today();
        $todayDate = $today->toDateString();
        $dayOfWeek = $today->format('l');

        // Recurring Events
        $recurringEvents = DB::table('course_registrations')
            ->join('courses', 'course_registrations.course_code', '=', 'courses.code')
            ->join('events', function ($join) use ($dayOfWeek) {
                $join->on('events.title', '=', 'courses.code')
                    ->where('events.type', '=', 'recurring')
                    ->whereRaw('DAYNAME(events.date) = ?', [$dayOfWeek])
                    ->whereRaw("JSON_CONTAINS(events.streams, CONCAT('[', course_registrations.stream_id, ']'))");
            })
            ->leftJoin('lecturers', 'courses.lecturer_id', '=', 'lecturers.lecturer_id')
            ->leftJoin('halls', 'events.hall_id', '=', 'halls.id')
            ->where('course_registrations.student_id', $studentId)
            ->select(
                'events.id',
                'events.title as code',
                'events.description as title',
                'lecturers.name as lecturer',
                'events.start_time',
                'events.end_time',
                'halls.name as hall'
            )
            ->distinct();

        // One-Time Events
        $oneTimeEvents = DB::table('course_registrations')
            ->join('courses', 'course_registrations.course_code', '=', 'courses.code')
            ->join('events', function ($join) use ($todayDate) {
                $join->on('events.title', '=', 'courses.code')
                    ->where('events.type', '=', 'one-time')
                    ->whereDate('events.date', '=', $todayDate)
                    ->whereRaw("JSON_CONTAINS(events.streams, CONCAT('[', course_registrations.stream_id, ']'))");
            })
            ->leftJoin('lecturers', 'courses.lecturer_id', '=', 'lecturers.lecturer_id')
            ->leftJoin('halls', 'events.hall_id', '=', 'halls.id')
            ->where('course_registrations.student_id', $studentId)
            ->select(
                'events.id',
                'events.title as code',
                'events.description as title',
                'lecturers.name as lecturer',
                'events.start_time',
                'events.end_time',
                'halls.name as hall'
            )
            ->distinct();

        // Combine into one result set
        $events = $recurringEvents->unionAll($oneTimeEvents)->get();

        $attendedEventIds = DB::table('attendance')
            ->where('student_id', $studentId)
            ->whereDate("marked_at",$todayDate)
            ->pluck('event_id')
            ->toArray();

        // Mark attended events
        $events->transform(function ($event) use ($attendedEventIds) {
            $event->marked = in_array($event->id, $attendedEventIds);
            return $event;
        });



        return response()->json([
            'events' => $events
        ]);
    }













}
