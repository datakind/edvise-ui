<?php

namespace App\Http\Middleware;

use App\Helpers\InstitutionHelper;
use App\Http\Controllers\ApiController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireInstitution
{
    /** ApiController methods that do not require a current institution. */
    private const SKIP_ACTIONS = [
        'createInstApi',
        'addDatakinderApi',
        'viewAllInstitutions',
        'EditInstApi',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $action = $request->route()?->getActionName();
        if (! $action || str_contains($action, ApiController::class.'@') !== true) {
            return $next($request);
        }

        $method = \Illuminate\Support\Str::after($action, '@');
        if ($method === '' || in_array($method, self::SKIP_ACTIONS, true)) {
            return $next($request);
        }

        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        if ($inst === null || $inst === '') {
            return response()->json(['error' => $instErr], 401);
        }

        $request->attributes->set('inst_id', $inst);

        return $next($request);
    }
}
