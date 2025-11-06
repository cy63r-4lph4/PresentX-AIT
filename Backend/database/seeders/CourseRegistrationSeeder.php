<?php

namespace Database\Seeders;

use App\Models\CourseRegistration;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseRegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CourseRegistration::insert([
          
            [
                'course_code' => 'MGT101',
                'stream_id' => 1,
                'student_id' => 'ADS23B00229Y',
                'academic_year_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'course_code' => 'UFS101',
                'stream_id' => 1,
                'student_id' => 'ADS23B00001Y',
                'academic_year_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'course_code' => 'MATH101',
                'stream_id' => 1,
                'student_id' => 'ADS23B00002Y',
                'academic_year_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'course_code' => 'MATH101',
                'stream_id' => 1,
                'student_id' => 'ADS23B00001Y',
                'academic_year_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'course_code' => 'ENGL101',
                'stream_id' => 1,
                'student_id' => 'ADS23B00229Y',
                'academic_year_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]

        ]);
    }
}
