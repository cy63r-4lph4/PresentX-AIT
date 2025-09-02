<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;

class HallController extends Controller
{
    public function index(Request $request)
{
    $campusIds = $request->query('campus_ids', []);

    if (!is_array($campusIds)) {
        $campusIds = [$campusIds];
    }

    $query = Hall::query();

    if (!empty($campusIds)) {
        $query->whereIn('campus_id', $campusIds);
    }

    return response()->json($query->get());
}


}
