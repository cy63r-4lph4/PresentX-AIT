<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

}
