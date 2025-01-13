<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::middleware(['auth:sanctum', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
        // return redirect()->route('home'); // simply returns the homepage
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->get('/file-upload',
    function () {
        return Inertia::render('FileUpload');
    })->name('file-upload');

// difficult to get params working with named routes
Route::middleware('auth')->post('/file-upload-api/{inst}/{filename}', [ApiController::class, 'fileUploadApi']);

Route::middleware('auth')->get('/view-data',
    function () {
        return Inertia::render('ViewData');
    })->name('view-data');

Route::middleware('auth')->get('/view-input-data/{inst}', [ApiController::class, 'viewInputData']);


Route::middleware('auth')->get('/run-inference',
    function () {
        return Inertia::render('RunInference');
    })->name('run-inference');

Route::middleware('auth')->get('/download-data',
    function () {
        return Inertia::render('DownloadInfData');
    })->name('download-data');

Route::middleware('auth')->get('/download-inf-data/{inst}/{filename}', [ApiController::class, 'downloadInfData']);

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
