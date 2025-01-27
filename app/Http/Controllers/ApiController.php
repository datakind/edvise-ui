<?php

namespace App\Http\Controllers;

use App\Models\DataDictionary;
use App\Traits\UsesApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use TokenHelper;

//use GuzzleHttp\Client;
//use GuzzleHttp\Exception\RequestException;

class ApiController extends Controller
{
    use UsesApi;

    // For printline debugging the following example added in the function will output to console in the 'php artisan serve' pane.
    // $out = new \Symfony\Component\Console\Output\ConsoleOutput();
    // $out->writeln("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1");

    // Downloading inference output
    public function downloadInfData(Request $request, string $inst, string $filename)
    {
        [$tok, $err] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $err], 401);
        }
        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];
        $response = Http::withHeaders($headers)->get(env('BACKEND_URL').'/institutions/'.$inst.'/download_url/'.$filename);

        return $response;
    }

    public function viewInputData(Request $request, string $inst)
    {
        // Currently use the dev user for debugging.
        [$tok, $err] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $err], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        $response = Http::withHeaders($headers)->get(env('BACKEND_URL').'/institutions/'.$inst.'/input_debugging');

        return $response;
    }

    public function fileUploadApi(Request $request, string $inst, string $filename)
    {

        // Currently use the dev user for debugging.
        [$tok, $err] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $err], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        $response = Http::withHeaders($headers)->get(env('BACKEND_URL').'/institutions/'.$inst.'/upload_url/'.$filename);

        return $response;
    }

    public function fileValidateApi(Request $request, string $inst, string $filename)
    {

        // Currently use the dev user for debugging.
        [$tok, $err] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $err], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        $response = Http::withHeaders($headers)->post(env('BACKEND_URL').'/institutions/'.$inst.'/input/validate/'.$filename);

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
        $response = Http::withHeaders($headers)->get(env('DK_API_SUITE_URL').'/'.env('DK_API_SUITE_VERSION').'/'.$endpoint.'?'.$query);

        return $response;
    }

    protected function readDataDictionary(): mixed
    {
        $response = DataDictionary::all();

        return $response;
    }
}
