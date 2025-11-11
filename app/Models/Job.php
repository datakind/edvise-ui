<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    /**
     * Get the most recent valid model_run_id for a given model_id
     *
     * @param  string  $modelId  The model UUID
     * @return string|null The model_run_id or null if not found
     */
    public static function getMostRecentModelRunId(string $modelId): ?string
    {
        $job = self::where('model_id', $modelId)
            ->where('completed', true)
            ->where('output_valid', true)
            ->whereNotNull('model_run_id')
            ->orderBy('triggered_at', 'desc')
            ->first();

        return $job?->model_run_id;
    }

    /**
     * Get all valid jobs for a model
     *
     * @param  string  $modelId  The model UUID
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getValidJobsForModel(string $modelId)
    {
        return self::where('model_id', $modelId)
            ->where('completed', true)
            ->where('output_valid', true)
            ->whereNotNull('model_run_id')
            ->orderBy('triggered_at', 'desc')
            ->get();
    }
}






