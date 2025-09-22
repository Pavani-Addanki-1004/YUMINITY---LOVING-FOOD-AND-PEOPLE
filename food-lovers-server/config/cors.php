<?php

return [

    // Apply CORS to all routes so frontend at http://localhost can call
    // our Laravel endpoints at http://localhost:8000 without preflight failures.
    // This fixes issues like profile update failing for /updateUser.
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
