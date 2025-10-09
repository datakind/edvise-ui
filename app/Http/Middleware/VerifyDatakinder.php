<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyDatakinder
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->access_type === "DATAKINDER") {
            return $next($request);
        }

        return response()->json(['error' => 'Access denied. You must be a Datakinder user.'], 403);
    }
}
