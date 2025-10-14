<?php

namespace App\Http\Controllers\Api\File;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    public function Upload(Request $request)
    {
        if ($request->hasFile('image')) {
            $content = $request->file('image');

            // Save file to 'public/image' directory
            $path = $content->store('image', 'public');

            // Generate public URL
            $public_url = Storage::url($path);

            return response()->json([
                "status" => "ok",
                "url" => asset($public_url)
            ]);
        } else {
            return response()->json([
                "status" => "not ok",
                "message" => "no image"
            ], 422);
        }
    }
}
