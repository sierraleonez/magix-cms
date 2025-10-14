<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSubscriptionPayment extends Model
{
    protected $fillable = [
        'course_id',
        'user_id',
        'amount_payment',
        'payment_status',
        'payment_method',
    ];
}
