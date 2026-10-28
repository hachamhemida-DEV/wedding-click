<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Service;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Get the authenticated user's wishlist with full service details.
     */
    public function index(Request $request)
    {
        $wishlistItems = Wishlist::where('user_id', $request->user()->id)
            ->with(['service.category', 'service.vendor.vendorProfile'])
            ->latest()
            ->get()
            ->pluck('service');

        return response()->json($wishlistItems);
    }

    /**
     * Toggle a service in the user's wishlist (add if missing, remove if exists).
     */
    public function toggle(Request $request, $serviceId)
    {
        $user = $request->user();

        // Ensure service exists
        Service::findOrFail($serviceId);

        $existing = Wishlist::where('user_id', $user->id)
            ->where('service_id', $serviceId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'wishlisted' => false,
                'message' => 'Removed from wishlist.',
            ]);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'service_id' => $serviceId,
        ]);

        return response()->json([
            'wishlisted' => true,
            'message' => 'Added to wishlist.',
        ]);
    }

    /**
     * Check if a specific service is in the user's wishlist.
     */
    public function check(Request $request, $serviceId)
    {
        $wishlisted = Wishlist::where('user_id', $request->user()->id)
            ->where('service_id', $serviceId)
            ->exists();

        return response()->json(['wishlisted' => $wishlisted]);
    }
}
