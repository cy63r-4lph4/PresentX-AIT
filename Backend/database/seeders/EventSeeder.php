<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Hall;
use App\Models\AcademicYear;
use Illuminate\Support\Carbon;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure a current academic year exists or create one
        $academicYear = AcademicYear::firstOrCreate(
            ['year' => '2024/2025', 'semester' => 'Sem 1'],
            ['is_current' => true]
        );

        // Mark all others as not current
        AcademicYear::where('id', '!=', $academicYear->id)
            ->update(['is_current' => false]);

        // Load all relevant halls into a lookup map
        $hallMap = Hall::whereIn('name', [
            'OH',
            'UH',
            'A3-1',
            'A3-2'
        ])->pluck('id', 'name');

        $streamId = 3;
        $baseSaturday = Carbon::create(2025, 7, 5);
        $baseSunday = Carbon::create(2025, 7, 6);

        $events = [
            ['title' => 'ENGL101', 'description' => 'ENGL101 - Sarah Nyarko', 'hall' => 'OH', 'date' => $baseSaturday, 'start_time' => '07:00', 'end_time' => '09:00'],

        ];

        foreach ($events as $event) {
            $hallId = $hallMap[$event['hall']] ?? null;

            if (!$hallId) {
                echo "⚠️  Skipping: Hall '{$event['hall']}' not found.\n";
                continue;
            }

            Event::create([
                'title' => $event['title'],
                'description' => $event['description'],
                'type' => 'recurring',
                'date' => $event['date']->toDateString(),
                'start_time' => $event['start_time'],
                'end_time' => $event['end_time'],
                'hall_id' => $hallId,
                'streams' => [$streamId],
                'academic_year_id' => $academicYear->id,
            ]);

        }
    }
}
