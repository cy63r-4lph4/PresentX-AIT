<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'year' => $this->year,
            'semester' => $this->semester,
            'is_current' => (bool) $this->is_current,
        ];
    }
}
