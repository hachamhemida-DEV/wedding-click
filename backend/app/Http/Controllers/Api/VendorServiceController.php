<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class VendorServiceController extends Controller
{
    /**
     * List all services belonging to the authenticated vendor.
     */
    public function index(Request $request)
    {
        $services = Service::with('category')
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->where('vendor_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($services);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // 1. Enforce max 1 service listing
        $existingCount = Service::where('vendor_id', $user->id)->count();
        if ($existingCount >= 1) {
            return response()->json([
                'message' => 'Vous ne pouvez créer qu\'une seule annonce de service.'
            ], 403);
        }

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'wilaya' => 'required|string|max:100',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
        ]);

        // 2. Validate photo count limit based on subscription plan
        $images = $request->images ?? [];
        $maxPhotos = $user->subscription_max_photos;
        if (count($images) > $maxPhotos) {
            return response()->json([
                'message' => "Votre forfait actuel ne vous permet de télécharger que {$maxPhotos} photos maximum."
            ], 422);
        }

        $service = Service::create([
            'vendor_id' => $user->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'wilaya' => $request->wilaya,
            'images' => $images,
            'status' => 'active',
        ]);

        return response()->json($service->load('category'), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $service = Service::where('vendor_id', $user->id)->findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'wilaya' => 'sometimes|string|max:100',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
        ]);

        // Validate photo count limit based on subscription plan
        if ($request->has('images')) {
            $images = $request->images ?? [];
            $maxPhotos = $user->subscription_max_photos;
            if (count($images) > $maxPhotos) {
                return response()->json([
                    'message' => "Votre forfait actuel ne vous permet de télécharger que {$maxPhotos} photos maximum."
                ], 422);
            }
        }

        $service->update($request->only([
            'category_id', 'title', 'description', 'price', 'wilaya', 'images'
        ]));

        return response()->json($service->load('category'));
    }

    /**
     * Remove the specified service (only if owned by vendor).
     */
    public function destroy(Request $request, $id)
    {
        $service = Service::where('vendor_id', $request->user()->id)->findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }
}
