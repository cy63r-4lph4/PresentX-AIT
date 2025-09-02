<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\Password;
use App\Models\Student;
use App\Models\Admin;
use App\Models\Lecturer;
use App\Models\Device;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function studentLogin(LoginRequest $request)
    {
        $credentials = $request->validated();
        $fingerprint = $request->input('fingerprint');

        $passwordRecord = Password::where('user_id', $credentials['user_id'])->first();

        if (!$passwordRecord || !Hash::check($credentials['password'], $passwordRecord->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $student = Student::where('student_id', $credentials['user_id'])->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $boundDevice = Device::where('device_fingerprint', $fingerprint)->first();

        if ($boundDevice && $boundDevice->student_id !== $student->student_id) {
            return response()->json(['message' => 'This device is already registered to another student.'], 403);
        }

        if (!$boundDevice) {
            Device::create([
                'student_id' => $student->student_id,
                'device_fingerprint' => $fingerprint,
            ]);
        }

        // Always issue a new token
        $token = $student->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                ...$student->toArray(),
                'role' => 'student',
            ],
        ]);
    }



    public function adminLogin(LoginRequest $request)
    {
        return $this->loginUser($request, Admin::class);
    }

    public function lecturerLogin(LoginRequest $request)
    {
        return $this->loginUser($request, Lecturer::class);
    }

    protected function loginUser(LoginRequest $request, string $modelClass)
    {
        $credentials = $request->validated();

        $passwordRecord = Password::where('user_id', $credentials['user_id'])->first();

        if (!$passwordRecord || !Hash::check($credentials['password'], $passwordRecord->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $keyField = match ($modelClass) {
            Admin::class => 'admin_id',
            Lecturer::class => 'lecturer_id',
            Student::class => 'student_id',
            default => 'id',
        };

        $user = $modelClass::where($keyField, $credentials['user_id'])->first();

        if (!$user) {
            return response()->json(['message' => 'User not found in ' . $modelClass], 404);
        }

        // Always create a new token (allow multi-device login)
        $deviceName = $request->header('User-Agent') ?? 'auth_token';
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                ...$user->toArray(),
                'role' => class_basename($modelClass) === 'Lecturer' ? 'lecturer' : 'admin',
            ],
        ]);
    }



    public function logout()
    {
        auth()->user()?->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
