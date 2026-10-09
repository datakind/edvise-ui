<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EdaDashboardTest extends TestCase
{
    use DatabaseTransactions;

    public function test_pdp_school_user_sees_eda_dashboard(): void
    {
        $user = User::factory()->create([
            'accepted_terms' => true,
            'access_type' => 'MODEL_OWNER',
            'inst_id' => '942d4b0e12e74d2a91879508ae3cef7c',
        ]);
        $this->fakeInstitution($user->inst_id, 'pdp-1', true);

        $response = $this->actingAs($user)->withSession([
            'api_jwt' => $this->jwt(),
        ])->get('/eda-dashboard');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('EdaDashboard'));
        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/institutions/'.$user->inst_id));
    }

    public function test_non_pdp_school_user_is_sent_home(): void
    {
        $user = User::factory()->create([
            'accepted_terms' => true,
            'access_type' => 'MODEL_OWNER',
            'inst_id' => '942d4b0e12e74d2a91879508ae3cef7c',
        ]);
        $this->fakeInstitution($user->inst_id, null, false);

        $response = $this->actingAs($user)->withSession([
            'api_jwt' => $this->jwt(),
        ])->get('/eda-dashboard');

        $response->assertRedirect(route('home'));
    }

    public function test_datakinder_with_selected_pdp_institution_sees_eda_dashboard(): void
    {
        $user = User::factory()->create([
            'accepted_terms' => true,
            'access_type' => 'DATAKINDER',
        ]);
        $instId = '942d4b0e12e74d2a91879508ae3cef7c';
        Http::fake([
            '*' => Http::response(['batches' => [['batch_id' => 'b1']]], 200),
        ]);

        $response = $this->actingAs($user)->withSession([
            'api_jwt' => $this->jwt(),
            'institution' => ['inst_id' => $instId, 'pdp_id' => 'pdp-1'],
        ])->get('/eda-dashboard');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('EdaDashboard'));
    }

    private function fakeInstitution(string $instId, ?string $pdpId, bool $withBatch): void
    {
        Http::fake(function ($request) use ($instId, $pdpId, $withBatch) {
            if (str_ends_with($request->url(), '/institutions/'.$instId)) {
                return Http::response([
                    'inst_id' => $instId,
                    'pdp_id' => $pdpId,
                ], 200);
            }
            if ($withBatch && str_ends_with($request->url(), '/input')) {
                return Http::response(['batches' => [['batch_id' => 'b1']]], 200);
            }

            return Http::response([], 404);
        });
    }

    private function jwt(): string
    {
        $payload = rtrim(strtr(base64_encode(json_encode(['exp' => time() + 3600], JSON_THROW_ON_ERROR)), '+/', '-_'), '=');

        return 'eyJhbGciOiJub25lIn0.'.$payload.'.x';
    }
}
