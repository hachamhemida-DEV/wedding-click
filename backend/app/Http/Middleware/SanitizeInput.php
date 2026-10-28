<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * Fields to sanitize (strip HTML tags from).
     */
    protected array $fieldsToSanitize = [
        'message',
        'description',
        'comment',
        'notes',
        'admin_notes',
        'event_type',
        'business_name',
        'address',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$value, $key) {
            if (is_string($value) && in_array($key, $this->fieldsToSanitize)) {
                $value = strip_tags($value);
                $value = trim($value);
            }
        });

        $request->merge($input);

        return $next($request);
    }
}
