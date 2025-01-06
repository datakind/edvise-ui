<?php

namespace App\Http\Controllers;

use App\Models\DataDictionary;
use App\Traits\UsesApi;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
//use GuzzleHttp\Client;
//use GuzzleHttp\Exception\RequestException;

class ApiController extends Controller
{
    use UsesApi;


        public function fileUploadApi(Request $request)
    {
        // For printline debugging the following example will output to console in the 'php artisan serve' pane.
        //$out = new \Symfony\Component\Console\Output\ConsoleOutput();
        //$out->writeln("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1");

        # Currently use the dev user for debugging.
        $token_response = Http::asForm()->post(env("BACKEND_URL").'/token', [
            'username' =>  env("BACKEND_DEV_USER"), #$request->user()->email(),
            'password' => env("BACKEND_DEV_PASSWORD"), #$request->user()->password(),
            'grant_type' => 'password',
            'scope' => '',
            'client_id' => 'string',
            'client_secret' => 'string',
        ]);
        if (!$token_response->ok()) {
            return response()->json(['error' => 'Invalid username/password.'], 401);
        }
        $tok = json_decode($token_response)->access_token;
        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];
        $response = Http::withHeaders($headers)->get(env('BACKEND_URL') . '/non_inst_users');
        return $response;
    }


    public function exampleFunction(Request $request)
    {
        $query = http_build_query($request->query());
        $token = $this->authenticateDkApi(null);
        $endpoint = 'product/endpoint';
        $headers = [
            'Authorization' => $token->access,
            'Cache-Control' => 'no-cache',
        ];
        $response = Http::withHeaders($headers)->get(env('DK_API_SUITE_URL') . '/' . env('DK_API_SUITE_VERSION') . '/' . $endpoint . '?' . $query);
        return $response;
    }

    protected function readDataDictionary(): mixed
    {
        $response = DataDictionary::all();
        return $response;
    }

}
