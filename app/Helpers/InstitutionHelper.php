<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use TokenHelper;

class InstitutionHelper
{
    // This calls the API endpoint that checks if the current self user has been allowlisted in any institution's email lists.
    // Returns the institution id, access_type of the current user if set anywhere.
    public static function checkSelfInst(Request $request)
    {
        // To allow for local testing.
        if (strtoupper(env('APP_ENV')) == 'LOCAL') {
            return ["", "", "User does not have an institution nor access type."];
        }
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == "") {
            return ["","", $tokErr];
        }

        $headers = [
            'Authorization' => 'Bearer '.$tok,
            'accept' => 'application/json',
            'Cache-Control' => 'no-cache',
        ];

        $resp = Http::withHeaders($headers)->get(env('BACKEND_URL').'/check-self');
        if ($resp->getStatusCode() != 200) {
            $errMsg = json_decode($resp->getBody());
            if ($errMsg == null) {
                return ["","", $resp->getStatusCode()];
            }
            return ["","", $resp->getStatusCode().": ".$errMsg->detail];
        }

        if ($resp["inst_id"] == null && $resp["access_type"] == null) {
            // For the webapp if both these fields are empty, this is a random user.
            return ["", "", "User does not have an institution nor access type."];
        }

        $acces_type_str = '';
        if ($resp["access_type"] != null) {
            $acces_type_str = $resp["access_type"];
        }
        $affected = DB::table('users')
              ->where('email', $request->user()->email)
              ->update(['access_type' => $acces_type_str, 'inst_id' => $resp["inst_id"]]);
        if ($affected != 1) {
            return ["", "", "Error: User table update affected ".$affected." rows. 1 affected row expected."];
        }
        return [$resp["inst_id"], $resp["access_type"], ""];
    }

    // Returns the institution id and an error if any, as a tuple.
    public static function getInstitution(Request $request)
    {
        if ($request->user()->inst_id != null) {
            return [$request->user()->inst_id, ""];
        }
        if ($request->user()->access_type == "DATAKINDER") {
            if (session()->has('datakinder_inst_id') && session('datakinder_inst_id') != "") {
                return [session()->get('datakinder_inst_id'), ""];
            }
            // Datakinder with no institution has to set their institution otherwise we will return an error
            return ["", "Datakinder must set an institution to proceed."];
        }

        // Call check self in case the user is set as an allowed user for any institution.
        [$inst, $access, $err] = InstitutionHelper::checkSelfInst($request);
        if ($err != "") {
            return ["", $err];
        }

        return [$inst, ""];
    }

    // Set the institution id for Datakinders, return an error if any.
    public static function setDatakinderInst(string $access_type, string $inst)
    {
        if ($access_type != "DATAKINDER") {
            return "User must be DATAKINDER access type to set institution.";
        }
        if ($inst == "") {
            return "No institution id specified.";
        }
        session(['datakinder_inst_id' => $inst]);
        return "";
    }
}
