<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseRegistration extends Model
{
    protected $fillable = ['student_id', 'event_id'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function course()
{
    return $this->belongsTo(Course::class, 'course_code', 'code');
}

}
