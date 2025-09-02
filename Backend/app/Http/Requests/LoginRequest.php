<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|string',
            'password' => 'required|string',
            // 'user_type' => 'required|in:student,admin,lecturer',
            'fingerprint' => 'nullable|string',
        ];
    }
}
