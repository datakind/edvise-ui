<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\JsonResponse;

class ModelRunIdController extends Controller
{
    /**
     * Resolve model_run_id from the job table by job_run_id (inference run ID).
     */
    public function getByJob(string $job_run_id): JsonResponse
    {
        $job = Job::find($job_run_id);

        if (! $job || ! $job->model_run_id) {
            return response()->json(['error' => 'Model run ID not found for job'], 404);
        }

        return response()->json([
            'model_run_id' => $job->model_run_id,
            'job_id' => $job_run_id,
            'model_id' => $job->model_id,
        ]);
    }
}
