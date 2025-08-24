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

        // Store invite in session for registration
        session(['valid_invite' => $invite]);

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
        return Inertia::render('Auth/Register', [
            'invite' => [
                'email' => $invite->email,
                'role' => $invite->role,
                'institution_id' => $invite->institution_id,
            ]
        ]);
    }

    /**
     * Process user registration
     */
    public function register(Request $request)
    {
        if (!session('valid_invite')) {
            return redirect()->route('invite.validation');
        }

        $invite = session('valid_invite');

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'accepted_terms' => 'required|accepted',
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $invite->email,
            'password' => Hash::make($request->password),
            'invite_validated' => true,
            'accepted_terms' => true,
        ]);

        // Mark invite as used
        $invite->markAsUsed();

        // Clear session
        session()->forget('valid_invite');

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
