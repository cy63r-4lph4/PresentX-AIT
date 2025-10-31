<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stream;
use App\Models\CourseRegistration;

class StudentController extends Controller
{
    /**
     * Fetch details of the authenticated student.
     */
    public function details(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get stream info (if any)
        $stream = null;
        if (property_exists($student, 'stream_id') && $student->stream_id) {
            $stream = Stream::find($student->stream_id)?->name;
        }

        // Fetch number of registered courses
        $courseCount = CourseRegistration::where('student_id', $student->student_id)->count();

        // Optionally, fetch the course titles or codes
        $registeredCourses = CourseRegistration::where('student_id', $student->student_id)
            ->pluck('course_code')
            ->toArray();

        // Format response
        return response()->json([
            'student_id' => $student->student_id,
            'name'       => trim(($student->first_name ?? '') . ' ' . ($student->last_name ?? '')),
            'email'      => $student->email,
            'phone'      => $student->phone,
            'stream'     => $stream,
            'registered_courses_count' => $courseCount,
            'registered_courses'       => $registeredCourses,
            'created_at' => $student->created_at->toDateTimeString(),
        ]);
    }
}
