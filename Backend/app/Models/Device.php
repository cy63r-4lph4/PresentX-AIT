<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = ['student_id', 'device_fingerprint'];

   public function student()
{
    return $this->belongsTo(Student::class, 'student_id', 'student_id');
}

}
