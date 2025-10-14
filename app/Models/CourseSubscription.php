<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSubscription extends Model
{
    protected $fillable = [
        'payment_id',
        'expired_at',
        'course_id',
        'organization_member_id'
    ];
}
