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
                'first_name' => 'Emmanuel Barry',
                'last_name' => 'Amewuho',
                'student_id' => 'ADS23B00229Y',
                'email' => 'student1@presentx.test',
                'phone' => '0599306715',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
