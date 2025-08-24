<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Invite extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'invite_code',
        'role',
        'institution_id',
        'expires_at',
        'is_used',
        'used_at',
        'invited_by',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * Generate a unique invite code
     */
    public static function generateInviteCode(): string
    {
        do {
            $code = Str::random(32);
        } while (static::where('invite_code', $code)->exists());

        return $code;
    }

    /**
     * Check if invite is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if invite is valid (not used and not expired)
     */
    public function isValid(): bool
    {
        return !$this->is_used && !$this->isExpired();
    }

    /**
     * Mark invite as used
     */
    public function markAsUsed(): void
    {
        $this->update([
            'is_used' => true,
            'used_at' => now(),
        ]);
    }

    /**
     * Scope for valid invites
     */
    public function scopeValid($query)
    {
        return $query->where('is_used', false)
                    ->where('expires_at', '>', now());
    }

    /**
     * Scope for expired invites
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    /**
     * Scope for unused invites
     */
    public function scopeUnused($query)
    {
        return $query->where('is_used', false);
    }

    /**
     * Boot method to set default values
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invite) {
            if (empty($invite->invite_code)) {
                $invite->invite_code = static::generateInviteCode();
            }

            if (empty($invite->expires_at)) {
                $invite->expires_at = now()->addDays(7); // Default 7 days
            }
        });
    }
}
