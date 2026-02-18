<?php

namespace App\Http\Middleware;

use App\Helpers\InstitutionHelper;
use App\Http\Controllers\ApiController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireInstitution
{
    private const SKIP_ACTIONS = [
        'createInstApi', 'addDatakinderApi', 'viewAllInstitutions', 'EditInstApi',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        if ($request->user()->access_type !== 'DATAKINDER') {
            return $next($request);
        }

        if ($request->routeIs('set-inst') || $request->routeIs('logout') || $request->routeIs('profile.*') || $request->is('set-inst-api*')) {
            return $next($request);
        }

        $action = $request->route()?->getActionName();
        if ($action && str_contains($action, ApiController::class.'@')) {
            $method = \Illuminate\Support\Str::after($action, '@');
            if (in_array($method, self::SKIP_ACTIONS, true)) {
                return $next($request);
            }
        }

        [$inst, $instErr] = InstitutionHelper::GetInstitution($request);
        if ($inst !== null && $inst !== '') {
            $request->attributes->set('inst_id', $inst);

            return $next($request);
        }

        $message = InstitutionHelper::SET_INST_REQUIRED_MESSAGE;
        if ($request->expectsJson()) {
            return response()->json(['error' => $message], 401);
        }

        return redirect()->route('set-inst', ['message' => $message]);
    }
}
