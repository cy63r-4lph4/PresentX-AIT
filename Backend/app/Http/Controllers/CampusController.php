<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    function index()
    {

        return response()->json(Campus::all());
    }
}
;
