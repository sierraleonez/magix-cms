<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class CourseMember extends Model
{
    protected $fillable = [
        'organization_member_id',
        'course_id',
        'user_id'
    ];

    public function detail(): HasOneThrough {
        return $this->hasOneThrough(User::class, OrganizationMember::class, 'id', 'id', 'organization_member_id', 'user_id');
    }

    public function organization_member(): BelongsTo {
        return $this->belongsTo(OrganizationMember::class);
    }
}
