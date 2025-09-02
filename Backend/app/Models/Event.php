<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'start_time',
        'end_time',
        'date',
        'end_date',
        'hall_id',
        'academic_year_id',
        'streams',
        'description',
    ];

    protected $casts = [
        'streams' => 'array',
        'date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // Remove unless you are modeling sub-events
    // public function events()
    // {
    //     return $this->hasMany(Event::class);
    // }

    // If you have a holidays system:
    public function holidays()
    {
        return $this->hasMany(Holiday::class);
    }
}
