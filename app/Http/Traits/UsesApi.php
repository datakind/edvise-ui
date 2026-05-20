<?php

namespace App\Http\Traits;

use App\Models\DkApiToken;
use Illuminate\Support\Facades\Http;

trait UsesApi
{
    protected function authenticateDkApi(?string $token_id = null)
    {
        $response = Http::withHeaders([
            'Cache-Control' => 'no-cache',
            'subscription-key' => config('services.dk_api_suite.subscription_key'),
        ])->get(config('services.dk_api_suite.url').'authenticate/get_jwt?api='.config('services.dk_api_suite.product'));

        $body = json_decode($response->body());
        $token = ! empty($token_id) ? DkApiToken::where('id', $token_id)->first() : new DkApiToken();
        $token->access = $body->access_token;
        $token->type = 'access';
        $token->save();

        return $token;
    }

    protected function makesDkApiRequest(string $token, string $endpoint, string $type = 'get')
    {
        if ($type == 'post') {
            $response = Http::withToken($token)->post(config('services.dk_api_suite.url').'/'.config('services.dk_api_suite.version').$endpoint);
        } else {
            $response = Http::withToken($token)->get(config('services.dk_api_suite.url').'/'.config('services.dk_api_suite.version').$endpoint);
        }

        return json_decode($response->body());
    }

    public static function getInsights()
    {
        // Authenticate to get a fresh token
        $response = Http::withHeaders([
            'Cache-Control' => 'no-cache',
            'subscription-key' => config('services.dk_api_suite.subscription_key'),
        ])->get(config('services.dk_api_suite.url').'authenticate/get_jwt?api='.config('services.dk_api_suite.product'));

        $token = json_decode($response->body());
        // Fetch insights using the fresh token
        $raw = Http::withToken($token->access_token)
            ->get(config('services.dk_api_suite.url').'/sst/students_insight?support_level=all&institution_id=jjc_transfer&summary_insights=false');

        dd($raw);
    }
}
