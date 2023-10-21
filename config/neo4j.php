<?php

return [
  'default' => 'neo4j',

  'connections' => [
    'neo4j' => [
      'host' => env('NEO4J_HOST', '127.0.0.1'),
      'port' => env('NEO4J_PORT', 7687),
      'username' => env('NEO4J_USERNAME', 'neo4j'),
      'password' => env('NEO4J_PASSWORD', 'your_password'),
    ],
  ],
];
