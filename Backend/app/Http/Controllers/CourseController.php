<?php

// app/Http/Controllers/CourseController.php

namespace App\Http\Controllers;

use App\Models\Course;
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
}
