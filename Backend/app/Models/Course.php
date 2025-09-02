<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'stream_id', 'lecturer_id'];

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }

    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class);
    }
}
