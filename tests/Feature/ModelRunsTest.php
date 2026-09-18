<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ModelRunsTest extends TestCase
{
    use RefreshDatabase;

    public function test_model_runs_survives_created_by_user_missing_from_local_users(): void
    {
        $known = User::factory()->create([
            'accepted_terms' => true,
            'access_type' => 'INSTITUTION',
            'inst_id' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        ]);

        $jwtPayload = rtrim(strtr(base64_encode(json_encode(['exp' => time() + 3600])), '+/', '-_'), '=');
        $jwt = 'eyJhbGciOiJub25lIn0.'.$jwtPayload.'.x';

        Http::fake(function ($request) use ($known) {
            if (str_contains($request->url(), '/models/') && str_ends_with($request->url(), '/runs')) {
                return Http::response([
                    [
                        'run_id' => 'run-known',
                        'created_by' => $known->id,
                        'triggered_at' => '2025-02-25T19:48:43',
                        'completed' => false,
                        'output_filename' => null,
                    ],
                    [
                        'run_id' => 'run-missing',
                        'created_by' => '10421508026c464b93664ba893a02a87',
                        'triggered_at' => '2025-02-25T19:48:43',
                        'completed' => false,
                        'output_filename' => null,
                    ],
                ], 200);
            }

            return Http::response([], 200);
        });

        $response = $this->actingAs($known)->withSession([
            'api_jwt' => $jwt,
            'institution' => ['inst_id' => $known->inst_id],
        ])->get('/model/graduation_in_4y_ft_4y_pt_checkpoint_2_core_terms');

        $response->assertOk();
        $response->assertJsonPath('1.created_by', '10421508026c464b93664ba893a02a87');
    }
}
