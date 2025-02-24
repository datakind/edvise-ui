<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Helpers\InstitutionHelper;

// Main app entrypoint.

Route::get('/', function () {
    //$out = new \Symfony\Component\Console\Output\ConsoleOutput;
    //$out->writeln('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1_DEBUGGING_LINE');
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/login', function () {
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
    ]);
})->name('login');

/*
Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
        // return redirect()->route('home'); // simply returns the homepage
    })->name('dashboard');
});
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->get('/file-upload',
    function () {
        return Inertia::render('FileUpload');
    })->name('file-upload');

Route::middleware('auth')->get('/dashboard/{modelname}',
    function ($modelname) {
        return Inertia::render('Dashboard', ['modelname' => $modelname]);
    })->name('dashboard_modelname');

// The default dashboard page.
Route::middleware('auth')->get('/dashboard',
    function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

// difficult to get params working with named routes
Route::middleware('auth')->post('/file-upload-api/{filename}', [ApiController::class, 'fileUploadApi']);
Route::middleware('auth')->post('/file-validate-api/{filename}', [ApiController::class, 'fileValidateApi']);
Route::middleware('auth')->post('/run-inference/{model_name}', [ApiController::class, 'runInferenceApi']);

Route::middleware('auth')->post('/create-batch', [ApiController::class, 'createBatch']);
Route::middleware('auth')->post('/create-model', [ApiController::class, 'createModelApi']);
Route::middleware('auth')->get('/models-api', [ApiController::class, 'getModels']);

Route::middleware('auth')->get('/view-data',
    function () {
        return Inertia::render('ViewData');
    })->name('view-data');

Route::middleware('auth')->get('/view-input-data', [ApiController::class, 'viewInputData']);
Route::middleware('auth')->get('/view-uploaded-data', [ApiController::class, 'viewUploadedData']);
Route::middleware('auth')->get('/view-output-data', [ApiController::class, 'viewOutputData']);

Route::middleware('auth')->get('/run-inference',
    function () {
        return Inertia::render('RunInference');
    })->name('run-inference');

Route::middleware('auth')->get('/download-data',
    function () {
        return Inertia::render('DownloadInfData');
    })->name('download-data');

Route::middleware('auth')->get('/download-inf-data/{filename}', [ApiController::class, 'downloadInfData']);

Route::middleware('auth')->get('/output-file-bytes/{filename}', [ApiController::class, 'fileBytes']);
Route::middleware('auth')->get('/model/{model_name}', [ApiController::class, 'modelRuns']);
// Data dictionary does not require logging in to view.
Route::get('/data-dictionary', function () {
    return Inertia::render('DataDictionary');
})->name('data-dictionary');

Route::get('/faq', function () {
    return Inertia::render('Faq');
})->name('FAQ');

Route::get('/license', function () {
    return Inertia::render('License');
})->name('license');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy-policy');

Route::get('/terms-of-service', function () {
    return Inertia::render('TermsOfService');
})->name('terms-of-service');

Route::middleware('auth')->get('/read-data-dictionary', [ApiController::class, 'readDataDictionary'])->name('read.data-dictionary');

Route::get('auth/google', [LoginController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [LoginController::class, 'handleGoogleCallback']);

Route::get('auth/azure', [LoginController::class, 'redirectToAzure']);
Route::get('auth/azure/callback', [LoginController::class, 'handleAzureCallback']);


// The below are datakinder only paths.
Route::middleware(['auth', 'datakinder'])->group(function () {
    Route::post('/create-inst-api', [ApiController::class, 'createInstApi']);
    Route::post('/add-dk-api', [ApiController::class, 'addDatakinderApi']);
    Route::get('/view-all-institutions-api', [ApiController::class, 'viewAllInstitutions']);

    Route::get('/create-inst', function () {
        return Inertia::render('CreateInst');
    })->name('create-inst');

    Route::get('/create-model', function () {
        return Inertia::render('CreateModel');
    })->name('create-model');

    Route::get('/set-inst', function () {
        return Inertia::render('SetInst');
    })->name('set-inst');

    Route::get('/add-dk', function () {
        return Inertia::render('AddDatakinders');
    })->name('add-dk');

    Route::post('/set-inst-api/{inst}', function (string $inst) {
        $access_str = Auth::user()->access_type ?? "";
        $errStr = InstitutionHelper::SetDatakinderInst($access_str, $inst);

        if ($errStr != "") {
            return response()->json(['error' => $errStr], 400);
        }

        return $inst;
    });
});

