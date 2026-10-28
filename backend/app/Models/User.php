<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'language_preference',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the vendor profile associated with the user.
     */
    public function vendorProfile()
    {
        return $this->hasOne(VendorProfile::class);
    }

    /**
     * Get the services for the vendor.
     */
    public function services()
    {
        return $this->hasMany(Service::class, 'vendor_id');
    }

    /**
     * Get bookings made by this client.
     */
    public function clientBookings()
    {
        return $this->hasMany(Booking::class, 'client_id');
    }

    /**
     * Get bookings received by this vendor.
     */
    public function vendorBookings()
    {
        return $this->hasMany(Booking::class, 'vendor_id');
    }

    /**
     * Get all subscriptions for this vendor.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'vendor_id');
    }

    /**
     * Get the active subscription for this vendor.
     */
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class, 'vendor_id')
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->latestOfMany();
    }

    /**
     * Get active plan name, default to 'free'.
     */
    public function getSubscriptionPlanAttribute()
    {
        $active = $this->activeSubscription;
        return $active ? $active->plan : 'free';
    }

    /**
     * Get max allowed photos based on active plan.
     */
    public function getSubscriptionMaxPhotosAttribute()
    {
        $active = $this->activeSubscription;
        return $active ? $active->max_photos : 5; // Free plan defaults to 5
    }
}

