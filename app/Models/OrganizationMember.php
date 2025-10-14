<?php

namespace App\Models;

use Google\Service\Classroom\Resource\Courses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrganizationMember extends Model
{
    use HasFactory;

    protected $hidden = [
        'role',
        'user'
    ];

    protected $fillable = [
        'user_id',
        'organization_id',
        'organization_role_id'
    ];

    protected $appends = ['role_name', 'name', 'email'];

    public function role(): BelongsTo
    {
        return $this->belongsTo(OrganizationRole::class, 'organization_role_id');
    }

    public function courses(): HasMany {
        return $this->hasMany(Course::class, 'organization_id', 'organization_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRoleNameAttribute() {
        return $this->role ? $this->role->role_name : null;
    }
    
    public function getNameAttribute() {
        return $this->user ? $this->user->name : null;
    }

    public function getEmailAttribute() {
        return $this->user ? $this->user->email : null;
    }
}
