<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsLecturer
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->role === 'lecturer') {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden. Lecturers only.'], 403);
    }
}
