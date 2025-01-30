<?php

namespace App\Http\Controllers;

use App\Models\DataDictionary;
use App\Traits\UsesApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use TokenHelper;
use InstitutionHelper;

//use GuzzleHttp\Client;
//use GuzzleHttp\Exception\RequestException;

class ApiController extends Controller
{
    use UsesApi;

    // For printline debugging the following example added in the function will output to console in the 'php artisan serve' pane.
    // $out = new \Symfony\Component\Console\Output\ConsoleOutput();
    // $out->writeln("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1");

    // Downloading inference output
    public function downloadInfData(Request $request, string $filename)
    {
        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $tokErr], 401);
        }
        if ($inst == "") {
            return response()->json(['error' => $instErr], 401);
        }
        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];
        return Http::withHeaders($headers)->get(env('BACKEND_URL').'/institutions/'.$inst.'/download_url/'.$filename);
    }

    public function viewInputData(Request $request)
    {
        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $tokErr], 401);
        }
        if ($inst == "") {
            return response()->json(['error' => $instErr], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        return Http::withHeaders($headers)->get(env('BACKEND_URL').'/institutions/'.$inst.'/input_debugging');
    }

    public function fileUploadApi(Request $request, string $filename)
    {

        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $tokErr], 401);
        }
        if ($inst == "") {
            return response()->json(['error' => $instErr], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        return Http::withHeaders($headers)->get(env('BACKEND_URL').'/institutions/'.$inst.'/upload_url/'.$filename);
    }

    public function fileValidateApi(Request $request, string $filename)
    {

        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $tokErr], 401);
        }
        if ($inst == "") {
            return response()->json(['error' => $instErr], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        return Http::withHeaders($headers)->post(env('BACKEND_URL').'/institutions/'.$inst.'/input/validate/'.$filename);
    }

    public function createInstApi(Request $request)
    {
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $tokErr], 401);
        }

        if ($request->user()->access_type != "DATAKINDER") {
            return response()->json(['error' => 'Only datakinders can create institutions'], 401);
        }

        if ($request->input('name') == null || $request->input('name') == "") {
            return response()->json(['error' => 'Name required.'], 400);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];
        $post_request_body = [
            'name' => $request->input('name'),
        ];

        // Optional fields.
        if ($request->input('description') != null && $request->input('description') != "") 
            {$post_request_body['description'] = $request->input('description');}
        if ($request->input('state') != null && $request->input('state') != "") 
            {$post_request_body['state'] = $request->input('state');}
        if ($request->input('allowed_schemas') != null) 
            {$post_request_body['allowed_schemas'] = $request->input('allowed_schemas');}
        if ($request->input('allowed_emails') != null) 
            {$post_request_body['allowed_emails'] = $request->input('allowed_emails');}
        if ($request->input('is_pdp') != null) 
            {$post_request_body['is_pdp'] = $request->input('is_pdp');}
        if ($request->input('retention_days') != null && $request->input('retention_days') != "") 
            {$post_request_body['retention_days'] = $request->input('retention_days');}
        
        return Http::withHeaders($headers)->post(env('BACKEND_URL').'/institutions', $post_request_body);
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
        return Http::withHeaders($headers)->get(env('DK_API_SUITE_URL').'/'.env('DK_API_SUITE_VERSION').'/'.$endpoint.'?'.$query);
    }

    protected function readDataDictionary(): mixed
    {
        $response = DataDictionary::all();

        return $response;
    }
}
