<?php

use App\Helpers\InstitutionHelper;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\DemoRequestController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ModelResultsOverviewController;
use App\Http\Controllers\ModelRunIdController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// PUBLIC ROUTES

// Main app entrypoint.

Route::get('/', function () {
    // $out = new \Symfony\Component\Console\Output\ConsoleOutput;
    // $out->writeln('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1_DEBUGGING_LINE');
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/data-dictionary', [App\Http\Controllers\DataDictionaryController::class, 'show'])->name('data-dictionary');

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

Route::get('/login', function () {
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
    ]);
})->name('login');

// Invite system routes
Route::get('/invite', [App\Http\Controllers\InviteController::class, 'showInviteForm'])->name('invite.validation');
Route::post('/invite/validate', [App\Http\Controllers\InviteController::class, 'validateInvite'])->name('invite.validate');
Route::get('/register', [App\Http\Controllers\InviteController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [App\Http\Controllers\InviteController::class, 'register'])->name('register.post');

// AUTH RELATED ROUTES

Route::get('/email/verify', function () {
    return Inertia::render('Auth/VerifyEmail');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::get('auth/google', [LoginController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [LoginController::class, 'handleGoogleCallback']);

Route::get('auth/azure', [LoginController::class, 'redirectToAzure']);
Route::get('auth/azure/callback', [LoginController::class, 'handleAzureCallback']);

/*
Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
        // return redirect()->route('home'); // simply returns the homepage
    })->name('dashboard');
});
*/

// PROFILE RELATED ROUTES
Route::middleware('auth.app.invite')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// AUTHED ROUTES (invite + terms + verified)
Route::middleware('auth.app.invite')->group(function () {
    Route::get('/file-upload', fn () => Inertia::render('FileUpload'))->name('file-upload');
    Route::get('/dashboard/{modelname}', fn ($modelname) => Inertia::render('Dashboard', ['modelname' => $modelname]))->name('dashboard_modelname');
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
});

// App home and main app routes (auth + terms + verified)
Route::middleware('auth.app')->group(function () {
    Route::get('/app-home', [ApiController::class, 'appHomeRedirect'])->name('app-home');
    Route::get('/home', fn () => Inertia::render('Home'))->name('home');
    Route::post('/file-upload-api/{filename}', [ApiController::class, 'fileUploadApi']);
    Route::post('/file-validate-api/{filename}', [ApiController::class, 'fileValidateApi']);
    Route::post('/run-inference/{model_name}', [ApiController::class, 'runInferenceApi']);
    Route::post('/create-batch', [ApiController::class, 'createBatch']);
    Route::post('/create-model', [ApiController::class, 'createModelApi']);
    Route::get('/models-api', [ApiController::class, 'getModels']);
    Route::get('/support-overview/{run_id}', [ApiController::class, 'getSupportOverview']);
    Route::get('/institutions/{inst_id}/inference/support-overview/{run_id}', [ApiController::class, 'getSupportOverview']);
    Route::get('/institutions/{inst_id}/training/model-cards/{model_run_id}', [ApiController::class, 'downloadModelCard']);
    Route::get('/institutions/{inst_id}/inference/top-features/{run_id}', [ApiController::class, 'getTopFeatures']);
    Route::get('/institutions/{inst_id}/inference/features-boxplot-stat/{run_id}', [ApiController::class, 'getFeaturesBoxplotStat']);
    Route::get('/view-input-data', [ApiController::class, 'viewInputData']);
    Route::get('/view-uploaded-data', [ApiController::class, 'viewUploadedData']);
    Route::get('/view-output-data', [ApiController::class, 'viewOutputData']);
    Route::get('/run-inference', fn () => Inertia::render('RunInference'))->name('run-inference');
    Route::get('/manage-uploads', fn () => Inertia::render('ManageUploads'))->name('manage-uploads');
    Route::get('/file-management', fn () => Inertia::render('FileManagement'))->name('file-management');
    Route::get('/download-inf-data/{filename}', [ApiController::class, 'downloadInfData'])->where('filename', '.*');
    Route::get('/output-file-bytes/{filename}', [ApiController::class, 'fileBytes'])->where('filename', '.*');
    Route::get('/output-file-json/{filename}', [ApiController::class, 'fileJson'])->where('filename', '.*');
    Route::get('/output-file-png/{filename}', [ApiController::class, 'filePng'])->where('filename', '.*');
    Route::get('/model/{model_name}', [ApiController::class, 'modelRuns']);
    Route::get('/model-runs/{model_name}', [ApiController::class, 'modelRunsWithContext']);
    Route::get('/top-features/{run_id}', [ApiController::class, 'getTopFeaturesWithContext']);
    Route::delete('/batch/{batch_id}', [ApiController::class, 'deleteBatchWithContext']);
    Route::patch('/institutions/{inst_id}/batch/{batch_id}', [ApiController::class, 'updateBatch']);
    Route::get('/institutions/{inst_id}/batch/{batch_id}/eda', [ApiController::class, 'getEdaData']);
    Route::get('/read-data-dictionary', [ApiController::class, 'readDataDictionary'])->name('read.data-dictionary');
});

Route::middleware(['auth'])->get('/terms/prompt', function () {
    return Inertia::render('Auth/AcceptTerms');
})->name('terms.prompt');

Route::middleware(['auth'])->post('/terms/accept', function () {
    auth()->user()->update(['accepted_terms' => true]);

    return redirect()->route('dashboard');
})->name('terms.accept');

// The below are datakinder only paths.
Route::middleware(['auth', 'datakinder', 'terms.accepted'])->group(function () {
    Route::post('/create-inst-api', [ApiController::class, 'createInstApi']);
    Route::post('/edit-inst-api', [ApiController::class, 'EditInstApi']);
    Route::post('/add-dk-api', [ApiController::class, 'addDatakinderApi']);
    Route::get('/view-all-institutions-api', [ApiController::class, 'viewAllInstitutions']);

    Route::get('/create-inst', function () {
        return Inertia::render('CreateInst');
    })->name('create-inst');

    Route::get('/edit-inst', function () {
        return Inertia::render('EditInst');
    })->name('edit-inst');

    Route::get('/create-model', function () {
        return Inertia::render('CreateModel');
    })->name('create-model');

    Route::get('/set-inst', function () {
        return Inertia::render('SetInst', ['message' => request('message')]);
    })->name('set-inst');

    Route::get('/add-dk', function () {
        return Inertia::render('AddDatakinders');
    })->name('add-dk');

    Route::post('/set-inst-api/{inst}', function (string $inst) {
        $access_str = Auth::user()->access_type ?? '';
        $errStr = InstitutionHelper::SetDatakinderInst($access_str, $inst);

        if ($errStr != '') {
            return response()->json(['error' => $errStr], 400);
        }

        return $inst;
    });
});

Route::post('/demo-request', [DemoRequestController::class, 'store'])->name('demo.request');

Route::middleware(['auth', 'terms.accepted'])->group(function () {

    Route::get('/institutions/{inst_id}/models/{model_name}/run/{run_id}', [ApiController::class, 'getRunDetails']);
    Route::get('/institutions/{inst_id}/training/feature_importance/{model_run_id}', [ApiController::class, 'getFeatureImportance']);
    Route::get('/institutions/{inst_id}/training/confusion_matrix/{model_run_id}', [ApiController::class, 'getConfusionMatrix']);
    Route::get('/institutions/{inst_id}/training/roc_curve/{model_run_id}', [ApiController::class, 'getRocCurve']);
    Route::get('/institutions/{inst_id}/training/support-overview/{model_run_id}', [ApiController::class, 'getTrainingSupportOverview']);
    Route::get('/institutions/{inst_id}/training/model-cards/{model_run_id}', [ApiController::class, 'downloadModelCard']);

    // DEPRECATED: inst_id is now shared via Inertia props (HandleInertiaRequests middleware)
    // This route is kept for backward compatibility and debugging purposes
    // The following returns a list of two strings, the first is the inst id, the second is an error if any.
    Route::get('/user-current-inst-api', [InstitutionHelper::class, 'getInstitution']);

});

Route::middleware('auth.app')->get(
    '/model-results-overview/{run_id}/{modelName}',
    [ModelResultsOverviewController::class, 'show']
)->name('model-results-overview');

Route::get('/get-model-run-id-by-job/{job_run_id}', [ModelRunIdController::class, 'getByJob']);
Route::get('/get-model-run-id/{inst_id}', [ModelRunIdController::class, 'getByInst']);

// Admin invite management routes
Route::middleware(['auth', 'invite.validated', 'datakinder'])->group(function () {
    Route::get('/admin/invites', [App\Http\Controllers\InviteController::class, 'listInvites'])->name('admin.invites');
    Route::post('/admin/invites', [App\Http\Controllers\InviteController::class, 'createInvite'])->name('admin.invites.create');
    Route::post('/admin/invites/{invite}/resend', [App\Http\Controllers\InviteController::class, 'resendInvite'])->name('admin.invites.resend');
    Route::delete('/admin/invites/{invite}', [App\Http\Controllers\InviteController::class, 'deleteInvite'])->name('admin.invites.delete');
});

Route::middleware('auth.app')->get('/eda', function (Request $request) {
    return Inertia::render('EdaDashboard', [
        'batch_id' => $request->query('batch_id'),
    ]);
})->name('eda');
