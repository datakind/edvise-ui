<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTeamTest extends TestCase
{
    use RefreshDatabase;

    public function test_teams_can_be_created(): void
    {
        $this->actingAs($user = User::factory()->withPersonalTeam()->create());

        $response = $this->post('/teams', [
            'name' => 'Test Team',
        ]);

        $owned = $user->fresh()->ownedTeams;
        $this->assertCount(2, $owned);
        $this->assertEquals(
            'Test Team',
            $owned->firstWhere('personal_team', false)->name
        );
    }
}
