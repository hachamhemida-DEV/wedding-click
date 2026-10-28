<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific service.
     */
    public function index($serviceId)
    {
        $reviews = Review::where('service_id', $serviceId)
            ->with('user:id,name') // Only select id and name
            ->latest()
            ->paginate(15);

        return response()->json($reviews);
    }

    /**
     * Submit a review for a service.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can submit reviews.'], 403);
        }

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Verify the client has a completed booking for this service
        $completedBooking = Booking::where('client_id', $user->id)
            ->where('service_id', $validated['service_id'])
            ->where('status', 'completed')
            ->first();

        if (!$completedBooking) {
            return response()->json(['message' => 'You can only review services after a completed booking.'], 422);
        }

        // Ensure user hasn't already reviewed this service
        $existingReview = Review::where('user_id', $user->id)
            ->where('service_id', $validated['service_id'])
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this service.'], 422);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'service_id' => $validated['service_id'],
            'booking_id' => $completedBooking->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        $review->load('user:id,name');

        return response()->json($review, 201);
    }
}
