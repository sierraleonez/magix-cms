<?php

namespace App\Http\Controllers\Api\File;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoUploadController extends Controller
{
    public function Upload(Request $request)
    {
        // 1. Initial validation for file presence and size.
        $request->validate([
            'video' => 'required|file', // 100MB max size limit
        ]);

        $file = $request->file('video');

        // 2. Define the list of allowed video MIME types.
        $allowedMimeTypes = [
            'video/mp4',
            'video/mpeg',
            'video/quicktime', // .mov
            'video/webm',
            'video/x-msvideo', // .avi
            'video/x-matroska', // .mkv
        ];

        // 3. Get the REAL MIME type from the uploaded file's content.
        $actualMimeType = $file->getMimeType();

        // 4. Manually validate the real MIME type.
        if (!in_array($actualMimeType, $allowedMimeTypes)) {
            // dd($actualMimeType, $allowedMimeTypes);

            return response()->json([
                'message' => 'Failed to store the video.',
                'error' => 'The uploaded file is not a valid video format. Detected type: ' . $actualMimeType,
            ], 500);
        }


        // 5. If validation passes, store the file.
        try {
            $path = $file->store('videos', 'public');
            $url = Storage::url($path);

            return response()->json([
                'message' => 'Video uploaded successfully!',
                'path' => $path,
                'url' => $url,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to store the video.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
