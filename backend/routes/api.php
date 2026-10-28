<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Public Auth Routes (Rate Limited: 5 attempts/min)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->middleware('throttle:5,1')->group(function () {
    Route::post('/register/client', [AuthController::class, 'registerClient']);
    Route::post('/register/vendor', [AuthController::class, 'registerVendor']);
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Public Discovery Routes
|--------------------------------------------------------------------------
*/
Route::get('/categories', [\App\Http\Controllers\Api\DiscoveryController::class, 'getCategories']);
Route::get('/services', [\App\Http\Controllers\Api\DiscoveryController::class, 'getServices']);
Route::get('/services/{id}', [\App\Http\Controllers\Api\DiscoveryController::class, 'getServiceDetails']);
Route::get('/services/{id}/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Token Auth)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/services/upload-image', [\App\Http\Controllers\Api\ServiceImageController::class, 'upload']);

    // Broadcast Authorization
    \Illuminate\Support\Facades\Broadcast::routes(['middleware' => ['auth:sanctum']]);

    // Profile Updates
    Route::post('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'updateProfile']);
    Route::post('/profile/vendor', [\App\Http\Controllers\Api\ProfileController::class, 'updateVendorProfile']);

    // Vendor-only Routes
    Route::middleware('vendor')->group(function () {
        Route::apiResource('vendor/services', \App\Http\Controllers\Api\VendorServiceController::class);
        Route::get('/vendor/subscription', [\App\Http\Controllers\Api\SubscriptionController::class, 'current']);
        Route::post('/vendor/subscriptions', [\App\Http\Controllers\Api\SubscriptionController::class, 'store']);
    });

    // Bookings
    Route::get('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'index']);
    Route::post('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'store']);
    Route::get('/bookings/{id}', [\App\Http\Controllers\Api\BookingController::class, 'show']);
    Route::put('/bookings/{id}/accept', [\App\Http\Controllers\Api\BookingController::class, 'accept']);
    Route::put('/bookings/{id}/reject', [\App\Http\Controllers\Api\BookingController::class, 'reject']);
    Route::put('/bookings/{id}/complete', [\App\Http\Controllers\Api\BookingController::class, 'complete']);
    Route::put('/bookings/{id}/cancel', [\App\Http\Controllers\Api\BookingController::class, 'cancel']);

    // Wishlist
    Route::get('/wishlist', [\App\Http\Controllers\Api\WishlistController::class, 'index']);
    Route::post('/wishlist/{serviceId}', [\App\Http\Controllers\Api\WishlistController::class, 'toggle']);
    Route::get('/wishlist/check/{serviceId}', [\App\Http\Controllers\Api\WishlistController::class, 'check']);

    // Reviews
    Route::post('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::put('/notifications/read/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);

    // Admin-only Routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/metrics', [\App\Http\Controllers\Api\AdminController::class, 'metrics']);
        Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
        Route::delete('/users/{id}', [\App\Http\Controllers\Api\AdminController::class, 'deleteUser']);

        Route::post('/categories', [\App\Http\Controllers\Api\AdminController::class, 'storeCategory']);
        Route::put('/categories/{id}', [\App\Http\Controllers\Api\AdminController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\Api\AdminController::class, 'deleteCategory']);

        // Admin Subscriptions
        Route::get('/subscriptions', [\App\Http\Controllers\Api\SubscriptionController::class, 'index']);
        Route::put('/subscriptions/{id}/approve', [\App\Http\Controllers\Api\SubscriptionController::class, 'approve']);
        Route::put('/subscriptions/{id}/reject', [\App\Http\Controllers\Api\SubscriptionController::class, 'reject']);
    });
});
