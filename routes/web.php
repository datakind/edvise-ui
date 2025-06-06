<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Helpers\InstitutionHelper;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\DemoRequestController;

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

/*
Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
        // return redirect()->route('home'); // simply returns the homepage
    })->name('dashboard');
});
*/
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/file-upload',
    function () {
        return Inertia::render('FileUpload');
    }
)->name('file-upload');

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/dashboard/{modelname}',
    function ($modelname) {
        return Inertia::render('Dashboard', ['modelname' => $modelname]);
    }
)->name('dashboard_modelname');

// The default dashboard page.
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/dashboard',
    function () {
        return Inertia::render('Dashboard');
    }
)->name('dashboard');

// The default home page when logged in.
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/new-home',
    function () {
        return Inertia::render('NewHome');
    }
)->name('new-home');

// difficult to get params working with named routes
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->post('/file-upload-api/{filename}', [ApiController::class, 'fileUploadApi']);
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->post('/file-validate-api/{filename}', [ApiController::class, 'fileValidateApi']);
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->post('/run-inference/{model_name}', [ApiController::class, 'runInferenceApi']);

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->post('/create-batch', [ApiController::class, 'createBatch']);
Route::middleware(array_filter([
    'auth',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->post('/create-model', [ApiController::class, 'createModelApi']);
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/models-api', [ApiController::class, 'getModels']);

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/view-input-data', [ApiController::class, 'viewInputData']);
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/view-uploaded-data', [ApiController::class, 'viewUploadedData']);
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/view-output-data', [ApiController::class, 'viewOutputData']);

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/run-inference',
    function () {
        return Inertia::render('RunInference');
    }
)->name('run-inference');

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/manage-uploads',
    function () {
        return Inertia::render('ManageUploads');
    }
)->name('manage-uploads');

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/file-management',
    function () {
        return Inertia::render('FileManagement');
    }
)->name('file-management');

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/download-inf-data/{filename}', [ApiController::class, 'downloadInfData'])->where('filename', '.*');

// Since the filename may contain forward slashes, we have to explicitly use regex so Laravel can recognize this route.
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/output-file-bytes/{filename}', [ApiController::class, 'fileBytes'])->where('filename', '.*');
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/output-file-json/{filename}', [ApiController::class, 'fileJson'])->where('filename', '.*');
Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/output-file-png/{filename}', [ApiController::class, 'filePng'])->where('filename', '.*');

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/model/{model_name}', [ApiController::class, 'modelRuns']);
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

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get('/read-data-dictionary', [ApiController::class, 'readDataDictionary'])->name('read.data-dictionary');

Route::get('auth/google', [LoginController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [LoginController::class, 'handleGoogleCallback']);

Route::get('auth/azure', [LoginController::class, 'redirectToAzure']);
Route::get('auth/azure/callback', [LoginController::class, 'handleAzureCallback']);

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
    // The following returns a list of two strings, the first is the inst id, the second is an error if any.
    Route::get('/user-current-inst-api', [InstitutionHelper::class, 'getInstitution']);

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

Route::post('/demo-request', [DemoRequestController::class, 'store'])->name('demo.request');

Route::middleware(array_filter([
    'auth', 'terms.accepted',
    env('APP_ENV') === 'prod' ? 'verified' : null,
]))->get(
    '/model-results-overview',
    function () {
        return Inertia::render('ModelResultsOverview');
    }
)->name('model-results-overview');
