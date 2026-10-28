<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'category',
        'phone',
        'description',
        'address',
        'wilaya',
        'status',
        'subscription_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'subscription_ends_at' => 'date',
        ];
    }

    /**
     * Get the user that owns the vendor profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
