<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@wedinclick.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('AdminPass2026'),
                'role' => 'admin',
                'phone' => '0555000000',
                'language_preference' => 'fr',
            ]
        );
    }
}
