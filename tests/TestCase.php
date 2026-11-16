<?php

namespace Tests;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function currentTeam(User $user): Team
    {
        return $user->currentTeam ?? throw new \RuntimeException('User has no current team.');
    }
}
