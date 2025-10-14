<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class OrganizationMemberController extends Controller
{
    public function list(Request $request, string $organization_id)
    {
        $organization_members = OrganizationMember::where('organization_id', $organization_id)
            ->get();
        return response()->json([
            'data' => $organization_members,
        ]);
    }

    public function storeByEmail(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'email' => 'string|required',
            'organization_id' => 'integer|required',
            'organization_role_id' => 'integer|required'
        ]);

        $member_email = $request->email;
        $member_user = User::firstWhere('email', $member_email);
        if (!$member_user) {
            return redirect()->back()->withErrors(['email' => 'User with this email not found.']);
        }

        $member_user_id = $member_user->id;
        $organization_id = $request->organization_id;
        $organization_role_id = $request->organization_role_id;

        $is_already_member = OrganizationMember::where('user_id', $member_user_id)
            ->where('organization_id', $organization_id)
            ->first();

        if ($is_already_member) {
            return redirect()->back()->withErrors(['email' => 'User with this email already enlisted.']);
        }

        $currentUserRoleId = OrganizationMember::where('user_id', $user->id)
            ->where('organization_id', $organization_id)
            ->first()
            ->organization_role_id;

        if ($currentUserRoleId != config('constants.OWNER_ROLE_ID')) {
            return redirect()->back()->withErrors(['email' => 'You are now allowed for this action.']);
        }

        OrganizationMember::create([
            'user_id' => $member_user_id,
            'organization_id' => $organization_id,
            'organization_role_id' => $organization_role_id
        ]);

        return redirect(route('showOrganization', ["id" => $organization_id]));
    }

    public function destroy(Request $request, string $organization_id, string $member_id)
    {
        // dd($member_id);
        $member = OrganizationMember::find($member_id);
        if (!$member) {
            return redirect()->back()->withErrors(['member_id' => 'User not found']);
        }

        $member->delete();

        return redirect()->back();
    }
}
