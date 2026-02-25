<?php

namespace App\Http\Controllers;

use App\Helpers\InstitutionHelper;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DataDictionaryController extends Controller
{
    public function show(Request $request): InertiaResponse
    {
        $inst_id = $request->attributes->get('inst_id')
            ?? InstitutionHelper::GetInstitution($request)[0] ?? null;

        Log::info('DataDictionary: inst_id', ['inst_id' => $inst_id]);

        if (! $inst_id) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => null,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $request->attributes->set('inst_id', $inst_id);
        $api = app(ApiController::class);

        $modelsResp = $api->getModels($request);
        $models = $this->responseData($modelsResp);
        Log::info('DataDictionary: models', ['count' => is_array($models) ? count($models) : 0, 'raw_status' => $modelsResp?->getStatusCode()]);

        if (! is_array($models) || count($models) === 0) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => null,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $validModel = collect($models)->first(fn ($m) => ($m['valid'] ?? false) === true || ($m['valid'] ?? 0) === 1);
        if (! $validModel) {
            Log::info('DataDictionary: no valid model');
            return Inertia::render('DataDictionary', [
                'selectedModel' => null,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $modelName = $validModel['name'] ?? null;
        Log::info('DataDictionary: selected model', ['model_name' => $modelName]);

        if (! $modelName) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => $validModel,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $runsResp = $api->modelRunsWithContext($request, $modelName);
        $runs = $this->responseData($runsResp);
        Log::info('DataDictionary: runs', ['count' => is_array($runs) ? count($runs) : 0, 'raw_status' => $runsResp?->getStatusCode()]);

        if (! is_array($runs) || count($runs) === 0) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => $validModel,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $mostRecentRun = $runs[0];
        $run_id = $mostRecentRun['run_id'] ?? null;
        $model_run_id = $mostRecentRun['model_run_id'] ?? (is_string($run_id) || is_int($run_id) ? Job::find($run_id)?->model_run_id : null);
        Log::info('DataDictionary: most recent run', ['run_id' => $run_id, 'model_run_id' => $model_run_id]);

        $features = [];
        if ($model_run_id) {
            $featuresResp = $api->getTopFeaturesWithContext($request, (string) $model_run_id);
            $rawFeatures = $this->responseData($featuresResp);
            if (is_array($rawFeatures)) {
                $seen = [];
                foreach ($rawFeatures as $feature) {
                    $name = $feature['readable_feature_name'] ?? $feature['feature_readable_name'] ?? null;
                    if ($name && ! isset($seen[$name])) {
                        $seen[$name] = true;
                        $features[] = $feature;
                    }
                }
            }
        }

        Log::info('DataDictionary: features', ['count' => count($features)]);

        return Inertia::render('DataDictionary', [
            'selectedModel' => $validModel,
            'mostRecentRun' => $mostRecentRun,
            'features' => $features,
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
