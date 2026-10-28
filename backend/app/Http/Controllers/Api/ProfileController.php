<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Update general user profile (name, phone, password).
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('phone')) {
            $user->phone = $request->phone;
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        if ($user->role === 'vendor') {
            $user->load('vendorProfile');
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update vendor-specific profile (business_name, description, wilaya, etc.).
     */
    public function updateVendorProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'vendor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'business_name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'wilaya' => 'sometimes|string|max:100',
            'category' => 'sometimes|string|max:255',
        ]);

        $user->vendorProfile()->update($request->only([
            'business_name', 'description', 'address', 'wilaya', 'category'
        ]));

        return response()->json([
            'message' => 'Vendor profile updated successfully',
            'user' => $user->load('vendorProfile'),
        ]);
    }
}
