<?php

namespace Database\Seeders;

use App\Models\Password;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PasswordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Password::insert([
            [
                'user_id' => 'A002',
                'password' => Hash::make('adminpass'),
            ],
            [
                'user_id' => 'L001',
                'password' => Hash::make('lecturerpass'),
            ],
            [
                'user_id' => 'ADS23B00229Y',
                'password' => Hash::make('studentpass'),
            ],
        ]);
    }
}
