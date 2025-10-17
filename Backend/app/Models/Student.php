<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Model
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = ['phone', 'device_fingerprint'];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function courseRegistrations()
    {
        return $this->hasMany(CourseRegistration::class);
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'course_registrations')
                    ->withTimestamps();
    }
}

