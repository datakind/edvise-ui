<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckInviteValidated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && !Auth::user()->invite_validated) {
            // User is logged in but not invite-validated
            Auth::logout();
            return redirect()->route('invite.validation')
                           ->withErrors(['message' => 'Your account requires invite validation. Please enter your invite code.']);
        }

        return $next($request);
    }
}
