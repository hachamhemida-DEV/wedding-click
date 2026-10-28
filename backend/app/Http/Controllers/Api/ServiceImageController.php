<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp,avif|max:10240', // 10MB Max
        ]);

        try {
            $file = $request->file('image');

            // Generate a unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Store in public/storage/services/
            $file->storeAs('services', $filename, 'public');

            // Build the public URL
            $url = url('storage/services/' . $filename);

            return response()->json([
                'message' => 'Image uploaded successfully',
                'url'     => $url,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload image',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
