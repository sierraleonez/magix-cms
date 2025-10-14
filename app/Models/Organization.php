<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;
    protected $hidden = [
        'members'
    ];

    protected $fillable = [
        'organization_name',
        'description',
        'is_public'
    ];

    public function members(): HasMany {
        return $this->hasMany(OrganizationMember::class);
    }

    public function courses(): HasMany {
        return $this->hasMany(Course::class);
    }


}
