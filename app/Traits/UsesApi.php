<?php

namespace App\Traits;

use App\Models\DkApiToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

trait UsesApi
{
    /**
     * Authenticates application to DK API Suite
     */
    protected function authenticateDkApi(?string $token_id = null): DkApiToken
    {
        $response = Http::withHeaders([
            'Cache-Control' => 'no-cache',
            'subscription-key' => config()->string('services.dk_api_suite.subscription_key'),
        ])->get(config()->string('services.dk_api_suite.url').'authenticate/get_jwt?api='.config()->string('services.dk_api_suite.product'));
        $token = ! empty($token_id) ? (DkApiToken::find($token_id) ?? throw new \RuntimeException("DkApiToken {$token_id} not found")) : new DkApiToken;
        $access = $response->json('access_token');
        $token->access = is_string($access) ? $access : throw new \RuntimeException('DK API Suite returned no access token');
        $token->type = 'access';
        $token->save();

        return $token;
    }

    /**
     * Formats DK API Suite request URL string and sends Request to API and decodes JSON response
     */
    protected function makesDkApiRequest(string $token, string $endpoint, string $type = 'get'): mixed
    {

        if ($type == 'post') {
            $response = Http::withToken($token)->post(config()->string('services.dk_api_suite.url').'/'.config()->string('services.dk_api_suite.version').$endpoint);
        } else {
            $response = Http::withToken($token)->get(config()->string('services.dk_api_suite.url').'/'.config()->string('services.dk_api_suite.version').$endpoint);
        }

        return json_decode($response->body());
    }
}
