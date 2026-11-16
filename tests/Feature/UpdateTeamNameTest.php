<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateTeamNameTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_names_can_be_updated(): void
    {
        $this->actingAs($user = User::factory()->withPersonalTeam()->create());

        $response = $this->put('/teams/'.$this->currentTeam($user)->id, [
            'name' => 'Test Team',
        ]);

        $this->assertCount(1, $user->refresh()->ownedTeams);
        $this->assertEquals('Test Team', $this->currentTeam($user)->refresh()->name);
    }
}
