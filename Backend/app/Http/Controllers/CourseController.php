<?php

// app/Http/Controllers/CourseController.php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseRegistration;
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

    // Step 1: Get all the student's registered course codes
    $courseCodes = \App\Models\CourseRegistration::where('student_id', $student->student_id)
        ->pluck('course_code');

    // Step 2: Fetch all events whose title matches any of those codes
    $events = \App\Models\Event::whereIn('title', $courseCodes)
        ->get()
        ->map(function ($event) {
            return [
                'id' => $event->id,
                'code' => $event->title,
                'description' => $event->description,
                'type' => $event->type,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'date' => $event->date,
                'streams' => $event->streams ?? [],
            ];
        });

    // Step 3: Return the data
    return response()->json([
        'student_id' => $student->student_id,
        'courses' => $events,
    ]);
}


}
