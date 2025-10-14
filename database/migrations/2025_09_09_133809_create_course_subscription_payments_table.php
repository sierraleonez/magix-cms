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
        Schema::create('course_subscription_payments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('course_id');
            $table->foreignId('organization_member_id');
            $table->integer('amount_payment');
            $table->enum('payment_status', [
                "success",
                "pending",
                "failed"
            ]);
            $table->string("payment_method");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_subscription_payments');
    }
};
