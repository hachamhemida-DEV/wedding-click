<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get platform metrics overview.
     */
    public function metrics()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_clients' => User::where('role', 'client')->count(),
            'total_vendors' => User::where('role', 'vendor')->count(),
            'total_services' => Service::count(),
            'active_services' => Service::where('status', 'active')->count(),
            'total_categories' => Category::count(),
        ]);
    }

    /**
     * List all users with optional role filter.
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->with('vendorProfile')->latest()->paginate(20);

        return response()->json($users);
    }

    /**
     * Delete a user.
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * CRUD for categories.
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name_fr' => 'required|string|max:255',
            'name_ar' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories',
            'icon' => 'nullable|string|max:50',
        ]);

        $category = Category::create($request->only(['name_fr', 'name_ar', 'slug', 'icon']));

        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name_fr' => 'sometimes|string|max:255',
            'name_ar' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:categories,slug,' . $id,
            'icon' => 'nullable|string|max:50',
        ]);

        $category->update($request->only(['name_fr', 'name_ar', 'slug', 'icon']));

        return response()->json($category);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
