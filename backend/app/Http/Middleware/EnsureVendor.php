<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendor
{
    /**
     * Handle an incoming request — only allow vendor role users.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->role !== 'vendor') {
            return response()->json([
                'message' => 'Accès non autorisé. Réservé aux prestataires.',
            ], 403);
        }

        return $next($request);
    }
}
