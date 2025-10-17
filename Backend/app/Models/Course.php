<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['code', 'title', 'stream_id', 'lecturer_id'];

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }

    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function courseRegistrations()
    {
        // A course can have many registrations — link by course_code → code
        return $this->hasMany(CourseRegistration::class, 'course_code', 'code');
    }
}
