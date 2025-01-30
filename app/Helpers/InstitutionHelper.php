<?php
namespace App\Helpers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class InstitutionHelper
{
    // Returns the institution id and an error if any, as a tuple.
    public static function getInstitution(Request $request)
    {
        if ($request->user()->inst_id != null) {
            return [$request->user()->inst_id, ""];
        }
        if ($request->user()->access_type == "DATAKINDER") {
            if ($request->session()->has('datakinder_inst_id') && session(['datakinder_inst_id']) != "") {
                return [$request->session()->get('datakinder_inst_id'), ""];
            }
            // Datakinder with no institution has to set their institution otherwise we will return an error
            return ["", "Datakinder must set an institution to proceed."];
        }
        return ["", "No institution set for this user."];
    }

    // Set the institution id for Datakinders, return an error if any.
    public static function setDatakinderInst(Request $request, string $inst)
    {
        if ($request->user()->access_type != "DATAKINDER") {
            return "User must be DATAKINDER access type to set institution.";
        }
        if ($inst == "") {
            return "No institution id specified.";
        }
        session(['datakinder_inst_id' => $inst]);
        return "";
    }
}
