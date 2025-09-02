<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Password;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create the super admin
        $admin = Admin::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@presentx.work',
            'admin_id' => 'A001', // Unique identifier for the admin
        ]);

        // Create password for the admin
        Password::create([
            'user_id' => $admin->admin_id, // Use the admin_id as the user_id
            'password' => Hash::make('supersecure123'),
        ]);
    }
}

