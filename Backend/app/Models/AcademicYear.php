<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'semester',
        'is_current',
    ];

    protected $casts = [
        'is_current' => 'boolean',
    ];

    // Static method to get the current academic year
    public static function current()
    {
        return self::where('is_current', true)->first();
    }

    // Relationship: One academic year has many events
    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
