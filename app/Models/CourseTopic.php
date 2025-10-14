<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseTopic extends Model
{
    protected $fillable = [
        'course_id',
        'name',
        'description',
        'created_by'
    ];

    public function course(): BelongsTo {
        return $this->belongsTo(Course::class);
    }

    public function creator(): BelongsTo {
        return $this->belongsTo(OrganizationMember::class, 'created_by');
    }

    public function course_materials(): HasMany {
        return $this->hasMany(CourseMaterial::class);
    }
    
}
