<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Course extends Model
{
    protected $fillable = [
        'name',
        'description',
        'tags',
        'organization_id',
        'created_by',
        'is_paid',
        'subscription_price'
    ];

    public function course_topics(): HasMany {
        return $this->hasMany(CourseTopic::class);
    }

    public function course_members(): HasMany {
        return $this->hasMany(CourseMember::class);
    }

    public function course_materials(): HasManyThrough {
        return $this->hasManyThrough(CourseMaterial::class, CourseTopic::class);
    }
}
