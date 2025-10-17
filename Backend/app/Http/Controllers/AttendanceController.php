<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceToken;
use App\Models\CourseRegistration;
use App\Models\Event;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{

 public function index($eventId)
{
    $today = now()->toDateString();
    $event=Event::where('id', $eventId)->first();
    $registered = CourseRegistration::where('course_code', $event->title)->count();

    $attendances = Attendance::with('student')
        ->where('event_id', $eventId)
        ->whereDate('marked_at', $today) // ✅ only today
        ->get()
        ->map(function ($a) {
            return [
                'id' => $a->id,
                'name' => optional($a->student)->name,
                'student_id' => $a->student_id,
                'stream' => optional($a->student)->stream,
                'method' => $a->method,
                'time' => $a->marked_at->format('h:i A'),
                'is_registered' => $a->is_registered,
            ];
        });

    $presentCount = $attendances->count();
    $turnover = $registered > 0 ? round(($presentCount / $registered) * 100, 2) : 0;

    return response()->json([
        'registered_count' => $registered,
        'total_present' => $presentCount,
        'turnover_rate' => $turnover,
        'students' => [
            'registered' => $attendances->where('is_registered', true)->values(),
            'unregistered' => $attendances->where('is_registered', false)->values(),
        ],
    ]);
}





    public function mark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,student_id',
            'token' => 'required|string',
            'method' => 'nullable|in:qr,sms,manual',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid request.',
                'errors' => $validator->errors()
            ], 422);
        }

        $token = AttendanceToken::where('token', $request->token)
            ->where('is_active', true)
            ->first();

        if (!$token) {
            return response()->json([
                'message' => 'Invalid or inactive attendance token.'
            ], 404);
        }
        Log::info('Marking attendance', [
            'student_id' => $request->student_id,
            'event_id_from_token' => $token->event_id,
        ]);


        $now = Carbon::now();
        if ($now->lt($token->starts_at) || $now->gt($token->expires_at)) {
            return response()->json([
                'message' => 'This token is not valid at this time.'
            ], 403);
        }

        $alreadyMarked = Attendance::where('student_id', $request->student_id)
            ->where('event_id', $token->event_id)
            ->exists();

        if ($alreadyMarked) {
            return response()->json([
                'message' => 'Attendance already marked for this event.'
            ], 409);
        }

        $isRegistered = CourseRegistration::where('student_id', $request->student_id)
            ->where('course_code', $token->event->course_id ?? null)
            ->exists();

        $attendance = Attendance::create([
            'student_id' => $request->student_id,
            'event_id' => $token->event_id,
            'method' => $request->input('method', 'qr'),
            'marked_at' => now(),
            'is_registered' => $isRegistered,
        ]);

        return response()->json([
            'message' => 'Attendance marked successfully.',
            'attendance' => $attendance
        ], 201);
    }

    public function markAuthenticated(Request $request)
    {
        $user = auth()->user();


        if (!$user instanceof Student) {
            return response()->json([
                'message' => 'Unauthorized. Only students can mark attendance this way.'
            ], 403);
        }

        $request->merge([
            'student_id' => $user->student_id,
            'method' => 'qr'
        ]);

        return $this->mark($request);
    }

public function markBySms(Request $request)
{
    $from = $request->input('from'); // phone number
    $body = trim($request->input('body')); // e.g. token

    // Find student by phone
    $student = Student::where('phone', $from)->first();

    if (!$student) {
        return response()->json([
            'message' => 'Student with this phone number not found.'
        ], 404);
    }

    // Extract token from SMS body
    $tokenValue = $body;

    $token = AttendanceToken::where('token', $tokenValue)
        ->where('is_active', true)
        ->first();

    if (!$token) {
        return response()->json([
            'message' => 'Invalid or inactive attendance token.'
        ], 404);
    }

    $now = Carbon::now();
    if ($now->lt($token->starts_at) || $now->gt($token->expires_at)) {
        return response()->json([
            'message' => 'This token is not valid at this time.'
        ], 403);
    }

    $alreadyMarked = Attendance::where('student_id', $student->student_id)
        ->where('event_id', $token->event_id)
        ->exists();

    if ($alreadyMarked) {
        return response()->json([
            'message' => 'Attendance already marked for this event.'
        ], 409);
    }

    $isRegistered = CourseRegistration::where('student_id', $student->student_id)
        ->where('course_code', $token->event->course_id ?? null)
        ->exists();

    $attendance = Attendance::create([
        'student_id' => $student->student_id,
        'event_id' => $token->event_id,
        'method' => 'sms',
        'marked_at' => now(),
        'is_registered' => $isRegistered,
    ]);

    return response()->json([
        'message' => 'Attendance marked successfully via SMS.',
        'attendance' => $attendance
    ], 201);
}

}
