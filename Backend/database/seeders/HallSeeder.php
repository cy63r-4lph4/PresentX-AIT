<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hall;
use App\Models\Campus;

class HallSeeder extends Seeder
{
    public function run(): void
    {
        $kccId = Campus::where('name', operator: 'KCC')->value('id');
        $seaviewId = Campus::where('name', operator: 'Seaview')->value('id');

        $halls = [
            'OH', 'UH', 'A3-1', 'A3-2', 'A2-1', 'A2-2', 'B3-1', 'B3-2'
        ];
         $halls2 = [
            'EB01', 'EB02','EB11', 'EB12', 'EB21', 'EB22', 'EB31', 'EB32','Conference Room',
        ];

        foreach ($halls as $name) {
            Hall::firstOrCreate(
                ['name' => $name],
                ['campus_id' => $kccId]
            );
        }
        foreach ($halls2 as $name) {
            Hall::firstOrCreate(
                ['name' => $name],
                ['campus_id' => $seaviewId]
            );
        }
    }
}
