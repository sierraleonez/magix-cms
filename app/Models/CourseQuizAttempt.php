<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseQuizAttempt extends Model
{
    protected $fillable = [
        'course_material_id',
        'course_member_id',
        'score',
        'attempt'
    ];

    protected $casts = [
        'attempt' => 'array'
    ];
}
