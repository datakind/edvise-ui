<?php

namespace App\Http\Controllers;

use App\Models\DataDictionary;
use App\Traits\UsesApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use TokenHelper;
use InstitutionHelper;
use UserHelper;

//use GuzzleHttp\Client;
//use GuzzleHttp\Exception\RequestException;

class ApiController extends Controller
{
    use UsesApi;

    // For printline debugging the following example added in the function will output to console in the 'php artisan serve' pane.
    // $out = new \Symfony\Component\Console\Output\ConsoleOutput();
    // $out->writeln("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1");

    // Constructs a query for Datakinder cases that does not retrieve institution info.
    public function constructDatakinderRequest(Request $request, string $url_piece, string $method, $post_body)
    {
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return response()->json(['error' => $tokErr], 401);
        }

        if ($request->user()->access_type != "DATAKINDER") {
            return response()->json(['error' => 'Only datakinders can perform this action'], 401);
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];
        $url = env('BACKEND_URL').$url_piece;
        $resp = null;
        if ($method == "GET") {
            $resp = Http::withHeaders($headers)->get($url);
        } else if ($method == "POST") {
            if ($post_body == null) {
                $resp = Http::withHeaders($headers)->post($url);
            } else {
                $resp = Http::withHeaders($headers)->post($url, $post_body);
            }
        } else {
            return response()->json(['error' => 'Unrecognized HTTP method'], 500);
        }

        if ($resp->getStatusCode() != 200 ) {
            $errMsg = json_decode($resp->getBody());
            if ($errMsg == null) {
                return response()->json(['error' => 'Error code: '.$resp->getStatusCode()], $resp->getStatusCode());
            }
            return response()->json(['error' => $errMsg->detail], $resp->getStatusCode());
        }
        return $resp;
    }

    public function addDatakinderApi(Request $request)
    {
        $emails_list = $request->input('emails');
        if ( $emails_list == null || sizeof($emails_list) == 0) {
            return response()->json(['error' => 'At least one email required.'], 400);
        }

        foreach ($emails_list as $email) {
            $res = UserHelper::checkEmailExists($email);
            if ($res != "") {
                return response()->json(['error' => $email." error: ".$res], 400);
            }
        }

        return ApiController::constructDatakinderRequest($request, '/datakinders', "POST", $emails_list);
    }

    public function createInstApi(Request $request)
    {
        if ($request->input('name') == null || $request->input('name') == "") {
            return response()->json(['error' => 'Name required.'], 400);
        }
        if (!preg_match('/^[A-Za-z0-9&_ -]*$/', $request->input('name'))) {
            return response()->json(['error' => 'Name must only include alphanumeric characters, -, _, & and spaces.'], 400);
        }
        $post_request_body = [
            'name' => $request->input('name'),
        ];

        // Optional fields.
        if ($request->input('state') != null && $request->input('state') != "") 
            {$post_request_body['state'] = $request->input('state');}
        if ($request->input('allowed_schemas') != null) 
            {$post_request_body['allowed_schemas'] = $request->input('allowed_schemas');}
        if ($request->input('allowed_emails') != null) 
            {$post_request_body['allowed_emails'] = $request->input('allowed_emails');}
        if ($request->input('is_pdp') != null) {   
            if ($request->input('is_pdp') && $request->input('pdp_id') == null) {
                return response()->json(['error' => 'Please set the PDP ID field for schools that support PDP schemas.'], 400);
            }
            $post_request_body['is_pdp'] = $request->input('is_pdp');
        }
        if ($request->input('pdp_id') != null) 
            {$post_request_body['pdp_id'] = $request->input('pdp_id');}
        if ($request->input('retention_days') != null && $request->input('retention_days') != "") 
            {$post_request_body['retention_days'] = $request->input('retention_days');}
        
        return ApiController::constructDatakinderRequest($request, '/institutions', "POST", $post_request_body);
    }

    public function viewAllInstitutions(Request $request)
    {
        return ApiController::constructDatakinderRequest($request, '/institutions', "GET", /* No POST body*/ null);
    }

    // Constructs a query without the BACKEND_URL+/institutions/<inst> prefix.
     public function constructInstRequest(Request $request, string $url_piece, string $method, $post_body)
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

        $url = env('BACKEND_URL').'/institutions/'.$inst.$url_piece;
        $resp = null;
        if ($method == "GET") {
            $resp = Http::withHeaders($headers)->get($url);
        } else if ($method == "POST") {
            if ($post_body == null) {
                $resp = Http::withHeaders($headers)->post($url);
            } else {
                $resp = Http::withHeaders($headers)->post($url, $post_body);
            }
        } else {
            return response()->json(['error' => 'Unrecognized HTTP method'], 500);
        }

        if ($resp->getStatusCode() != 200 ) {
            $errMsg = json_decode($resp->getBody());
            if ($errMsg == null) {
                return response()->json(['error' => 'Error code: '.$resp->getStatusCode()], $resp->getStatusCode());
            }
            return response()->json(['error' => $errMsg->detail], $resp->getStatusCode());
        }
        return $resp;
    }

    public function createModelApi(Request $request)
    {
        if ($request->user()->access_type != "DATAKINDER") {
            return response()->json(['error' => 'Only datakinders can perform this action'], 401);
        }
        if ($request->input('name') == null || $request->input('name') == "") {
            return response()->json(['error' => 'Name required.'], 400);
        }
        if (!preg_match('/^[A-Za-z0-9_ -]*$/', $request->input('name'))) {
            return response()->json(['error' => 'Name must only include alphanumeric characters, -, _, and spaces.'], 400);
        }
        $post_request_body = [
            'name' => $request->input('name'),
        ];

        // Optional fields.
        if ($request->input('vers_id') != null && $request->input('vers_id') != "") 
            {$post_request_body['vers_id'] = $request->input('vers_id');}
        if ($request->input('valid') != null) {   
            $post_request_body['valid'] = $request->input('valid');
        }

        if ($request->input('schema_configs') != null) 
            {$post_request_body['schema_configs'] = $request->input('schema_configs');}
        return ApiController::constructInstRequest($request, '/models/', "POST", $post_request_body);
    }

    public function createBatch(Request $request)
    {

        $post_request_body = [
            'name' => $request->input('name'),
        ];
        if ($request->input('batch_disabled') != null) 
            {$post_request_body['batch_disabled'] = $request->input('batch_disabled');}
        if ($request->input('file_names') != null) 
            {$post_request_body['file_names'] = $request->input('file_names');}


        return ApiController::constructInstRequest($request, '/batch', "POST", $post_request_body);
    }


    // Retrieves the GCS upload URL.
    public function fileUploadApi(Request $request, string $filename)
    {
        return ApiController::constructInstRequest($request, '/upload-url/'.$filename, "GET", null);
    }

    // Validates a file that has been uploaded to the GCS bucket already.
    public function fileValidateApi(Request $request, string $filename)
    {
        return ApiController::constructInstRequest($request, '/input/validate-upload/'.$filename, "POST", null);
    }

    // This shows all output data.
    public function viewOutputData(Request $request)
    {
        return ApiController::constructInstRequest($request, '/output', "GET", null);
    }

    // Downloading inference output
    public function downloadInfData(Request $request, string $filename)
    {
        return ApiController::constructInstRequest($request, '/download-url/'.$filename, "GET", null);
    }

    // Triggers inference run. 
    public function runInferenceApi(Request $request, string $model_name)
    {
         $post_request_body = [
            'batch_name' => $request->input('batch_name'),
        ];
        if ($request->input('is_pdp') != null) 
            {$post_request_body['is_pdp'] = $request->input('is_pdp');}

        return ApiController::constructInstRequest($request, '/models/'.$model_name.'/run-inference', "POST", $post_request_body);
    }

    // Gets list of models for a given institution
    public function getModels(Request $request)
    {
        return ApiController::constructInstRequest($request, '/models', "GET", null);
    }

    public function fileBytes(Request $request, string $file_name)
    {
        // TODO: finish implementing
        //return file_get_contents(__DIR__ . "/fixtures/model-output.json");
        // This returns a bytes value
        return ApiController::constructInstRequest($request, '/output-file-contents/'.$file_name, "GET", null);
    }

    public function modelRuns(Request $request, string $model_name) {

        return ApiController::constructInstRequest($request, '/models/'.$model_name.'/runs', "GET", null);
    }
    // This returns batch and file info for a given inst.
    public function viewUploadedData(Request $request)
    {
        return ApiController::constructInstRequest($request, '/input', "GET", null);
    }

    // TODO: delete. this is only for debugging
    public function viewInputData(Request $request)
    {
        return ApiController::constructInstRequest($request, '/input-debugging', "GET", null);
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
