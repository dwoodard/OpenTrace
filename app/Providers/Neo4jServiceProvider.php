<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Bolt\Bolt;

class Neo4jServiceProvider extends ServiceProvider
{
  public function register()
  {
    $this->app->singleton('neo4j', function () {
      $config = config('neo4j.connections.neo4j');

      return new Bolt(
        new \Bolt\connection\StreamSocket($config['host'], $config['port'], true),
        $config['username'],
        $config['password']
      );
    });
  }
}
