<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Helpers\InstitutionHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ModelResultsOverviewController extends Controller
{
    public function show(Request $request, string $run_id, string $modelName): InertiaResponse|JsonResponse
    {
        $inst_id = $request->attributes->get('inst_id')
            ?? InstitutionHelper::GetInstitution($request)[0] ?? null;

        if (! $inst_id) {
            return Inertia::render('ModelResultsOverview', [
                'job_run_id' => $run_id,
                'modelName' => $modelName,
                'model_run_id' => null,
                'runDetails' => null,
                'rawFeatures' => [],
                'featureImportanceData' => [],
                'error' => 'No institution context',
            ]);
        }

        $request->attributes->set('inst_id', $inst_id);

        $job = Job::find($run_id);
        $model_run_id = $job?->model_run_id;

        $api = app(ApiController::class);

        $runDetailsResp = $api->getRunDetails($request, $inst_id, $modelName, $run_id);
        $runDetails = $this->responseData($runDetailsResp);

        $topFeaturesResp = $api->getTopFeatures($request, $inst_id, $run_id);
        $rawFeatures = $this->responseData($topFeaturesResp);
        if (! is_array($rawFeatures)) {
            $rawFeatures = [];
        }

        $featureImportanceData = [];
        if ($model_run_id) {
            $fiResp = $api->getFeatureImportance($request, $inst_id, $model_run_id);
            $featureImportanceData = $this->responseData($fiResp);
            if (! is_array($featureImportanceData)) {
                $featureImportanceData = [];
            }
        }

        return Inertia::render('ModelResultsOverview', [
            'job_run_id' => $run_id,
            'modelName' => $modelName,
            'model_run_id' => $model_run_id,
            'runDetails' => $runDetails,
            'rawFeatures' => $rawFeatures,
            'featureImportanceData' => $featureImportanceData,
        ]);
    }

    /**
     * @param  Response|JsonResponse|null  $response
     * @return array|null
     */
    private function responseData($response): ?array
    {
        if (! $response || $response->getStatusCode() !== 200) {
            return null;
        }

        if ($response instanceof JsonResponse) {
            return $response->getData(true);
        }

        return $response->json();
    }
}
