<?php

namespace Database\Seeders;

use App\Models\OrganizationRole;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // User::factory(10)->create();
        $roles = ["admin", "teacher", "student"];
        $organization_roles = ["owner", "supervisor", "admin", "teacher", "student"];

        foreach ($roles as $role) {
            Role::factory()->create([
                'role_name' => $role
            ]);
        }

        foreach ($organization_roles as $role) {
            OrganizationRole::factory()->create([
                'role_name' => $role
            ]);
        }

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
