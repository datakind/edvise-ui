<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * institutions duplicated API inst; no app code used this table.
     * Staging verified 2026-06-24: table absent on all_tables (safe no-op drop).
     */
    public function up(): void
    {
        Schema::dropIfExists('institutions');
    }

    public function down(): void
    {
        // Intentionally empty — institution data lives in edvise-api inst table.
    }
};
