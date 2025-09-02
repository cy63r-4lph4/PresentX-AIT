<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    public function semester()
{
    return $this->belongsTo(Semester::class);
}

}
