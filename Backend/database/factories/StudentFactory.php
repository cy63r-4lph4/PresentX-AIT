<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'student_id' => strtoupper('S' . Str::random(6)),
        'first_name' => $this->faker->firstName,
        'last_name' => $this->faker->lastName,
        'email' => $this->faker->unique()->safeEmail,
        'phone' => $this->faker->unique()->phoneNumber,
    ];
    }
}
