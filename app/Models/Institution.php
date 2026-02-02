<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    use HasFactory;

    /**
     * The primary key is a string (not auto-incrementing).
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'retention_days',
        'allowed_emails',
        'schemas',
        'state',
        'pdp_id',
        'created_by',
        'edvise_id',
    ];

    protected $casts = [
        'allowed_emails' => 'array',
        'schemas' => 'array',
        'retention_days' => 'integer',
    ];
}
