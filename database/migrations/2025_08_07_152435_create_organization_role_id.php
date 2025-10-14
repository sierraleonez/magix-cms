<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organization_roles', function (Blueprint $table) {
            $table->id();
            $table->enum('role_name', [
                "owner",
                "admin",
                "supervisor",
                "teacher",
                "student"
            ])->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_roles');
    } 
};
