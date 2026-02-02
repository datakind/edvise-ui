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
        Schema::create('institutions', function (Blueprint $table) {
            $table->string('id', 32)->primary();
            $table->string('name', 255)->unique();
            $table->integer('retention_days')->nullable();
            $table->json('allowed_emails')->nullable();
            $table->json('schemas')->nullable();
            $table->string('state', 36)->nullable();
            $table->string('pdp_id', 36)->nullable();
            $table->string('created_by', 32)->nullable();
            $table->string('edvise_id', 36)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
