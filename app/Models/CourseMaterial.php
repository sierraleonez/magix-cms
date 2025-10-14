<?php

namespace App\Models;

use App\Enum\CourseMaterialType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CourseMaterial extends Model
{
    protected $fillable = [
        'course_topic_id',
        'title',
        'description',
        'content',
        'order',
        'created_by',
        'type'
    ];

    protected $casts = [
        'content' => 'array',
        'role' => CourseMaterialType::class
    ];

    public function courseTopic(): BelongsTo
    {
        return $this->belongsTo(CourseTopic::class);
    }


    public function courseQuiz(): HasMany
    {
        return $this->hasMany(CourseQuiz::class);
    }

    public function getCourseQuiz()
    {
        if ($this->type === CourseMaterialType::QUIZ) {
            return $this->courseQuiz()->get();
        }
        return collect();
    }

    public function progress(): HasOne
    {
        return $this
            ->hasOne(CourseProgress::class)
            ->select([
                'id',
                'is_finished',
                'course_material_id',
                'course_member_id'
            ]);
    }
}
