<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;


class Neo4jServiceProvider extends ServiceProvider
{
  public function register()
  {


    // Configure the Neo4j client using the ClientBuilder
    $this->app->singleton('Neo4j', function ($app) {

      // dd("bolt://${_ENV['NEO4J_USERNAME']}:${_ENV['NEO4J_PASSWORD']}@${_ENV['NEO4J_HOST']}");
      // 'bolt://neo4j:password@localhost'
      $client = \Laudis\Neo4j\ClientBuilder::create()
        ->withDriver('default', "bolt://${_ENV['NEO4J_USERNAME']}:${_ENV['NEO4J_PASSWORD']}@${_ENV['NEO4J_HOST']}")
        ->build();
      return $client;
    });
  }

  public function boot()
  {
  }
}
