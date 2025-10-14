<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseQuiz extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'options',
        'reason',
        'created_by',
        'course_material_id'
    ];

    protected $casts = [
        'question' => 'array',
        'options' => 'array'
    ];
}
