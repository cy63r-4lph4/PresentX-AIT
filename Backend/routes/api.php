<?php
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\StudentController;
use App\Models\Attendance;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;




Route::prefix('login')->group(function () {
    Route::post('/student', [AuthController::class, 'studentLogin']);
    Route::post('/admin', [AuthController::class, 'adminLogin']);
    Route::post('/lecturer', [AuthController::class, 'lecturerLogin']);
});
    Route::post('attendance/sms',  [AttendanceController::class, 'markBySms']);

Route::middleware('auth:sanctum')->group(
    function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('events/today', [EventController::class, 'getTodaysEventsForStudent']);
        Route::post('/attendance/mark', [AttendanceController::class, 'markAuthenticated']);
            Route::get('/student/courses', [CourseController::class, 'studentCourses']);
                        Route::get('/student/details', [StudentController::class, 'details']);


    }
);


Route::middleware(['auth:sanctum', 'role.admin'])->group(
    function () {
        Route::apiResource('semesters', SemesterController::class);
        Route::apiResource('events', EventController::class);
        Route::apiResource('holidays', HolidayController::class);
        Route::apiResource('attendance', AttendanceController::class);
        Route::get('campuses', [CampusController::class, 'index']);
        Route::get('halls', [HallController::class, 'index']);
        Route::get('courses', [CourseController::class, 'index']);
        Route::get('device', [DeviceController::class, 'index']);
        Route::post('device/reset', [DeviceController::class, 'reset']);
        Route::get('/dashboard/overview', [DashboardController::class, 'overview']);



    }
);

Route::middleware(['auth:sanctum', 'role.lecturer'])->group(function () {
    // Route::apiResource('semesters', SemesterController::class);
    Route::get('myevents', [EventController::class, 'lecturerEvents']);
    Route::get('token', [EventController::class, 'getTokenStatus']);
    Route::prefix('token')->group(function () {
        Route::post('extend', [EventController::class, 'extend']);
        Route::post('curtail', [EventController::class, 'curtail']);
        Route::post('invalidate', [EventController::class, 'invalidate']);
        Route::post('{eventId}', [EventController::class, 'generateToken']);


    });
Route::get('/lecturer/attendance/{eventId}', [AttendanceController::class, 'index']);



});


// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('events/today', [EventController::class, 'getTodaysEventsForStudent']);
// });
