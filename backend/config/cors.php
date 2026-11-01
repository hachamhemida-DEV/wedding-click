<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_merge(
        [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.1.35:3000',
            'https://wedinclick.com',
            'https://www.wedinclick.com',
            'http://wedinclick.com',
            'http://www.wedinclick.com',
        ],
        explode(',', env('FRONTEND_URL', ''))
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
