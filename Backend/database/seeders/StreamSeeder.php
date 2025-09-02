<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Stream;


class StreamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $streams = ['Seaview Regular', 'KCC Evening', 'KCC Weekend', 'Seaview Weekend'];
        foreach ($streams as $name) {
            Stream::create(['name' => $name]);
        }
    }
}
