<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToGoogle(Request $request)
    {
        // Build redirect URL dynamically from current request base URL
        $redirectPath = config('services.google.redirect_path', '/auth/google/callback');
        $redirectUrl = $request->root() . $redirectPath;
        
        return Socialite::driver('google')
            ->redirectUrl($redirectUrl)
            ->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function handleGoogleCallback()
    {
        try {
            // Retrieve the user from Google
            $user = Socialite::driver('google')->user();

            // Check if there's an existing user with the same email
            $existingUser = User::where('email', $user->email)->first();

            if ($existingUser) {
                // Check if user is invite-validated
                if (!$existingUser->invite_validated) {
                    return redirect()->route('invite.validation')
                                   ->withErrors(['message' => 'Your account requires invite validation. Please enter your invite code.']);
                }

                // If the user exists but doesn't have a Google ID, update it
                if (! $existingUser->google_id) {
                    $existingUser->google_id = $user->id;
                    $existingUser->save();
                }

                // Log the existing user in
                Auth::login($existingUser);

                return redirect('/dashboard');
            } else {
                // Check if there's a valid invite for this email
                $invite = \App\Models\Invite::where('email', $user->email)
                                           ->where('is_used', false)
                                           ->where('expires_at', '>', now())
                                           ->first();

                if (!$invite) {
                    return redirect()->route('invite.validation')
                                   ->withErrors(['message' => 'You need an invite to register. Please contact an administrator.']);
                }

                // Store invite in session and redirect to registration
                session(['valid_invite' => $invite]);
                session(['sso_user' => true]);
                session(['sso_user_data' => [
                    'name' => $user->name,
                    'google_id' => $user->id,
                ]]);

                return redirect()->route('register');
            }
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }

    /**
     * Redirect the user to the Azure authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToAzure(Request $request)
    {
        // Build redirect URL dynamically from current request base URL
        $redirectPath = config('services.azure.redirect_path', '/auth/azure/callback');
        $redirectUrl = $request->root() . $redirectPath;
        
        return Socialite::driver('azure')
            ->redirectUrl($redirectUrl)
            ->redirect();
    }

    /**
     * Obtain the user information from Azure.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function handleAzureCallback()
    {
        try {
            // Retrieve the user from Azure
            $user = Socialite::driver('azure')->user();

            // Check if there's an existing user with the same email
            $existingUser = User::where('email', $user->email)->first();

            if ($existingUser) {
                // Check if user is invite-validated
                if (!$existingUser->invite_validated) {
                    return redirect()->route('invite.validation')
                                   ->withErrors(['message' => 'Your account requires invite validation. Please enter your invite code.']);
                }

                // If the user exists but doesn't have an Azure ID, update it
                if (! $existingUser->azure_id) {
                    $existingUser->azure_id = $user->id;
                    $existingUser->save();
                }

                // Log the existing user in
                Auth::login($existingUser);

                return redirect('/dashboard');
            } else {
                // Check if there's a valid invite for this email
                $invite = \App\Models\Invite::where('email', $user->email)
                                           ->where('is_used', false)
                                           ->where('expires_at', '>', now())
                                           ->first();

                if (!$invite) {
                    return redirect()->route('invite.validation')
                                   ->withErrors(['message' => 'You need an invite to register. Please contact an administrator.']);
                }

                // Store invite in session and redirect to registration
                session(['valid_invite' => $invite]);
                session(['sso_user' => true]);
                session(['sso_user_data' => [
                    'name' => $user->name,
                    'azure_id' => $user->id,
                ]]);

                return redirect()->route('register');
            }
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }
}
