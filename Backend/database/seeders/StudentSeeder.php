<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Student::insert([
            [
                'first_name' => 'Student',
                'last_name' => 'Name',
                'student_id' => 'S001',
                'email' => 'student1@presentx.test',
                'phone' => '1234567890',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
