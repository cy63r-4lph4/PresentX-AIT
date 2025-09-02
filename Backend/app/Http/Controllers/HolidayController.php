<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index()
    {
        return Holiday::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'date' => 'required|date',
        ]);

        return Holiday::create($validated);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $validated = $request->validate([
            'title' => 'string',
            'date' => 'date',
        ]);

        $holiday->update($validated);
        return $holiday;
    }

    public function destroy(Holiday $holiday)
    {
        $holiday->delete();
        return response()->json(['message' => 'Holiday deleted']);
    }
}
