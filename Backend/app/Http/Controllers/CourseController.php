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

        $courses = CourseRegistration::with('event')
            ->where('student_id', $student->id)
            ->get()
            ->map(function ($registration) {
                $event = $registration->event;
                return [
                    'id' => $event->id,
                    'code' => $event->title, // course code
                    'description' => $event->description,
                    'type' => $event->type,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'date' => $event->date,
                    'streams' => $event->streams,
                ];
            });

        return response()->json([
            'student' => $student->id,
            'courses' => $courses,
        ]);
    }

}
