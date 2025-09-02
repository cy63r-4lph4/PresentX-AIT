<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
       public function run(): void
    {
        Admin::insert([
            [
                'name' => 'Super Admin',
                'admin_id' => 'A002',
                'email' => 'superadmin@presentx.test',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
