<?php

// app/Http/Controllers/CourseController.php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\Student;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    // GET /device
   public function index(Request $request)
{
    $studentCode = $request->input('student_id'); // e.g. "S001"

    $student = Student::where('student_id', $studentCode)->first();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student not found',
        ], 404);
    }

    // Look up device using student_id (string)
    $device = Device::where('student_id', $student->student_id)->first();

    return response()->json([
        'success' => true,
        'student' => [
            'id' => $student->id,              // numeric PK
            'student_id' => $student->student_id, // "S001"
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'email' => $student->email,
            'phone' => $student->phone,
        ],
        'has_device' => $device !== null,
        'device' => $device ? [
            'id' => $device->id,
            'fingerprint' => $device->device_fingerprint,
        ] : null,
    ]);
}
public function reset(Request $request)
{
    $request->validate([
        'student_id' => 'required|exists:students,student_id',
    ]);

    $studentId = $request->input('student_id');

    $student = Student::where('student_id', $studentId)->first();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student not found',
        ], 404);
    }

    // Delete the device record associated with this student
    Device::where('student_id', $student->student_id)->delete();

    return response()->json([
        'success' => true,
        'message' => 'Device reset successfully',
    ]);



}
    // POST /device/reset
}
