<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrganizationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'organization_name' => 'required',
            'description' => 'required',
            'is_public' => 'required'
        ];
    }
};