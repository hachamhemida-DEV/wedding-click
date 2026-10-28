<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'service_id',
        'vendor_id',
        'event_date',
        'event_type',
        'message',
        'status',
        'price',
        'notes',
    ];

    protected $casts = [
        'event_date' => 'date',
        'price' => 'decimal:2',
    ];

    /* ─── Relationships ─── */

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /* ─── Scopes ─── */

    public function scopeForClient($query, $userId)
    {
        return $query->where('client_id', $userId);
    }

    public function scopeForVendor($query, $userId)
    {
        return $query->where('vendor_id', $userId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
