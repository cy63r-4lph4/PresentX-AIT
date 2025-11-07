<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceToken;
use App\Models\CourseRegistration;
use App\Models\Event;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;



class AttendanceController extends Controller
{
  private function sendSms($to, $message)
{
    $username = env('AFRICASTALKING_USERNAME', 'sandbox');
    $apiKey = env('AFRICASTALKING_API_KEY');
    $url = 'https://api.sandbox.africastalking.com/version1/messaging';

    try {
        $response = Http::withHeaders([
            'apiKey' => $apiKey,
            'Accept' => 'application/json',
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])
        ->asForm()
        ->post($url, [
            'username' => $username,
            'to' => $to,
            'message' => $message,
            'from' => '11231',
        ]);


        // ✅ Some failures are reported as success with error messages
        $json = $response->json();

        return $json;
    } catch (\Throwable $e) {
        Log::error('🚨 Exception when sending SMS', [
            'error' => $e->getMessage(),
            'to' => $to,
            'trace' => $e->getTraceAsString(),
        ]);
        return null;
    }
}


 public function index($eventId)
{
    $today = now()->toDateString();
    $event=Event::where('id', $eventId)->first();
    $registered = CourseRegistration::where('course_code', $event->title)->count();

    $attendances = Attendance::with('student')
        ->where('event_id', $eventId)
        ->whereDate('marked_at', $today) // ✅ only today
        ->get()
        ->map(function ($a) {
            return [
                'id' => $a->id,
                'name' => optional($a->student)->name,
                'student_id' => $a->student_id,
                'stream' => optional($a->student)->stream,
                'method' => $a->method,
                'time' => $a->marked_at->format('h:i A'),
                'is_registered' => $a->is_registered,
            ];
        });

    $presentCount = $attendances->count();
    $turnover = $registered > 0 ? round(($presentCount / $registered) * 100, 2) : 0;

    return response()->json([
        'registered_count' => $registered,
        'total_present' => $presentCount,
        'turnover_rate' => $turnover,
        'students' => [
            'registered' => $attendances->where('is_registered', true)->values(),
            'unregistered' => $attendances->where('is_registered', false)->values(),
        ],
    ]);
}





    public function mark(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,student_id',
            'token' => 'required|string',
            'method' => 'nullable|in:qr,sms,manual',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid request.',
                'errors' => $validator->errors()
            ], 422);
        }

        $token = AttendanceToken::where('token', $request->token)
            ->where('is_active', true)
            ->first();

        if (!$token) {
            return response()->json([
                'message' => 'Invalid or inactive attendance token.'
            ], 404);
        }
        Log::info('Marking attendance', [
            'student_id' => $request->student_id,
            'event_id_from_token' => $token->event_id,
        ]);


        $now = Carbon::now();
        if ($now->lt($token->starts_at) || $now->gt($token->expires_at)) {
            return response()->json([
                'message' => 'This token is not valid at this time.'
            ], 403);
        }

        $alreadyMarked = Attendance::where('student_id', $request->student_id)
            ->where('event_id', $token->event_id)
            ->exists();

        if ($alreadyMarked) {
            return response()->json([
                'message' => 'Attendance already marked for this event.'
            ], 409);
        }

        $isRegistered = CourseRegistration::where('student_id', $request->student_id)
            ->where('course_code', $token->event->course_id ?? null)
            ->exists();

        $attendance = Attendance::create([
            'student_id' => $request->student_id,
            'event_id' => $token->event_id,
            'method' => $request->input('method', 'qr'),
            'marked_at' => now(),
            'is_registered' => $isRegistered,
        ]);

        return response()->json([
            'message' => 'Attendance marked successfully.',
            'attendance' => $attendance
        ], 201);
    }

    public function markAuthenticated(Request $request)
    {
        $user = auth()->user();


        if (!$user instanceof Student) {
            return response()->json([
                'message' => 'Unauthorized. Only students can mark attendance this way.'
            ], 403);
        }

        $request->merge([
            'student_id' => $user->student_id,
            'method' => 'qr'
        ]);

        return $this->mark($request);
    }


public function markBySms(Request $request)
{
    Log::info('📩 markBySms() called', ['payload' => $request->all()]);

    // Get sender and message
    $from = $request->input('from') ?? $request->input('phone');

    // Some gateways use "text" instead of "body" or "message"
    $body = trim(
        $request->input('body') ??
        $request->input('message') ??
        $request->input('text') ??
        ''
    );


    // Normalize phone
    $normalized = preg_replace('/^\+233/', '0', $from);
    $international = preg_replace('/^0/', '+233', $from);
    Log::debug('Normalized phone numbers', [
        'normalized' => $normalized,
        'international' => $international,
    ]);

    // Find student by phone
    $student = Student::where('phone', $from)
        ->orWhere('phone', $normalized)
        ->orWhere('phone', $international)
        ->first();

    if (!$student) {
        Log::warning('Student not found for number', ['from' => $from]);
        $this->sendSms($from, "❌ PresentX: Your number is not registered. Please contact admin.");
        return response()->json(['message' => 'Student not found'], 200);
    }

  

    // Token from SMS body
    $tokenValue = strtoupper(trim($body)); // optional normalization

    $token = AttendanceToken::where('sms_code', $tokenValue)
        ->where('is_active', true)
        ->first();

    if (!$token) {
        Log::warning('Invalid or inactive token', ['token' => $tokenValue]);
        $this->sendSms($from, "❌ PresentX: Invalid or inactive attendance token.");
        return response()->json(['message' => 'Invalid or inactive attendance token.'], 200);
    }

    Log::info('Valid token found', [
        'token_id' => $token->id,
        'event_id' => $token->event_id,
        'valid_from' => $token->starts_at,
        'valid_until' => $token->expires_at,
    ]);

    $now = Carbon::now();
    if ($now->lt($token->starts_at) || $now->gt($token->expires_at)) {
        Log::warning('Token expired or not yet active', [
            'now' => $now,
            'starts_at' => $token->starts_at,
            'expires_at' => $token->expires_at,
        ]);
        $this->sendSms($from, "⚠️ PresentX: This attendance token has expired or is not yet active.");
        return response()->json(['message' => 'Token expired or inactive.'], 200);
    }

    $alreadyMarked = Attendance::where('student_id', $student->student_id)
        ->where('event_id', $token->event_id)
        ->exists();

    if ($alreadyMarked) {
        Log::info('Attendance already marked', [
            'student_id' => $student->student_id,
            'event_id' => $token->event_id,
        ]);
        $this->sendSms($from, "ℹ️ PresentX: Your attendance has already been marked for this session.");
        return response()->json(['message' => 'Already marked.'], 200);
    }

    $isRegistered = CourseRegistration::where('student_id', $student->student_id)
        ->where('course_code', $token->event->course_id ?? null)
        ->exists();

    Log::debug('Course registration check', [
        'student_id' => $student->student_id,
        'course_code' => $token->event->course_id ?? null,
        'is_registered' => $isRegistered,
    ]);

    $attendance = Attendance::create([
        'student_id' => $student->student_id,
        'event_id' => $token->event_id,
        'method' => 'sms',
        'marked_at' => now(),
        'is_registered' => $isRegistered,
    ]);

    Log::info('Attendance created successfully', [
        'attendance_id' => $attendance->id,
        'student_id' => $student->student_id,
        'event_id' => $token->event_id,
    ]);

    $this->sendSms($from, "✅ PresentX: Hi {$student->first_name}, your attendance for event {$token->event_id} has been successfully marked.");
    Log::info('SMS confirmation sent', ['to' => $from]);

    return response()->json([
        'message' => 'Attendance marked successfully via SMS.',
        'attendance' => $attendance
    ], 201);
}

public function getSessionsSoFar($event){
    
}
}
