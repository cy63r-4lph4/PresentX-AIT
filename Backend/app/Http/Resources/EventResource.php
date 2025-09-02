<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class EventResource extends JsonResource
{
    public function toArray($request)
    {
        $time = fn($time) => \Carbon\Carbon::parse($time)->format('H:i');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'hall_id' => $this->hall_id,
            'streams' => $this->streams,
            'date' => optional(Carbon::parse($this->date))->format('Y-m-d'),
            'start_time' => $time($this->start_time),
            'end_time' => $time($this->end_time),
            'type' => $this->type,
            'description' => $this->description,
            'academic_year' => new AcademicYearResource($this->whenLoaded('academicYear')),
        ];
    }
}
