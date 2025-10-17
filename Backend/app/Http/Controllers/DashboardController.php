<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\Student;
use App\Models\CourseRegistration;
use App\Models\Course;
use App\Models\Stream;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function overview()
    {
        $today = now()->toDateString();

        // --- Overall totals ---
        $totalStudents = Student::count();
        $totalEvents = Event::whereDate('date', $today)->count();
        $totalPresent = Attendance::whereDate('marked_at', $today)
            ->distinct('student_id')
            ->count('student_id');
        $totalAbsent = $totalStudents - $totalPresent;

        // --- Stream Insights ---
        $streams = Stream::with('courses')->get();

        $streamStats = $streams->map(function ($stream) use ($today) {
            // Get all students registered for any course in this stream
           $studentIds = CourseRegistration::whereHas('course', function ($q) use ($stream) {
    $q->where('stream_id', $stream->id);
})->pluck('student_id')->unique();


            $totalStudents = $studentIds->count();

            $presentCount = Attendance::whereIn('student_id', $studentIds)
                ->whereDate('marked_at', $today)
                ->distinct('student_id')
                ->count('student_id');

            return [
                'stream' => $stream->name,
                'total_students' => $totalStudents,
                'present' => $presentCount,
                'absent' => $totalStudents - $presentCount,
                'attendance_rate' => $totalStudents > 0
                    ? round(($presentCount / $totalStudents) * 100, 1)
                    : 0,
            ];
        });

        // --- Event Insights ---
        $events = Event::whereDate('date', $today)->get()->map(function ($event) use ($today) {
            // Find a course whose CODE matches the event TITLE
            $course = Course::where('code', $event->title)->first();

            $streamName = $course
                ? $course->stream->name
                : 'General';

            $presentCount = Attendance::where('event_id', $event->id)
                ->whereDate('marked_at', $today)
                ->distinct('student_id')
                ->count('student_id');

            return [
                'title' => $event->title,
                'stream' => $streamName,
                'present' => $presentCount,
            ];
        });

        return response()->json([
            'date' => $today,
            'overview' => [
                'total_students' => $totalStudents,
                'total_events' => $totalEvents,
                'total_present' => $totalPresent,
                'total_absent' => $totalAbsent,
            ],
            'streams' => $streamStats,
            'events' => $events,
        ]);
    }
}
