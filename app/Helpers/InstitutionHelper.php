<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use TokenHelper;

class InstitutionHelper
{
    public const SET_INST_REQUIRED_MESSAGE = 'Datakinder must set an institution to proceed.';

    // This calls the API endpoint that checks if the current self user has been allowlisted in any institution's email lists.
    // Returns the institution id, access_type of the current user if set anywhere.
    public static function checkSelfInst(Request $request)
    {
        // Skip backend API when running locally or in tests (no real backend available).
        if (in_array(strtoupper(env('APP_ENV', '')), ['LOCAL', 'TESTING'], true)) {
            return ['', '', 'User does not have an institution nor access type.'];
        }
        [$tok, $tokErr] = TokenHelper::GetToken($request);
        if ($tok == '') {
            return ['', '', $tokErr];
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
                return ['', '', $resp->getStatusCode()];
            }

            return ['', '', $resp->getStatusCode().': '.$errMsg->detail];
        }

        if ($resp['inst_id'] == null && $resp['access_type'] == null) {
            // For the webapp if both these fields are empty, this is a random user.
            return ['', '', 'User does not have an institution nor access type.'];
        }

        $acces_type_str = '';
        if ($resp['access_type'] != null) {
            $acces_type_str = $resp['access_type'];
        }
        $affected = DB::table('users')
            ->where('email', $request->user()->email)
            ->update(['access_type' => $acces_type_str, 'inst_id' => $resp['inst_id']]);
        if ($affected != 1) {
            return ['', '', 'Error: User table update affected '.$affected.' rows. 1 affected row expected.'];
        }

        return [$resp['inst_id'], $resp['access_type'], ''];
    }

    // Returns the current institution id and an error if any, as a tuple.
    // Single source: session('inst_id'). DataKinders set it via setInst; non-DataKinders get it from user/check-self and we cache it in session.
    public static function GetInstitution(Request $request)
    {
        $inst = session('inst_id');
        if ($inst !== null && $inst !== '') {
            return [$inst, ''];
        }

        if ($request->user()->access_type === 'DATAKINDER') {
            return ['', self::SET_INST_REQUIRED_MESSAGE];
        }

        // Non-DATAKINDER: resolve from user row or backend, then cache in session so next request uses the same path.
        if ($request->user()->inst_id !== null && $request->user()->inst_id !== '') {
            session(['inst_id' => $request->user()->inst_id]);

            return [$request->user()->inst_id, ''];
        }

        [$inst, $access, $err] = self::checkSelfInst($request);
        if ($err !== '') {
            return ['', $err];
        }
        if ($inst !== null && $inst !== '') {
            session(['inst_id' => $inst]);
        }

        return [$inst, ''];
    }

    // Set the current institution id. Only DataKinders may set it (they choose institution via Set Institution page).
    public static function setInst(string $access_type, string $inst): string
    {
        if ($access_type !== 'DATAKINDER') {
            return 'User must be DATAKINDER access type to set institution.';
        }
        if ($inst === '') {
            return 'No institution id specified.';
        }
        session(['inst_id' => $inst]);

        return '';
    }
}
