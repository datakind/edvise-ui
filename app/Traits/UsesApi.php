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
    protected function authenticateDkApi(?string $token_id = null): mixed
    {
        $response = Http::withHeaders([
            'Cache-Control' => 'no-cache',
            'subscription-key' => config('services.dk_api_suite.subscription_key'),
        ])->get(config('services.dk_api_suite.url').'authenticate/get_jwt?api='.config('services.dk_api_suite.product'));
        $body = json_decode($response->body());
        $token = ! empty($token_id) ? DkApiToken::where('id', $token_id)->first() : new DkApiToken;
        $token->access = $body->access_token;
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
            $response = Http::withToken($token)->post(config('services.dk_api_suite.url').'/'.config('services.dk_api_suite.version').$endpoint);
        } else {
            $response = Http::withToken($token)->get(config('services.dk_api_suite.url').'/'.config('services.dk_api_suite.version').$endpoint);
        }

        return json_decode($response->body());
    }
}
