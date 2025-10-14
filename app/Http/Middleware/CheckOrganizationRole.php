<?php

namespace App\Http\Middleware;

use App\Models\OrganizationMember;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckOrganizationRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $organization_id = $request->route('id');
        $user = $request->user();
        $user_id = $user->id;

        $member = OrganizationMember::where('user_id', $user_id)
            ->where('organization_id', (int)$organization_id)
            ->first();

        $organization_role_id =  $member->organization_role_id;
        if ($organization_role_id === 1 || $organization_role_id === 3) {
            $request->merge(['organization_member' => $member]);
            
            return $next($request);
        }

        return redirect()->back()->withErrors(['email' => 'You are now allowed for this action.']);

    }
}
