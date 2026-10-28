<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user (paginated).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->latest()
            ->paginate(15);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marquée comme lue.',
            'unread_count' => $request->user()->unreadNotifications()->count()
        ]);
    }

    /**
     * Mark all notifications for the authenticated user as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->unreadNotifications
            ->markAsRead();

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues.',
            'unread_count' => 0
        ]);
    }
}
