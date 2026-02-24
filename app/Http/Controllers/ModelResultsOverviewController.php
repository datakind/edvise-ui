<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ModelResultsOverviewController extends Controller
{
    public function show(string $run_id, string $modelName): Response
    {
        return Inertia::render('ModelResultsOverview', [
            'job_run_id' => $run_id,
            'modelName' => $modelName,
        ]);
    }
}
