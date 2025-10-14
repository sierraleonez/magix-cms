<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseProgress extends Model
{
    protected $fillable = [
        'course_material_id',
        'course_member_id',
        'is_finished',
        'user_id'
    ];

    public function course_material(): BelongsTo {
        return $this->belongsTo(CourseMaterial::class);
    }

    public function course_member(): BelongsTo {
        return $this->belongsTo(CourseMember::class);
    }
}
