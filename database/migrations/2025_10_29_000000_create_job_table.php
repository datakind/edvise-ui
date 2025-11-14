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
        Schema::create('job', function (Blueprint $table) {
            $table->id(); // bigint primary key, auto_increment
            $table->char('model_id', 32)->index(); // Foreign key to models table
            $table->char('created_by', 32); // User UUID who created the job
            $table->dateTime('triggered_at'); // When the job was triggered
            $table->string('batch_name', 255); // Batch identifier
            $table->string('output_filename', 255)->nullable(); // Output file name
            $table->string('err_msg', 255)->nullable(); // Error message if failed
            $table->boolean('completed')->nullable(); // Is the job completed?
            $table->boolean('output_valid')->nullable(); // Is output validated by Datakinder?
            $table->string('model_run_id', 150)->nullable(); // The model run ID we need!
            $table->string('model_version', 50)->nullable(); // Model version used

            // Indexes for common queries
            $table->index(['model_id', 'completed', 'output_valid']);
            $table->index('triggered_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job');
    }
};






