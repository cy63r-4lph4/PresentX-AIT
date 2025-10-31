<?php

// app/Http/Controllers/CourseController.php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseRegistration;
use App\Models\Event;
use Carbon\Carbon;
use App\Models\Stream;
use Illuminate\Http\Request;


class CourseController extends Controller
{
    // GET /courses
    public function index()
    {
        // Return only the course codes for autocomplete
        return response()->json(
            Course::select('code')->pluck('code')
        );
    }

    // Optional: POST /courses (if admin can add new ones)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:courses,code',
            'title' => 'nullable|string',
        ]);

        $course = Course::create($validated);

        return response()->json($course, 201);
    }

public function studentCourses(Request $request)
{
    $student = $request->user();

    // 1️⃣ Fetch student’s registered course codes
    $courseCodes = CourseRegistration::where('student_id', $student->student_id)
        ->pluck('course_code');

    // 2️⃣ Preload all streams (id → name)
    $streamNames = Stream::pluck('name', 'id')->toArray();

    // 3️⃣ Fetch matching events
    $events = Event::whereIn('title', $courseCodes)
        ->get()
        ->map(function ($event) use ($streamNames) {
            // Format base data
            $formatted = [
                'id' => $event->id,
                'code' => $event->title,
                'description' => $event->description,
                'type' => $event->type,
            ];

            // Format date/time
            if ($event->type === 'recurring') {
                // Extract day of week from date
                $dayName = $event->date ? Carbon::parse($event->date)->format('l') : null;
                $formatted['schedule'] = [
                    'day' => $dayName,
                    'time' => sprintf(
                        '%s - %s',
                        Carbon::parse($event->start_time)->format('g:i A'),
                        Carbon::parse($event->end_time)->format('g:i A')
                    ),
                ];
            } else {
                // One-time event — pretty format
                $formatted['schedule'] = [
                    'date' => $event->date ? Carbon::parse($event->date)->toFormattedDateString() : null,
                    'time' => sprintf(
                        '%s - %s',
                        Carbon::parse($event->start_time)->format('g:i A'),
                        Carbon::parse($event->end_time)->format('g:i A')
                    ),
                ];
            }

            // Convert stream IDs to names
            $streams = [];
            if (is_array($event->streams)) {
                foreach ($event->streams as $id) {
                    if (isset($streamNames[$id])) {
                        $streams[] = $streamNames[$id];
                    }
                }
            }

            $formatted['streams'] = $streams;

            return $formatted;
        });

    // 4️⃣ Return formatted data
    return response()->json([
        'student_id' => $student->student_id,
        'courses' => $events,
    ]);
}


}
