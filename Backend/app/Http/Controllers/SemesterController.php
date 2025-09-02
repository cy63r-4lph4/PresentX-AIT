<?php
namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;

class SemesterController extends Controller
{
    public function index()
    {
        return Semester::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        return Semester::create($validated);
    }

    public function show(Semester $semester)
    {
        return $semester;
    }

    public function update(Request $request, Semester $semester)
    {
        $validated = $request->validate([
            'title' => 'string',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
        ]);

        $semester->update($validated);
        return $semester;
    }

    public function destroy(Semester $semester)
    {
        $semester->delete();
        return response()->json(['message' => 'Semester deleted']);
    }
}
