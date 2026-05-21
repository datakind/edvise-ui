<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TokenHelper
{
    // Get the Backend API token for that user, saving it in the session or regenerating if it is close to expiration.
    // The return is an array of two elements, the token, and an error message if any.
    public static function getToken(Request $request)
    {
        $backend_tok = $request->session()->get('api_jwt');
        $tok_timestamp = $request->session()->get('api_jwt_created_at');
        $carbon_now = Carbon::now();
        $current_timestamp = $carbon_now->timestamp;

        if (! $request->session()->has('api_jwt')) {
            return TokenHelper::makeTokenAPICall($request, $current_timestamp);
        }

        $start = new Carbon($tok_timestamp);
        $time_difference_in_minutes = $carbon_now->diffInMinutes($start);

        // If the delta between the old creation timestamp and now is greater than the expiration less 5 min, recalculate the jwt.
        if ($time_difference_in_minutes > config('services.backend.timeout_less_five')) {
            return TokenHelper::makeTokenAPICall($request, $current_timestamp);
        }

        return [$backend_tok, ''];
    }

    public static function makeTokenAPICall(Request $request, int $current_timestamp)
    {
        $headers = [
            'X-API-KEY' => config('services.backend.api_key'),
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
            'ENDUSER' => $request->user()->email,
        ];
        $url = config('services.backend.url').'/token-from-api-key';
        $token_response = Http::withHeaders($headers)->post($url);

        if (! $token_response->ok()) {
            return ['', 'Invalid API Key'];
        }

        $tok = json_decode($token_response)->access_token;

        session(['api_jwt' => $tok]);
        session(['api_jwt_created_at' => $current_timestamp]);

        return [$tok, ''];
    }
}
