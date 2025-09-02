<?php

// app/Models/Lecturer.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Lecturer extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['lecturer_id', 'name', 'email'];

    public function getRoleAttribute()
    {
        return 'lecturer';
    }

}

