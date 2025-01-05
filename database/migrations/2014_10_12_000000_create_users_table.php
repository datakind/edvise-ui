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
        Schema::create('users', function (Blueprint $table) {
            # Use uuid type for id.
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('google_id')->nullable();
            $table->string('azure_id')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->rememberToken();
            $table->foreignUuid('inst_id')->nullable();
            # team id != inst id (inst id cannot change once set)
            # TODO: team setup not yet integrated with user setup
            # $table->foreignUuid('current_team_id')->nullable();
            # DEFAULTS TO LIMITED_ACCESS
            # Only Datakind access type can set inst id for created/invited users. Otherwise all inst id are inherited.
            $table->string('access_type')->nullable();
            $table->string('profile_photo_path', 2048)->nullable();
            $table->timestamps();

            if (Fortify::confirmsTwoFactorAuthentication()) {
                $table->timestamp('two_factor_confirmed_at')
                    ->after('two_factor_recovery_codes')
                    ->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
