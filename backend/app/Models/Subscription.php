<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'vendor_id',
        'plan',
        'status',
        'payment_proof',
        'starts_at',
        'expires_at',
        'admin_notes',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    /**
     * Get the max allowed photos for the current plan.
     */
    public function getMaxPhotosAttribute()
    {
        return match($this->plan) {
            'free' => 5,
            'silver' => 15,
            'gold' => 30,
            'platinum' => 9999, // unlimited
            default => 5,
        };
    }

    /**
     * Get the ranking weight for the current plan.
     */
    public function getRankingWeightAttribute()
    {
        if ($this->status !== 'active') return 0;
        
        return match($this->plan) {
            'platinum' => 4,
            'gold' => 3,
            'silver' => 2,
            'free' => 1,
            default => 0,
        };
    }
}
