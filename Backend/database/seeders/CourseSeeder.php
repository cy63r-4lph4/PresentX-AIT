<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'code' => 'ENGL101',
                'title' => 'English Language I',
                'stream_id' => 4,
                'lecturer_id' => 'L001',
            ],
             [
                'code' => 'ENGL101',
                'title' => 'English Language I',
                'stream_id' => 3,
                'lecturer_id' => 'L001',
            ],
            [
                'code' => 'MGT101',
                'title' => 'Principles of Management',
                'stream_id' => 4,
                'lecturer_id' => 'L002',
            ],
             [
                'code' => 'MGT101',
                'title' => 'Principles of Management',
                'stream_id' => 1,
                'lecturer_id' => 'L002',
            ],
            [
                'code' => 'MGT101',
                'title' => 'Principles of Management',
                'stream_id' => 3,
                'lecturer_id' => 'L002',
            ],
            [
                'code' => 'UFS101',
                'title' => 'University Foundation Studies',
                'stream_id' => 4,
                'lecturer_id' => 'L003',
            ],
             [
                'code' => 'UFS101',
                'title' => 'University Foundation Studies',
                'stream_id' => 1,
                'lecturer_id' => 'L003',
            ],
            [
                'code' => 'MATH101',
                'title' => 'Mathematics I',
                'stream_id' => 1,
                'lecturer_id' => 'L004',
            ],
            [
                'code' => 'IT101',
                'title' => 'Introduction to IT',
                'stream_id' => 4,
                'lecturer_id' => 'L005',
            ],
            [
                'code' => 'ACCT101',
                'title' => 'Financial Accounting',
                'stream_id' => 4,
                'lecturer_id' => 'L006',
            ],
            [
                'code' => 'MKT101',
                'title' => 'Principles of Marketing',
                'stream_id' => 4,
                'lecturer_id' => 'L007',
            ],
            [
                'code' => 'COMM101',
                'title' => 'Business Communication',
                'stream_id' => 4,
                'lecturer_id' => 'L008',
            ],
            [
                'code' => 'CS101',
                'title' => 'Computer Systems',
                'stream_id' => 4,
                'lecturer_id' => 'L009',
            ],
            [
                'code' => 'SOC101',
                'title' => 'Introduction to Sociology',
                'stream_id' => 4,
                'lecturer_id' => 'L010',
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
