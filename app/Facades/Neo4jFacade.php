<?php

// app/Facades/Neo4jFacade.php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;
use Laudis\Neo4j\ClientInterface; // Import the Neo4j client interface

class Neo4jFacade extends Facade
{
  protected static function getFacadeAccessor()
  {
    // Return the name of the binding in the service container
    return 'Neo4j';
  }
}
