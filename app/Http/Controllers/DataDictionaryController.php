<?php

namespace App\Http\Controllers;

use App\Helpers\InstitutionHelper;
use Illuminate\Http\Client\Response as HttpClientResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DataDictionaryController extends Controller
{
    public function show(Request $request): InertiaResponse
    {
        $inst_id = InstitutionHelper::requestInstId($request);

        Log::info('DataDictionary: inst_id', ['inst_id' => $inst_id]);

        if (! $inst_id) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => null,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $api = app(ApiController::class);

        $modelsResp = $api->getModels($request);
        $models = $this->responseData($modelsResp);
        Log::info('DataDictionary: models', ['count' => is_array($models) ? count($models) : 0, 'raw_status' => $modelsResp->status()]);

        if (! is_array($models) || count($models) === 0) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => null,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $validModels = collect($models)->map(fn ($m) => is_array($m) ? $m : throw new \UnexpectedValueException('Unexpected model in backend response'))->filter(fn ($m) => ! ($m['archived'] ?? false))->values();
        $modelNames = $validModels->pluck('name')->all();
        $validModel = $validModels->firstWhere('name', $request->query('model')) ?? $validModels->first();
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
                'models' => $modelNames,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $runsResp = $api->modelRunsWithContext($request, is_scalar($modelName) ? (string) $modelName : throw new \UnexpectedValueException('Unexpected model name in backend response'));
        $runs = $this->responseData($runsResp);
        Log::info('DataDictionary: runs', ['count' => is_array($runs) ? count($runs) : 0, 'raw_status' => $runsResp->status()]);

        if (! is_array($runs) || count($runs) === 0) {
            return Inertia::render('DataDictionary', [
                'selectedModel' => $validModel,
                'models' => $modelNames,
                'mostRecentRun' => null,
                'features' => [],
            ]);
        }

        $mostRecentRun = is_array($runs[0] ?? null) ? $runs[0] : [];
        $run_id = $mostRecentRun['run_id'] ?? null;
        $model_run_id = $mostRecentRun['model_run_id'] ?? null;
        Log::info('DataDictionary: most recent run', ['run_id' => $run_id, 'model_run_id' => $model_run_id]);

        $features = [];
        if ($model_run_id) {
            $featuresResp = $api->getTopFeaturesWithContext($request, is_scalar($model_run_id) ? (string) $model_run_id : throw new \UnexpectedValueException('Unexpected model_run_id in backend response'));
            $rawFeatures = $this->responseData($featuresResp);
            if (is_array($rawFeatures)) {
                $seen = [];
                foreach ($rawFeatures as $feature) {
                    if (! is_array($feature)) {
                        throw new \UnexpectedValueException('Unexpected feature in backend response');
                    }
                    $name = $feature['readable_feature_name'] ?? $feature['feature_readable_name'] ?? null;
                    if ((is_int($name) || is_string($name)) && $name && ! isset($seen[$name])) {
                        $seen[$name] = true;
                        $features[] = $feature;
                    }
                }
            }
        }

        Log::info('DataDictionary: features', ['count' => count($features)]);

        return Inertia::render('DataDictionary', [
            'selectedModel' => $validModel,
            'models' => $modelNames,
            'mostRecentRun' => $mostRecentRun,
            'features' => $features,
        ]);
    }

    /**
     * @return array<int|string, mixed>|null
     */
    private function responseData(HttpClientResponse|JsonResponse|null $response): ?array
    {
        if ($response === null) {
            return null;
        }

        if ($response instanceof JsonResponse) {
            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $data = $response->getData(true);

            return is_array($data) ? $data : null;
        }

        if ($response->status() !== 200) {
            return null;
        }

        $data = $response->json();

        return is_array($data) ? $data : null;
    }
}
