<?php

namespace App\Http\Controllers;

use App\Models\Invite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class InviteController extends Controller
{
    /**
     * Show the invite validation form
     */
    public function showInviteForm()
    {
        return Inertia::render('Auth/InviteValidation');
    }

    /**
     * Validate an invite code and show registration form
     */
    public function validateInvite(Request $request)
    {
        $request->validate([
            'invite_code' => 'required|string|max:64',
        ]);

        $invite = Invite::where('invite_code', $request->invite_code)
                       ->where('is_used', false)
                       ->where('expires_at', '>', now())
                       ->first();

        if (!$invite) {
            return back()->withErrors([
                'invite_code' => 'Invalid or expired invite code.',
            ]);
        }

        // Check if user already exists
        $existingUser = User::where('email', $invite->email)->first();

        if ($existingUser) {
            if ($existingUser->invite_validated) {
                // User already validated, redirect to login
                return redirect()->route('login')
                    ->withErrors(['invite_code' => 'This email is already registered and validated. Please log in instead.']);
            }
            // If user exists but not validated, allow them to proceed with invite validation
            // (This includes SSO users who need to validate their invite)
        }

        // Store invite in session for registration
        session(['valid_invite' => $invite]);

        // Log the flow for debugging
        \Log::info("Invite validated for email: {$invite->email}, redirecting to registration");

        return redirect()->route('register');
    }

    /**
     * Show the registration form (only accessible with valid invite)
     */
    public function showRegistrationForm()
    {
        if (!session('valid_invite')) {
            return redirect()->route('invite.validation');
        }

        $invite = session('valid_invite');

        // Check if this is an SSO user by looking at the existing user record
        $existingUser = User::where('email', $invite->email)->first();
        $isSsoUser = $existingUser && ($existingUser->google_id || $existingUser->azure_id);

        // Log for debugging
        \Log::info("Showing registration form for email: {$invite->email}, isSsoUser: " . ($isSsoUser ? 'true' : 'false'));

        return Inertia::render('Auth/Register', [
            'invite' => [
                'email' => $invite->email,
                'role' => $invite->role,
                'institution_id' => $invite->institution_id,
            ],
            'isSsoUser' => $isSsoUser
        ]);
    }

    /**
     * Process user registration
     */
    public function register(Request $request)
    {
        \Log::info("Registration attempt received", [
            'email' => $request->email ?? 'not set',
            'name' => $request->name ?? 'not set',
            'has_valid_invite' => session('valid_invite') ? 'yes' : 'no',
            'is_sso_user' => session('sso_user') ? 'yes' : 'no'
        ]);

        if (!session('valid_invite')) {
            return redirect()->route('invite.validation');
        }

        $invite = session('valid_invite');

        // Check if this is an SSO user by looking at existing user record or session
        $existingUser = User::where('email', $invite->email)->first();
        $isSsoUser = session('sso_user', false) || ($existingUser && ($existingUser->google_id || $existingUser->azure_id));

        \Log::info("SSO user detection", [
            'email' => $invite->email,
            'session_sso_user' => session('sso_user', false),
            'existing_user_has_google_id' => $existingUser ? ($existingUser->google_id ? 'yes' : 'no') : 'no user',
            'existing_user_has_azure_id' => $existingUser ? ($existingUser->azure_id ? 'yes' : 'no') : 'no user',
            'final_is_sso_user' => $isSsoUser
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => $isSsoUser ? 'nullable' : 'required|string|min:8|confirmed',
            'accepted_terms' => 'required|accepted',
        ]);

        // Use the existing user we already queried above

        if ($existingUser) {
            // If user exists but isn't invite-validated, update them
            if (!$existingUser->invite_validated) {
                $updateData = [
                    'name' => $request->name,
                    'invite_validated' => true,
                    'accepted_terms' => true,
                ];

                // Only update password if not an SSO user
                if (!$isSsoUser) {
                    $updateData['password'] = Hash::make($request->password);
                }

                $existingUser->update($updateData);

                // Mark invite as used
                $invite->markAsUsed();

                // Clear session
                session()->forget('valid_invite');
                session()->forget('sso_user');
                session()->forget('sso_user_data');

                // Log the user in
                Auth::login($existingUser);

                return redirect()->intended(route('dashboard'));
            } else {
                // User already validated, redirect to login
                session()->forget('valid_invite');
                return redirect()->route('login')
                    ->withErrors(['email' => 'This email is already registered and validated. Please log in instead.']);
            }
        }

        // Create new user if none exists
        $userData = [
            'name' => $request->name,
            'email' => $invite->email,
            'invite_validated' => true,
            'accepted_terms' => true,
        ];

        // Only set password if not an SSO user
        if (!$isSsoUser) {
            $userData['password'] = Hash::make($request->password);
        }

        // Add SSO provider IDs if available
        if ($isSsoUser && session('sso_user_data')) {
            $ssoData = session('sso_user_data');
            if (isset($ssoData['google_id'])) {
                $userData['google_id'] = $ssoData['google_id'];
            }
            if (isset($ssoData['azure_id'])) {
                $userData['azure_id'] = $ssoData['azure_id'];
            }
        }

        $user = User::create($userData);

        // Create personal team for SSO users (required by Jetstream)
        if ($isSsoUser) {
            $team = \App\Models\Team::forceCreate([
                'user_id' => $user->id,
                'name' => explode(' ', $user->name, 2)[0]."'s Team",
                'personal_team' => true,
            ]);

            $team->save();
            $user->current_team_id = $team->id;
            $user->save();
        }

        // Mark invite as used
        $invite->markAsUsed();

        // Clear session
        session()->forget('valid_invite');
        session()->forget('sso_user');
        session()->forget('sso_user_data');

        // Log the user in
        Auth::login($user);

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Create a new invite (admin only)
     */
    public function createInvite(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:user,admin,datakinder',
            'institution_id' => 'nullable|string',
            'expires_in_days' => 'nullable|integer|min:1|max:30',
        ]);

        $invite = Invite::create([
            'email' => $request->email,
            'role' => $request->role,
            'institution_id' => $request->institution_id,
            'expires_at' => now()->addDays($request->expires_in_days ?? 7),
            'invited_by' => Auth::id(),
        ]);

        // Send invite email
        $this->sendInviteEmail($invite);

        return response()->json([
            'message' => 'Invite created successfully',
            'invite' => $invite,
        ]);
    }

    /**
     * Send invite email
     */
    private function sendInviteEmail(Invite $invite)
    {
        // TODO: Create and send invite email
        // This would typically use Laravel's Mail facade
        // For now, we'll just log it
        \Log::info("Invite sent to {$invite->email} with code: {$invite->invite_code}");
    }

    /**
     * List all invites (admin only)
     */
    public function listInvites()
    {
        $invites = Invite::with('invitedBy')
                        ->orderBy('created_at', 'desc')
                        ->paginate(20);

        return Inertia::render('Admin/Invites', [
            'invites' => $invites,
        ]);
    }

    /**
     * Resend invite (admin only)
     */
    public function resendInvite(Invite $invite)
    {
        if ($invite->is_used) {
            return response()->json([
                'message' => 'Cannot resend used invite',
            ], 400);
        }

        // Extend expiration
        $invite->update([
            'expires_at' => now()->addDays(7),
        ]);

        // Resend email
        $this->sendInviteEmail($invite);

        return response()->json([
            'message' => 'Invite resent successfully',
        ]);
    }

    /**
     * Delete invite (admin only)
     */
    public function deleteInvite(Invite $invite)
    {
        if ($invite->is_used) {
            return response()->json([
                'message' => 'Cannot delete used invite',
            ], 400);
        }

        $invite->delete();

        return response()->json([
            'message' => 'Invite deleted successfully',
        ]);
    }
}
