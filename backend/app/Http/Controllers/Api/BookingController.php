<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * List bookings for the authenticated user (auto-filtered by role).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Booking::with(['service.category', 'client', 'vendor.vendorProfile']);

        if ($user->role === 'client') {
            $query->forClient($user->id);
        } elseif ($user->role === 'vendor') {
            $query->forVendor($user->id);
        } else {
            // Admin can see all
        }

        // Optional status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate(20);

        return response()->json($bookings);
    }

    /**
     * Client creates a new booking request.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can create bookings.'], 403);
        }

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'event_date' => 'required|date|after:today',
            'event_type' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:1000',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        // Prevent duplicate pending bookings for the same service
        $existing = Booking::where('client_id', $user->id)
            ->where('service_id', $service->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already have a pending booking for this service.'], 422);
        }

        $booking = Booking::create([
            'client_id' => $user->id,
            'service_id' => $service->id,
            'vendor_id' => $service->vendor_id,
            'event_date' => $validated['event_date'],
            'event_type' => $validated['event_type'] ?? null,
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
            'price' => $service->price,
        ]);

        $booking->load(['service.category', 'client', 'vendor.vendorProfile']);

        // Notify vendor of new booking request
        $vendor = \App\Models\User::find($booking->vendor_id);
        if ($vendor) {
            $vendor->notify(new \App\Notifications\PlatformNotification(
                'booking_created',
                'Nouvelle demande de réservation',
                "Vous avez reçu une demande de réservation de {$user->name} pour votre service \"{$service->title}\".",
                '/vendor/bookings'
            ));
        }

        return response()->json($booking, 201);
    }

    /**
     * Get a single booking detail.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $booking = Booking::with(['service.category', 'client', 'vendor.vendorProfile'])->findOrFail($id);

        // Only the client, vendor, or admin can view
        if ($user->role !== 'admin' && $booking->client_id !== $user->id && $booking->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking);
    }

    /**
     * Vendor accepts a pending booking.
     */
    public function accept(Request $request, $id)
    {
        $user = $request->user();
        $booking = Booking::findOrFail($id);

        if ($booking->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be accepted.'], 422);
        }

        $booking->update(['status' => 'accepted']);
        $booking->load(['service', 'client']);

        // Notify client of accepted booking
        $client = \App\Models\User::find($booking->client_id);
        if ($client) {
            $client->notify(new \App\Notifications\PlatformNotification(
                'booking_accepted',
                'Réservation acceptée !',
                "Votre réservation pour le service \"{$booking->service->title}\" a été acceptée par le prestataire.",
                '/client/bookings'
            ));
        }

        return response()->json(['message' => 'Booking accepted.', 'booking' => $booking->fresh()]);
    }

    /**
     * Vendor rejects a pending booking.
     */
    public function reject(Request $request, $id)
    {
        $user = $request->user();
        $booking = Booking::findOrFail($id);

        if ($booking->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be rejected.'], 422);
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $booking->update([
            'status' => 'rejected',
            'notes' => $request->notes,
        ]);
        $booking->load(['service', 'client']);

        // Notify client of rejected booking
        $client = \App\Models\User::find($booking->client_id);
        if ($client) {
            $client->notify(new \App\Notifications\PlatformNotification(
                'booking_rejected',
                'Réservation déclinée',
                "Votre demande de réservation pour le service \"{$booking->service->title}\" a été déclinée.",
                '/client/bookings'
            ));
        }

        return response()->json(['message' => 'Booking rejected.', 'booking' => $booking->fresh()]);
    }

    /**
     * Vendor marks an accepted booking as completed.
     */
    public function complete(Request $request, $id)
    {
        $user = $request->user();
        $booking = Booking::findOrFail($id);

        if ($booking->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'accepted') {
            return response()->json(['message' => 'Only accepted bookings can be completed.'], 422);
        }

        $booking->update(['status' => 'completed']);
        $booking->load(['service', 'client']);

        // Notify client of completed booking
        $client = \App\Models\User::find($booking->client_id);
        if ($client) {
            $client->notify(new \App\Notifications\PlatformNotification(
                'booking_completed',
                'Prestation terminée',
                "La prestation pour \"{$booking->service->title}\" est terminée. N'hésitez pas à laisser une évaluation !",
                '/client/bookings'
            ));
        }

        return response()->json(['message' => 'Booking marked as completed.', 'booking' => $booking->fresh()]);
    }

    /**
     * Client cancels a pending booking.
     */
    public function cancel(Request $request, $id)
    {
        $user = $request->user();
        $booking = Booking::findOrFail($id);

        if ($booking->client_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Only pending bookings can be cancelled.'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Booking cancelled.', 'booking' => $booking->fresh()]);
    }
}
