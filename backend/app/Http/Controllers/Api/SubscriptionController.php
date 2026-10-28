<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get the vendor's active subscription status and request history.
     */
    public function current(Request $request)
    {
        $user = $request->user();
        
        $active = $user->activeSubscription;
        $history = Subscription::where('vendor_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'active' => $active,
            'plan' => $user->subscription_plan,
            'max_photos' => $user->subscription_max_photos,
            'history' => $history
        ]);
    }

    /**
     * Vendor submits a new subscription or renewal request with payment proof.
     */
    public function store(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:free,silver,gold,platinum',
            'payment_proof' => 'required|string|url', // Image URL uploaded to Cloudinary
        ]);

        $user = $request->user();

        // If they select Free, they don't need manual proof/approval, but let's let admin approve it anyway
        // Or if Free, we can instantly activate it.
        $status = $request->plan === 'free' ? 'active' : 'pending';
        $startsAt = $request->plan === 'free' ? now() : null;
        $expiresAt = $request->plan === 'free' ? now()->addMonths(12) : null;

        // If there is already a pending request, prevent duplicate submissions
        $pendingExists = Subscription::where('vendor_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($pendingExists) {
            return response()->json([
                'message' => 'Vous avez déjà une demande d\'abonnement en attente d\'approbation.'
            ], 422);
        }

        $subscription = Subscription::create([
            'vendor_id' => $user->id,
            'plan' => $request->plan,
            'status' => $status,
            'payment_proof' => $request->payment_proof,
            'starts_at' => $startsAt,
            'expires_at' => $expiresAt,
        ]);

        // Notify Admins of new subscription payment receipt submission
        if ($status === 'pending') {
            $admins = \App\Models\User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\PlatformNotification(
                    'subscription_submitted',
                    'Nouveau reçu d\'abonnement',
                    "Le prestataire \"{$user->name}\" a soumis un reçu pour la formule " . strtoupper($request->plan) . ".",
                    '/admin/subscriptions'
                ));
            }
        }

        return response()->json($subscription, 201);
    }

    /**
     * Admin: List all subscription requests (pending, active, expired, rejected).
     */
    public function index(Request $request)
    {
        // Simple role check (assumes role = admin)
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $status = $request->query('status');
        $query = Subscription::with('vendor.vendorProfile')->latest();

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(15));
    }

    /**
     * Admin: Approve a pending subscription request.
     */
    public function approve(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $subscription = Subscription::findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response()->json(['message' => 'Cette demande n\'est plus en attente.'], 422);
        }

        // Deactivate any currently active subscriptions for this vendor
        Subscription::where('vendor_id', $subscription->vendor_id)
            ->where('status', 'active')
            ->update(['status' => 'expired']);

        // Activate the new subscription
        $subscription->update([
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => now()->addMonths(12), // 1 year duration
            'admin_notes' => $request->admin_notes,
        ]);

        // Activate the vendor's profile
        \App\Models\VendorProfile::where('user_id', $subscription->vendor_id)
            ->update(['status' => 'active']);

        // Restore the vendor's services to active
        \App\Models\Service::where('vendor_id', $subscription->vendor_id)
            ->update(['status' => 'active']);

        // Notify vendor of approved subscription
        $vendor = \App\Models\User::find($subscription->vendor_id);
        if ($vendor) {
            $vendor->notify(new \App\Notifications\PlatformNotification(
                'subscription_approved',
                'Abonnement activé !',
                "Votre abonnement à la formule " . strtoupper($subscription->plan) . " a été approuvé et activé.",
                '/vendor/subscription'
            ));
        }

        return response()->json($subscription);
    }

    /**
     * Admin: Reject a pending subscription request.
     */
    public function reject(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $subscription = Subscription::findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response()->json(['message' => 'Cette demande n\'est plus en attente.'], 422);
        }

        $subscription->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
        ]);

        // Notify vendor of rejected subscription
        $vendor = \App\Models\User::find($subscription->vendor_id);
        if ($vendor) {
            $vendor->notify(new \App\Notifications\PlatformNotification(
                'subscription_rejected',
                'Demande d\'abonnement rejetée',
                "Votre demande d'abonnement pour la formule " . strtoupper($subscription->plan) . " a été rejetée. " . ($request->admin_notes ? "Motif : {$request->admin_notes}" : ''),
                '/vendor/subscription'
            ));
        }

        return response()->json($subscription);
    }
}
