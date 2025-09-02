<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('admin_id')->unique(); // Unique identifier for the admin
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique(); // Unique identifier for the student

            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->timestamps();
        });

        Schema::create('lecturers', function (Blueprint $table) {
            $table->id();
            $table->string('lecturer_id')->unique(); // Unique identifier for the lecturer
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps();
        });

        Schema::create('streams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('title');
            $table->foreignId('stream_id')->constrained()->onDelete('cascade');
            $table->string('lecturer_id');
            $table->foreign('lecturer_id')->references('lecturer_id')->on('lecturers')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['code', 'stream_id']);
        });

        Schema::create('course_registrations', function (Blueprint $table) {
    $table->id();

    $table->string('student_id');
    $table->foreign('student_id')
        ->references('student_id')
        ->on('students')
        ->onDelete('cascade');

    $table->string('course_code');
    $table->foreign('course_code')
        ->references('code')
        ->on('courses')
        ->onDelete('cascade');

    $table->foreignId('academic_year_id') 
        ->constrained('academic_years')
        ->onDelete('cascade');

    $table->foreignId('stream_id')
        ->constrained('streams')
        ->onDelete('cascade');

    $table->timestamps();

    $table->unique(
        ['student_id', 'course_code', 'academic_year_id', 'stream_id'], // ✅ updated column name
        'uniq_reg'
    );
});


    }

    public function down(): void
    {
        Schema::dropIfExists('course_registrations');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('streams');
        Schema::dropIfExists('lecturers');
        Schema::dropIfExists('students');
        Schema::dropIfExists('admins');
    }
};
