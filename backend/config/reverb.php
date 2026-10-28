<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Reverb Server
    |--------------------------------------------------------------------------
    |
    | This option controls the default server connection that will be used by
    | Reverb when broadcasting messages or managing active connections.
    |
    */

    'default' => env('REVERB_SERVER', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Reverb Servers
    |--------------------------------------------------------------------------
    |
    | Here you may define the configuration for each of your Reverb servers.
    | A server definition includes connection credentials, server host details
    | and options, and the list of applications it supports.
    |
    */

    'servers' => [

        'reverb' => [
            'host' => env('REVERB_SERVER_HOST', '0.0.0.0'),
            'port' => env('REVERB_SERVER_PORT', 8080),
            'hostname' => env('REVERB_HOST'),
            'options' => [
                'tls' => [],
            ],
            'max_request_size' => 10_000,
            'pulse_ingest_interval' => env('REVERB_PULSE_INGEST_INTERVAL', 15),
            'telescope_ingest_interval' => env('REVERB_TELESCOPE_INGEST_INTERVAL', 15),
            'scaling' => [
                'enabled' => env('REVERB_SCALING_ENABLED', false),
                'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
                'server' => [
                    'host' => env('REDIS_HOST', '127.0.0.1'),
                    'port' => env('REDIS_PORT', 6379),
                    'password' => env('REDIS_PASSWORD'),
                    'database' => env('REDIS_DB', 0),
                ],
            ],
            'pulse' => [
                'enabled' => env('REVERB_PULSE_ENABLED', true),
            ],
            'apps' => [
                [
                    'key' => env('REVERB_APP_KEY'),
                    'secret' => env('REVERB_APP_SECRET'),
                    'app_id' => env('REVERB_APP_ID'),
                    'options' => [
                        'host' => env('REVERB_HOST'),
                        'port' => env('REVERB_PORT'),
                        'scheme' => env('REVERB_SCHEME', 'http'),
                        'useTLS' => env('REVERB_SCHEME', 'http') === 'https',
                    ],
                    'allowed_origins' => ['*'],
                    'ping_interval' => env('REVERB_APP_PING_INTERVAL', 30),
                    'max_connections' => env('REVERB_APP_MAX_CONNECTIONS', 10000),
                ],
            ],
        ],

    ],

];
