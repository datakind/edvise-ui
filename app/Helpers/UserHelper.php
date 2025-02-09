<?php
namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class UserHelper
{    
    // Checks if a given email is a valid existing user. Returns either error or empty string if no error.
    public static function checkEmailExists(string $email) {

        $users = DB::table('users')->where('email', $email)
                ->get();
        if (sizeof($users) == 0) {
            return "User not found";
        }
        if (sizeof($users) > 1) {
            return "Unexpected. Multiple users with same email found.";
        }
        return "";
    }
}
