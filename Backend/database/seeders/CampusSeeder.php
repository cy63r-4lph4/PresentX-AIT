<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Campus;

class CampusSeeder extends Seeder
{
    public function run(): void
    {
        Campus::firstOrCreate(['name' => 'KCC']);
        Campus::firstOrCreate(['name' => 'Seaview']);
    }
}
