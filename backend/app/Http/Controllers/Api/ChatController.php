<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Get all conversations for the authenticated user.
     */
    public function getConversations(Request $request)
    {
        $user = $request->user();
        
        $roleField = $user->role === 'client' ? 'client_id' : 'vendor_id';
        $withRelation = $user->role === 'client' ? 'vendor.vendorProfile' : 'client';

        $conversations = Conversation::where($roleField, $user->id)
            ->with([$withRelation, 'latestMessage'])
            ->get()
            ->sortByDesc(function ($conv) {
                return $conv->latestMessage ? $conv->latestMessage->created_at : $conv->created_at;
            })
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get or create a conversation with a specific user.
     */
    public function getOrCreateConversation(Request $request)
    {
        $request->validate([
            'partner_id' => 'required|exists:users,id',
        ]);

        $user = $request->user();
        $partnerId = $request->partner_id;

        // Ensure they are not talking to themselves
        if ($user->id == $partnerId) {
            return response()->json(['message' => 'Cannot chat with yourself'], 422);
        }

        $clientId = $user->role === 'client' ? $user->id : $partnerId;
        $vendorId = $user->role === 'vendor' ? $user->id : $partnerId;

        $conversation = Conversation::firstOrCreate([
            'client_id' => $clientId,
            'vendor_id' => $vendorId,
        ]);

        $withRelation = $user->role === 'client' ? 'vendor.vendorProfile' : 'client';
        $conversation->load($withRelation);

        return response()->json($conversation);
    }

    /**
     * Get messages for a conversation.
     */
    public function getMessages(Request $request, $id)
    {
        $user = $request->user();

        $conversation = Conversation::findOrFail($id);

        // Security check
        if ($conversation->client_id !== $user->id && $conversation->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Mark unread messages from the partner as read
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::where('conversation_id', $conversation->id)
            ->with('sender:id,name')
            ->oldest()
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a new message.
     */
    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $user = $request->user();
        $conversation = Conversation::findOrFail($id);

        if ($conversation->client_id !== $user->id && $conversation->vendor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $request->body,
        ]);

        // Broadcast the event
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message->load('sender:id,name'), 201);
    }
}
