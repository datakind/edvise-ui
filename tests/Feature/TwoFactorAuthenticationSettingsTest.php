<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class TwoFactorAuthenticationSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_two_factor_authentication_can_be_enabled(): void
    {
        if (! Features::canManageTwoFactorAuthentication()) {
            $this->markTestSkipped('Two factor authentication is not enabled.');
        }

        $this->actingAs($user = User::factory()->create());

        $this->withSession(['auth.password_confirmed_at' => time()]);

        $response = $this->post('/user/two-factor-authentication');

        $this->assertNotNull($user->refresh()->two_factor_secret);
        $this->assertCount(8, $user->refresh()->recoveryCodes());
    }

    public function test_recovery_codes_can_be_regenerated(): void
    {
        if (! Features::canManageTwoFactorAuthentication()) {
            $this->markTestSkipped('Two factor authentication is not enabled.');
        }

        $this->actingAs($user = User::factory()->create());

        $this->withSession(['auth.password_confirmed_at' => time()]);

        $this->post('/user/two-factor-authentication');
        $this->post('/user/two-factor-recovery-codes');

        $oldCodes = $user->refresh()->recoveryCodes();

        $this->post('/user/two-factor-recovery-codes');

        $this->assertCount(8, $oldCodes);
        $this->assertCount(8, array_diff($oldCodes, $user->refresh()->recoveryCodes()));
    }

    public function test_two_factor_authentication_can_be_disabled(): void
    {
        if (! Features::canManageTwoFactorAuthentication()) {
            $this->markTestSkipped('Two factor authentication is not enabled.');
        }

        $this->actingAs($user = User::factory()->create());

        $this->withSession(['auth.password_confirmed_at' => time()]);

        $this->post('/user/two-factor-authentication');

        $this->assertNotNull($user->refresh()->two_factor_secret);

        $this->delete('/user/two-factor-authentication');

        $this->assertNull($user->refresh()->two_factor_secret);
    }
}
