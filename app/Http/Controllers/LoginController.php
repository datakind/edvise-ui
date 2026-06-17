<?php

namespace App\Http\Controllers;

use App\Helpers\InstitutionHelper;
use App\Models\Invite;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;

class LoginController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return Response
     */
    public function redirectToGoogle(Request $request)
    {
        // Build redirect URL dynamically from current request base URL
        $redirectPath = config('services.google.redirect_path', '/auth/google/callback');
        $redirectUrl = $request->root().$redirectPath;

        return $this->socialiteDriver('google', $redirectUrl)->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return RedirectResponse|Redirector
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            // Build redirect URL dynamically from current request base URL
            $redirectPath = config('services.google.redirect_path', '/auth/google/callback');
            $redirectUrl = $request->root().$redirectPath;

            // Retrieve the user from Google
            $user = $this->socialiteDriver('google', $redirectUrl)->user();

            // Check if there's an existing user with the same email
            $existingUser = User::where('email', $user->getEmail())->first();

            if ($existingUser) {
                // Check if user is invite-validated
                if (! $existingUser->invite_validated) {
                    return redirect()->route('invite.validation')
                        ->withErrors(['message' => 'Your account requires invite validation. Please enter your invite code.']);
                }

                if (! $existingUser->google_id) {
                    $existingUser->google_id = $user->getId();
                    $existingUser->save();
                }

                Auth::login($existingUser);
                InstitutionHelper::syncUserFromBackend($request);

                return redirect()->route('model-run-history');
            } else {
                $invite = Invite::where('email', $user->getEmail())
                    ->where('is_used', false)
                    ->where('expires_at', '>', now())
                    ->first();

                if (! $invite) {
                    return redirect()->route('invite.validation')
                        ->withErrors(['message' => 'You need an invite to register. Please contact an administrator.']);
                }

                // Store invite in session and redirect to registration
                session(['valid_invite' => $invite]);
                session(['sso_user' => true]);
                session(['sso_user_data' => [
                    'name' => $user->getName(),
                    'google_id' => $user->getId(),
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
     * @return Response
     */
    public function redirectToAzure(Request $request)
    {
        // Build redirect URL dynamically from current request base URL
        $redirectPath = config('services.azure.redirect_path', '/auth/azure/callback');
        $redirectUrl = $request->root().$redirectPath;

        return $this->socialiteDriver('azure', $redirectUrl)->redirect();
    }

    /**
     * Obtain the user information from Azure.
     *
     * @return RedirectResponse|Redirector
     */
    public function handleAzureCallback(Request $request)
    {
        try {
            // Build redirect URL dynamically from current request base URL
            $redirectPath = config('services.azure.redirect_path', '/auth/azure/callback');
            $redirectUrl = $request->root().$redirectPath;

            // Retrieve the user from Azure
            $user = $this->socialiteDriver('azure', $redirectUrl)->user();

            // Check if there's an existing user with the same email
            $existingUser = User::where('email', $user->getEmail())->first();

            if ($existingUser) {
                // Check if user is invite-validated
                if (! $existingUser->invite_validated) {
                    return redirect()->route('invite.validation')
                        ->withErrors(['message' => 'Your account requires invite validation. Please enter your invite code.']);
                }

                // If the user exists but doesn't have an Azure ID, update it
                if (! $existingUser->azure_id) {
                    $existingUser->azure_id = $user->getId();
                    $existingUser->save();
                }

                Auth::login($existingUser);
                InstitutionHelper::syncUserFromBackend($request);

                return redirect()->route('model-run-history');
            } else {
                $invite = Invite::where('email', $user->getEmail())
                    ->where('is_used', false)
                    ->where('expires_at', '>', now())
                    ->first();

                if (! $invite) {
                    return redirect()->route('invite.validation')
                        ->withErrors(['message' => 'You need an invite to register. Please contact an administrator.']);
                }

                session(['valid_invite' => $invite]);
                session(['sso_user' => true]);
                session(['sso_user_data' => [
                    'name' => $user->getName(),
                    'azure_id' => $user->getId(),
                ]]);

                return redirect()->route('register');
            }
        } catch (Exception $e) {
            dd($e->getMessage());
        }
    }

    private function socialiteDriver(string $driver, string $redirectUrl): AbstractProvider
    {
        $provider = Socialite::driver($driver);

        if (! $provider instanceof AbstractProvider) {
            throw new Exception("Unexpected Socialite driver: {$driver}");
        }

        return $provider->redirectUrl($redirectUrl);
    }
}
