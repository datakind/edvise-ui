<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyDatakinder
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->access_type === "DATAKINDER") {
            if (!session()->has('datakinder_inst_id') || session('datakinder_inst_id') == "") {
                return response()->json(['error' => 'Datakinder must set an institution to proceed.'], 403);
            }
        }

        return $next($request);
    }
}
