<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Local/SQLite bootstrap model only. Production UI must not query `job`;
 * use API run endpoints for model_run_id (DDL owned by edvise-api / Alembic).
 */
class Job extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'job';

    /**
     * Indicates if the model should be timestamped.
     * The job table doesn't have created_at/updated_at columns
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'model_id',
        'created_by',
        'triggered_at',
        'batch_name',
        'output_filename',
        'err_msg',
        'completed',
        'output_valid',
        'model_run_id',
        'model_version',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'completed' => 'boolean',
        'output_valid' => 'boolean',
        'triggered_at' => 'datetime',
    ];
}
