<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function registerClient(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'phone' => $request->phone,
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'Client registered successfully',
            'user' => $user
        ], 201);
    }

    public function registerVendor(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'business_name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'vendor',
            'phone' => $request->phone,
        ]);

        $user->vendorProfile()->create([
            'business_name' => $request->business_name,
            'category' => $request->category,
            'phone' => $request->phone,
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'Vendor registered successfully',
            'user' => $user->load('vendorProfile')
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->role === 'vendor') {
            $user->load('vendorProfile');
        }

        return response()->json([
            'message' => 'Logged in successfully',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        
        if ($user && $user->role === 'vendor') {
            $user->load('vendorProfile');
        }

        return response()->json($user);
    }
}
