<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }
}
