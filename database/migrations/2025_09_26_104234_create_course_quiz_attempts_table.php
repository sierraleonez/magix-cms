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
        Schema::create('course_quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table
                ->foreignId('course_material_id')
                ->constrained()
                ->onDelete('cascade');
            $table
                ->foreignId('course_member_id')
                ->constrained()
                ->onDelete('cascade');
            $table->integer('score');
            $table->json('attempt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_quiz_attempts');
    }
};
