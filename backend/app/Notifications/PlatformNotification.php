<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class PlatformNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $type;
    protected $title;
    protected $message;
    protected $actionUrl;
    protected $extraData;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $type, string $title, string $message, string $actionUrl = '', array $extraData = [])
    {
        $this->type = $type;
        $this->title = $title;
        $this->message = $message;
        $this->actionUrl = $actionUrl;
        $this->extraData = $extraData;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'action_url' => $this->actionUrl,
            'extra_data' => $this->extraData,
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'action_url' => $this->actionUrl,
            'extra_data' => $this->extraData,
            'unread_count' => $notifiable->unreadNotifications()->count() + 1 // Add 1 because it's not saved/updated in DB yet
        ]);
    }
}
