<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;

class DiscoveryController extends Controller
{
    public function getCategories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function getServices(Request $request)
    {
        $query = Service::select('services.*')
            ->with(['vendor.vendorProfile', 'category'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->leftJoin('subscriptions', function ($join) {
                $join->on('services.vendor_id', '=', 'subscriptions.vendor_id')
                    ->where('subscriptions.status', '=', 'active')
                    ->where(function ($q) {
                        $q->whereNull('subscriptions.expires_at')
                          ->orWhere('subscriptions.expires_at', '>', now());
                    });
            })
            ->where('services.status', '=', 'active');

        // Search by category
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category)
                  ->orWhere('id', $request->category);
            });
        }

        // Search by wilaya
        if ($request->has('wilaya') && $request->wilaya) {
            $query->where('services.wilaya', $request->wilaya);
        }

        // Search by price range
        if ($request->has('min_price') && $request->min_price) {
            $query->where('services.price', '>=', $request->min_price);
        }
        if ($request->has('max_price') && $request->max_price) {
            $query->where('services.price', '<=', $request->max_price);
        }

        // Sort by plan tier ranking, then by newest services
        $query->orderByRaw("
            CASE 
                WHEN subscriptions.plan = 'platinum' THEN 4
                WHEN subscriptions.plan = 'gold' THEN 3
                WHEN subscriptions.plan = 'silver' THEN 2
                WHEN subscriptions.plan = 'free' THEN 1
                ELSE 1
            END DESC
        ")->orderBy('services.created_at', 'desc');

        $services = $query->paginate(15);
        return response()->json($services);
    }

    public function getServiceDetails($id)
    {
        $service = Service::with([
            'vendor.vendorProfile', 
            'category',
            'vendor.subscriptions' => function($q) {
                $q->where('status', 'active')
                  ->where(function($q) {
                      $q->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now());
                  });
            }
        ])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->where('status', 'active')
            ->findOrFail($id);

        return response()->json($service);
    }
}
