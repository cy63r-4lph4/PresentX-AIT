<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
       public function halls()
    {
        return $this->hasMany(Hall::class);
    }
}
