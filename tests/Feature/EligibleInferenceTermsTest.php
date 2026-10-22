<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class EligibleInferenceTermsTest extends TestCase
{
    use DatabaseTransactions;

    public function test_eligible_terms_proxy_forwards_model_and_batch(): void
    {
        config(['services.backend.url' => 'http://backend.test']);
        $user = User::factory()->create([
            'accepted_terms' => true,
            'access_type' => 'MODEL_OWNER',
            'inst_id' => '942d4b0e12e74d2a91879508ae3cef7c',
        ]);
        Http::fake([
            '*' => Http::response([
                'status' => 'valid',
                'terms' => [
                    ['term_label' => 'fall 2024-25', 'valid_student_count' => 4],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($user)->withSession([
            'api_jwt' => $this->jwt(),
            'institution' => ['inst_id' => $user->inst_id],
        ])->get('/eligible-inference-terms?model_name=retention&batch_name=batch_foo');

        $response->assertOk();
        $response->assertJsonPath('terms.0.term_label', 'fall 2024-25');
        $response->assertJsonPath('terms.0.valid_student_count', 4);
        Http::assertSent(function ($request) use ($user) {
            return $request->method() === 'GET'
                && str_contains($request->url(), '/institutions/'.$user->inst_id.'/eligible-inference-terms')
                && $request['model_name'] === 'retention'
                && $request['batch_name'] === 'batch_foo';
        });
    }

    public function test_start_prediction_forwards_selected_terms(): void
    {
        config(['services.backend.url' => 'http://backend.test']);
        $user = User::factory()->create([
            'accepted_terms' => true,
            'access_type' => 'DATAKINDER',
        ]);
        $instId = '942d4b0e12e74d2a91879508ae3cef7c';
        Http::fake([
            '*' => Http::response(['run_id' => 'run-1'], 200),
        ]);

        $response = $this->actingAs($user)->withSession([
            'api_jwt' => $this->jwt(),
            'institution' => ['inst_id' => $instId],
        ])->post('/start-prediction/retention', [
            'batch_name' => 'batch_foo',
            'term_filter' => ['fall 2024-25'],
        ]);

        $response->assertOk();
        $response->assertJsonPath('run_id', 'run-1');
        Http::assertSent(function ($request) use ($instId) {
            return $request->method() === 'POST'
                && str_contains($request->url(), '/institutions/'.$instId.'/models/retention/run-inference')
                && $request['batch_name'] === 'batch_foo'
                && $request['term_filter'] === ['fall 2024-25'];
        });
    }

    private function jwt(): string
    {
        $payload = rtrim(strtr(base64_encode(json_encode(['exp' => time() + 3600], JSON_THROW_ON_ERROR)), '+/', '-_'), '=');

        return 'eyJhbGciOiJub25lIn0.'.$payload.'.x';
    }
}
