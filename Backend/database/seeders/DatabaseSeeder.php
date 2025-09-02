<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CampusSeeder::class,
            HallSeeder::class,
            AdminSeeder::class,
            LecturerSeeder::class,
            StudentSeeder::class,
            StreamSeeder::class,
            AcademicYearSeeder::class,
            CourseSeeder::class,
            EventSeeder::class,
            PasswordSeeder::class,
            SuperAdminSeeder::class,
            CourseRegistrationSeeder::class,
        ]);
    }

}
