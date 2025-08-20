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

    // For local requests, mock out backend calls.
    public function isLocalRequest()
    {
        if (strtoupper(env('APP_ENV')) == 'LOCAL') {
            return True;
        }
        return False;
    }

    // Constructs a query for Datakinder cases that does not retrieve institution info.
    public function constructDatakinderRequest(Request $request, string $url_piece, string $method, $req_body)
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
        } elseif ($method == "POST") {
            if ($req_body == null) {
                $resp = Http::withHeaders($headers)->post($url);
            } else {
                $resp = Http::withHeaders($headers)->post($url, $req_body);
            }
        } elseif ($method == "PATCH") {
            if ($req_body == null) {
                $resp = Http::withHeaders($headers)->patch($url);
            } else {
                $resp = Http::withHeaders($headers)->patch($url, $req_body);
            }
        } else {
            return response()->json(['error' => 'Unrecognized HTTP method'], 500);
        }

        if ($resp->getStatusCode() != 200) {
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
        if ($emails_list == null || sizeof($emails_list) == 0) {
            return response()->json(['error' => 'At least one email required.'], 400);
        }

        foreach ($emails_list as $email) {
            $res = UserHelper::checkEmailExists($email);
            if ($res != "") {
                return response()->json(['error' => $email." error: ".$res], 400);
            }
        }

        if (ApiController::isLocalRequest()) {
            return response()->json($emails_list, 200);
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
        if ($request->input('state') != null && $request->input('state') != "") {
            $post_request_body['state'] = $request->input('state');
        }
        if ($request->input('allowed_schemas') != null) {
            $post_request_body['allowed_schemas'] = $request->input('allowed_schemas');
        }
        if ($request->input('allowed_emails') != null) {
            $post_request_body['allowed_emails'] = $request->input('allowed_emails');
        }
        if ($request->input('is_pdp') != null) {
            if ($request->input('is_pdp') && $request->input('pdp_id') == null) {
                return response()->json(['error' => 'Please set the PDP ID field for schools that support PDP schemas.'], 400);
            }
            $post_request_body['is_pdp'] = $request->input('is_pdp');
        }
        if ($request->input('pdp_id') != null) {
            $post_request_body['pdp_id'] = $request->input('pdp_id');
        }
        if ($request->input('retention_days') != null && $request->input('retention_days') != "") {
            $post_request_body['retention_days'] = $request->input('retention_days');
        }

        if (ApiController::isLocalRequest()) {
            return response()->json( ['inst_id' => '64dbce41111b46fe8e84c38757477ef2', 'name' => $request->input('name'), 'state' => $request->input('state'), 'pdp_id' => $request->input('pdp_id')], 200);
        }
        return ApiController::constructDatakinderRequest($request, '/institutions', "POST", $post_request_body);
    }

    public function viewAllInstitutions(Request $request)
    {
        if (ApiController::isLocalRequest()) {
            return response()->json( [['inst_id' => '1d7c75c33eda42949c6675ea8af97b55', 'name' => 'University of South Foo', 'state' => 'NY', 'pdp_id' => '12345'],['inst_id' => '5301a352c03d4a39beec16c5668c4700', 'name' => 'Bar Community College', 'state' => 'CA']], 200);
        }
        return ApiController::constructDatakinderRequest($request, '/institutions', "GET", /* No POST body*/ null);
    }

    // Constructs a query with the BACKEND_URL+/institutions/<inst> prefix.
    public function constructInstRequest(Request $request, string $url_piece, string $method, $req_body)
    {
        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        [$tok, $tokErr] = TokenHelper::GetToken($request);

        \Log::info('constructInstRequest - Institution ID: ' . $inst . ', Error: ' . $instErr);
        \Log::info('constructInstRequest - Token Error: ' . $tokErr);
        \Log::info('constructInstRequest - URL piece: ' . $url_piece);
        \Log::info('constructInstRequest - Method: ' . $method);

        if ($tok == "") {
            \Log::error('constructInstRequest - Token is empty');
            return response()->json(['error' => $tokErr], 401);
        }
        if ($inst == null || $inst == "") {
            \Log::error('constructInstRequest - Institution is empty');
            return response()->json(['error' => $instErr], 401);
        }
        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        $url = env('BACKEND_URL').'/institutions/'.$inst.$url_piece;
        \Log::info('constructInstRequest - Full URL being called: ' . $url);
        $resp = null;
        if ($method == "GET") {
            $resp = Http::withHeaders($headers)->get($url);
        } elseif ($method == "POST") {
            if ($req_body == null) {
                $resp = Http::withHeaders($headers)->post($url);
            } else {
                $resp = Http::withHeaders($headers)->post($url, $req_body);
            }
        } elseif ($method == "PATCH") {
            if ($req_body == null) {
                $resp = Http::withHeaders($headers)->patch($url);
            } else {
                $resp = Http::withHeaders($headers)->patch($url, $req_body);
            }
        } else {
            return response()->json(['error' => 'Unrecognized HTTP method'], 500);
        }

        if ($resp->getStatusCode() != 200) {
            $errMsg = json_decode($resp->getBody());
            if ($errMsg == null) {
                return response()->json(['error' => 'Error code: '.$resp->getStatusCode()], $resp->getStatusCode());
            }
            return response()->json(['error' => $errMsg->detail], $resp->getStatusCode());
        }
        return $resp;
    }

public function EditInstApi(Request $request)
    {
        // Optional fields.
        $req_body = [];
        if ($request->input('name') != null && $request->input('name') != "") {
            $req_body['name'] = $request->input('name');
        }
        if ($request->input('state') != null && $request->input('state') != "") {
            $req_body['state'] = $request->input('state');
        }
        if ($request->input('allowed_schemas') != null) {
            $req_body['allowed_schemas'] = $request->input('allowed_schemas');
        }
        if ($request->input('allowed_emails') != null) {
            $req_body['allowed_emails'] = $request->input('allowed_emails');
        }
        if ($request->input('is_pdp') != null) {
            if ($request->input('is_pdp') && $request->input('pdp_id') == null) {
                return response()->json(['error' => 'Please set the PDP ID field for schools that support PDP schemas.'], 400);
            }
            $req_body['is_pdp'] = $request->input('is_pdp');
        }
        if ($request->input('pdp_id') != null) {
            $req_body['pdp_id'] = $request->input('pdp_id');
        }
        if ($request->input('retention_days') != null && $request->input('retention_days') != "") {
            $req_body['retention_days'] = $request->input('retention_days');
        }

        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }

            return response()->json( ['inst_id' => $inst, 'name' => $request->input('name'), 'state' => $request->input('state'), 'pdp_id' => $request->input('pdp_id')], 200);
        }
        return ApiController::constructInstRequest($request, '', "PATCH", $req_body);
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
        if ($request->input('vers_id') != null && $request->input('vers_id') != "") {
            $post_request_body['vers_id'] = $request->input('vers_id');
        }
        if ($request->input('valid') != null) {
            $post_request_body['valid'] = $request->input('valid');
        }

        if ($request->input('schema_configs') != null) {
            $post_request_body['schema_configs'] = $request->input('schema_configs');
        }

        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json( ['inst_id' => $inst, 'name' => $request->input('name'), 'm_id' => 'e4862c62829440d8ab4c9c298f02f619', 'created_by' => $request->user()->id, 'valid' => True, 'deleted' => False], 200);
        }
        return ApiController::constructInstRequest($request, '/models/', "POST", $post_request_body);
    }

    public function createBatch(Request $request)
    {

        $post_request_body = [
            'name' => $request->input('name'),
        ];
        if ($request->input('batch_disabled') != null) {
            $post_request_body['batch_disabled'] = $request->input('batch_disabled');
        }
        if ($request->input('file_names') != null) {
            $post_request_body['file_names'] = $request->input('file_names');
        }


        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json( [
                "batch_id"=> "1bc27bbe2a124dda983d156fafcca649",
                "inst_id"=> $inst,
                "file_names_to_ids"=> [],
                "name"=> $request->input('name'),
                "created_by"=> $request->user()->id,
                "deleted"=> false,
                "completed"=> false,
                "deletion_request_time"=> null,
                "created_at"=> "2025-02-27T18:57:05",
                "updated_at"=> "2025-02-27T18:57:05",
                "updated_by"=> $request->user()->id,
            ], 200);
        }
        return ApiController::constructInstRequest($request, '/batch', "POST", $post_request_body);
    }


    // Retrieves the GCS upload URL.
    public function fileUploadApi(Request $request, string $filename)
    {
        if (ApiController::isLocalRequest()) {
            return response()->json("local-url-fake-signed", 200);
        }
        return ApiController::constructInstRequest($request, '/upload-url/'.urlencode($filename), "GET", null);
    }

    // Validates a file that has been uploaded to the GCS bucket already.
    public function fileValidateApi(Request $request, string $filename)
    {
        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json(['name'=> 'foo_file.csv', 'inst_id' => $inst, 'file_types' => ['UNKNOWN'], 'source'=> 'MANUAL_UPLOAD'], 200);
        }
        return ApiController::constructInstRequest($request, '/input/validate-upload/'.urlencode($filename), "POST", null);
    }

    // This shows all output data.
    public function viewOutputData(Request $request)
    {
        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            // TODO: populate. This isn't yet used by the webapp.
            return response()->json(null, 200);
        }
        return ApiController::constructInstRequest($request, '/output', "GET", null);
    }

    // Downloading inference output
    public function downloadInfData(Request $request, string $filename)
    {
        if (ApiController::isLocalRequest()) {
            return response()->json("local-url-fake-signed", 200);
        }
        return ApiController::constructInstRequest($request, '/download-url/'.urlencode($filename), "GET", null);
    }

    // Triggers inference run.
    public function runInferenceApi(Request $request, string $model_name)
    {
        $post_request_body = [
           'batch_name' => $request->input('batch_name'),
        ];
        if ($request->input('is_pdp') != null) {
            $post_request_body['is_pdp'] = $request->input('is_pdp');
        }

        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json(['run_id' => '123', 'inst_id' => $inst, 'm_name' => $model_name, 'created_by' => $request->user()->id, 'triggered_at'=>'2025-02-02T19:19:19'], 200);
        }
        return ApiController::constructInstRequest($request, '/models/'.urlencode($model_name).'/run-inference', "POST", $post_request_body);
    }

    // Gets list of models for a given institution
    public function getModels(Request $request)
    {

        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json([
                ['m_id' => 'e4862c62829440d8ab4c9c298f02f620', 'name' => 'oldest_enrollment_model', 'created_by' => $request->user()->id, 'valid' => True, 'deleted' => False],
                ['m_id' => 'e4862c62829440d8ab4c9c298f02f619', 'name' => 'latest_enrollment_model', 'created_by' => $request->user()->id, 'valid' => True, 'deleted' => False],
                ['m_id' => 'e4862c62829440d8ab4c9c298f02f621', 'name' => 'invlaid_enrollment_model', 'created_by' => $request->user()->id, 'valid' => False, 'deleted' => False],

            ], 200);
        }
        return ApiController::constructInstRequest($request, '/models', "GET", null);
    }

    // Returns file as bytes
    public function fileBytes(Request $request, string $file_name)
    {
        if (ApiController::isLocalRequest()) {
            return response()->json(null, 200);
        }
        return ApiController::constructInstRequest($request, '/output-file-contents/'.urlencode($file_name), "GET", null);
    }

    // Returns file as json
    public function fileJson(Request $request, string $file_name)
    {
        if (ApiController::isLocalRequest()) {
            return response()->json(null, 200);
        }
        $file = $this->fileBytes($request, $file_name);
        if ($file == null) {
            return response()->json(['error' => $file_name.' requested returned null.'], 404);
        }
        // TODO: add error handling if the fileBytes response errors out, we want to bubble that out.
        $data = $file->body();
        $rows = array_map('str_getcsv', explode("\n", $data));
        $header = array_shift($rows);
        $jsonArray = array();
        foreach ($rows as $row) {
            if (count($row) == count($header)) {
                $jsonArray[] = array_combine($header, $row);
            }
        }
        return response()->json($jsonArray);
    }

    // Returns file as png type
    public function filePng(Request $request, string $file_name)
    {
        if (ApiController::isLocalRequest()) {
            return response()->json(null, 200);
        }
        $file = $this->fileBytes($request, $file_name);
        if ($file == null || $file->body() == null) {
            return response()->json(['error' => $file_name.' requested returned null.'], 404);
        }
        return response($file->body())->header('Content-Type', 'image/png');
    }

    public function convertDateToReadable(string $date_str)
    {
        // Convert date to readable string.
        // The strings start off with type "2025-02-25T19:48:43"
        $first_parse = explode("T", $date_str);
        $date_val = explode("-", $first_parse[0]);
        return $date_val[1]."/".$date_val[2]."/".$date_val[0]." ".$first_parse[1];
    }

    public function modelRuns(Request $request, string $model_name)
    {
        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json([['run_id' => '123', 'inst_id' => $inst, 'm_name' => 'latest_enrollment_model', 'created_by' => $request->user()->name, 'triggered_at' => '02/02/2025 19:48:12', 'batch_name' => 'foo_batch', 'completed'=>True, 'output_file_link'=>'https://www.google.com']], 200);
        }
        $result = ApiController::constructInstRequest($request, '/models/'.urlencode($model_name).'/runs', "GET", null);
        // For simplicity, we can make the conversions here as the frontend doesn't want to or need to know the details.
        // E.g. convert user uuid to name and convert the timestamp to human readable string.
        if ($result != null && $result->getStatusCode() == 200) {
            $output = $result->json();
            if ($output != null) {
                $collected_user_ids = [];
                foreach ($output as $run) {
                    array_push($collected_user_ids, $run["created_by"]);
                }
                $user_id_map = UserHelper::getNames($collected_user_ids);
                foreach ($output as $key => $run) {
                    $user_name = $run["created_by"];
                    if ($user_id_map && $user_id_map[$user_name] != null) {
                        $user_name = $user_id_map[$user_name];
                    }
                    $time = ApiController::convertDateToReadable($run["triggered_at"]);
                    $run["created_by"] = $user_name;
                    $run["triggered_at"] = $time;
                    // Note that completed indicates the run was completed, output_valid indicates whether a Datakinder has formally approved the file.
                    if ($run["completed"] && $run["output_filename"] != null && $run["output_filename"] != "") {
                        $download_url = ApiController::downloadInfData($request, $run["output_filename"]);
                        if ($download_url->getStatusCode() == 200) {
                            $run["output_file_link"] = $download_url->json();
                        } else {
                            $run["output_file_link"] =  '';
                        }
                    }
                    $output[$key] = $run;
                }
            }
            // Set the result to the modified output.
            return response()->json($output);
        }
        return $result;
    }

    // This returns batch and file info for a given inst.
    public function viewUploadedData(Request $request)
    {
        if (ApiController::isLocalRequest()) {
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            if ($inst == null || $inst == "") {
                return response()->json(['error' => $instErr], 401);
            }
            return response()->json([
        "batches"=> [
        [
            "batch_id"=> "1bc27bbe2a124dda983d156fafcca648",
            "inst_id"=> "11fdb6e1d1814508a779a36f0b7e67f3",
            "file_names_to_ids"=> [
                "1740682576373_synthetic_student_semester_ar_deidentified.csv"=> "cde1d91f6f204c4797e07fa235430390",
                "1740682576372_synthetic_course_level_ar_deid.csv"=> "90dad338de0b43239eb5fec8c6872e0b"
            ],
            "name"=> "Spring 2025",
            "created_by"=> "d0e443a4292449a184bf135f1ff0d33a",
            "deleted"=> false,
            "completed"=> false,
            "deletion_request_time"=> null,
            "created_at"=> "2025-02-27T18:57:05",
            "updated_at"=> "02/27/2025 18:57:05",
            "updated_by"=> "Frontend Tester"
        ]
        ],
        "files"=> [
            [
                "name"=> "1740682576372_synthetic_course_level_ar_deid.csv",
                "data_id"=> "90dad338de0b43239eb5fec8c6872e0b",
                "batch_ids"=> [
                    "1bc27bbe2a124dda983d156fafcca648"
                ],
                "inst_id"=> "11fdb6e1d1814508a779a36f0b7e67f3",
                "uploader"=> "d0e443a4292449a184bf135f1ff0d33a",
                "source"=> "MANUAL_UPLOAD",
                "deleted"=> false,
                "deletion_request_time"=> null,
                "retention_days"=> null,
                "sst_generated"=> false,
                "valid"=> true,
                "uploaded_date"=> "2025-02-27T18:56:18"
            ],
            [
                "name"=> "1740682576373_synthetic_student_semester_ar_deidentified.csv",
                "data_id"=> "cde1d91f6f204c4797e07fa235430390",
                "batch_ids"=> [
                    "1bc27bbe2a124dda983d156fafcca648"
                ],
                "inst_id"=> "11fdb6e1d1814508a779a36f0b7e67f3",
                "uploader"=> "d0e443a4292449a184bf135f1ff0d33a",
                "source"=> "MANUAL_UPLOAD",
                "deleted"=> false,
                "deletion_request_time"=> null,
                "retention_days"=> null,
                "sst_generated"=> false,
                "valid"=> true,
                "uploaded_date"=> "2025-02-27T18:56:18"
            ]
        ]
        ], 200);
        }
        // convert the user ids to names here prior to submission
        $result = ApiController::constructInstRequest($request, '/input', "GET", null);
        if ($result != null && $result->getStatusCode() == 200) {
            $output = $result->json();
            if ($output != null) {
                $batches = $output["batches"];
                $collected_user_ids = [];
                foreach ($batches as $batch) {
                    if ($batch["updated_by"] == null) {
                        array_push($collected_user_ids, $batch["created_by"]);
                    } else {
                        array_push($collected_user_ids, $batch["updated_by"]);
                    }
                }
                $user_id_map = UserHelper::getNames($collected_user_ids);
                foreach ($batches as $key => $batch) {
                    $user_name = ($batch["updated_by"] == null) ? $batch["created_by"] : $batch["updated_by"];
                    if ($user_id_map && $user_id_map[$user_name] != null) {
                        $user_name = $user_id_map[$user_name];
                    }
                    $time_in = ($batch["updated_at"] == null) ? $batch["created_at"] : $batch["updated_at"];
                    $time = ApiController::convertDateToReadable($time_in);
                    $batch["updated_by"] = $user_name;
                    $batch["updated_at"] = $time;
                    $batches[$key] = $batch;
                }
                $output["batches"] = $batches;
            }
            // Set the result to the modified output.
            return response()->json($output);
        }
        return $result;
    }


    // The below provided by DK.
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

        // Gets support overview data for a given run
        public function getSupportOverview(Request $request, string $run_id)
        {
            \Log::info('getSupportOverview called with run_id: ' . $run_id);

            if (ApiController::isLocalRequest()) {
                [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
                \Log::info('Local request - Institution ID: ' . $inst . ', Error: ' . $instErr);
                if ($inst == null || $inst == "") {
                    return response()->json(['error' => $instErr], 401);
                }
                return response()->json([
                    [
                        'bin_lower' => '0.8',
                        'bin_upper' => '0.9',
                        'support_score' => '0.85',
                        'count_of_students' => '47',
                        'pct' => '6.71'
                    ],
                    [
                        'bin_lower' => '0.9',
                        'bin_upper' => '1.0',
                        'support_score' => '0.95',
                        'count_of_students' => '19',
                        'pct' => '2.71'
                    ],
                    [
                        'bin_lower' => '0.2',
                        'bin_upper' => '0.3',
                        'support_score' => '0.25',
                        'count_of_students' => '91',
                        'pct' => '13.0'
                    ],
                    [
                        'bin_lower' => '0.5',
                        'bin_upper' => '0.6',
                        'support_score' => '0.55',
                        'count_of_students' => '102',
                        'pct' => '14.57'
                    ],
                    [
                        'bin_lower' => '0.7',
                        'bin_upper' => '0.8',
                        'support_score' => '0.75',
                        'count_of_students' => '68',
                        'pct' => '9.71'
                    ],
                    [
                        'bin_lower' => '0.1',
                        'bin_upper' => '0.2',
                        'support_score' => '0.15',
                        'count_of_students' => '40',
                        'pct' => '5.71'
                    ],
                    [
                        'bin_lower' => '0.3',
                        'bin_upper' => '0.4',
                        'support_score' => '0.35',
                        'count_of_students' => '130',
                        'pct' => '18.57'
                    ],
                    [
                        'bin_lower' => '0.4',
                        'bin_upper' => '0.5',
                        'support_score' => '0.45',
                        'count_of_students' => '128',
                        'pct' => '18.29'
                    ],
                    [
                        'bin_lower' => '0.6',
                        'bin_upper' => '0.7',
                        'support_score' => '0.65',
                        'count_of_students' => '75',
                        'pct' => '10.71'
                    ]
                ], 200);
            }
            [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
            \Log::info('Production request - Institution ID: ' . $inst . ', Error: ' . $instErr);

            $externalUrl = '/inference/support-overview/'.$run_id;
            \Log::info('Production request - External API URL: ' . $externalUrl);
            \Log::info('Production request - Full external URL: ' . env('BACKEND_URL').'/institutions/'.$inst.$externalUrl);

            return ApiController::constructInstRequest($request, $externalUrl, "GET", null);
        }

    protected function readDataDictionary(): mixed
    {
        $response = DataDictionary::all();

        return $response;
    }

    // Gets run details for a specific model run
    public function getRunDetails(Request $request, string $inst_id, string $model_name, string $run_id)
    {
        if (ApiController::isLocalRequest()) {
            // Mock return based on run_id 123
            if ($run_id == '123') {
                return response()->json([
                    'run_id' => '123',
                    'inst_id' => $inst_id,
                    'm_name' => $model_name,
                    'triggered_at' => '2025-02-25T19:48:43',
                    'created_by' => 'John Doe',
                    'batch_name' => 'test_batch',
                    'completed' => true,
                    'output_filename' => 'model_results_123.csv',
                    'output_file_link' => 'https://example.com/download/model_results_123.csv',
                    'output_valid' => true,
                ], 200);
            }
        }

        // Production: call external API
        $externalUrl = '/models/'.$model_name.'/run/'.$run_id;
        $result = ApiController::constructInstRequest($request, $externalUrl, "GET", null);

        // Process the response to add output_file_link like modelRuns does
        if ($result != null && $result->getStatusCode() == 200) {
            $output = $result->json();
            if ($output != null) {
                // Note that completed indicates the run was completed, output_valid indicates whether a Datakinder has formally approved the file.
                if ($output["completed"] && $output["output_filename"] != null && $output["output_filename"] != "") {
                    $download_url = ApiController::downloadInfData($request, $output["output_filename"]);
                    if ($download_url->getStatusCode() == 200) {
                        $output["output_file_link"] = $download_url->json();
                    } else {
                        $output["output_file_link"] = '';
                    }
                }
            }
            return response()->json($output);
        }

        return $result;
    }
}
