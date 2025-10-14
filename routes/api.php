<?php

use App\Http\Controllers\Api\File\ImageUploadController;
use App\Http\Controllers\Api\File\VideoUploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('image')->group(function () {
    Route::post('/upload', [ImageUploadController::class, 'Upload'])
        ->name('uploadImage');
});

Route::prefix('video')->group(function () {
    Route::post('/upload', [VideoUploadController::class, 'Upload'])
        ->name('uploadVideo');
});
