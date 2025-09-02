<?php

// app/Models/Admin.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['name', 'email'];

    public function getRoleAttribute()
    {
        return 'admin';
    }

}
