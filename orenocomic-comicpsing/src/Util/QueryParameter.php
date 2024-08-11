<?php

namespace App\Util;

use Symfony\Component\HttpFoundation\ServerBag;

class QueryParameter
{
    private array $parameter = [];

    public function __construct(ServerBag $server)
    {
        foreach (\explode('&', $server->get('QUERY_STRING')) as $val) {
            if (!$val) continue;

            $query = \explode('=', $val, 2);
            if (!isset($this->parameter[$query[0]])) {
                $this->parameter[$query[0]] = [];
            }
            $this->parameter[$query[0]][] = \urldecode($query[1]);
        }
    }

    public function all(string $key): array
    {
        if (!isset($this->parameter[$key])) {
            return [];
        }

        return $this->parameter[$key];
    }
}
