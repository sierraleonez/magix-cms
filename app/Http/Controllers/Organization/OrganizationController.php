<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function list(Request $request): Response
    {
        $user = $request->user();
        $userOrganizationMembership = User::with('organizationMembers.organization', 'organizationMembers.role')->find($user->id);

        $organizations = $userOrganizationMembership->organizationMembers->map(function($member) {
            $role_name = $member->role->role_name;
            $newVal = $member->organization;
            $newVal['role'] = $role_name;
            return $newVal;
        });

        return Inertia::render('organization/index', [
            'organizations' => $organizations
        ]);
    }

    public function listMember(Request $request, string $id)
    {
        $organization = Organization::find($id);
        $members = $organization->members->load(['role', 'user']);

        $user = $request->user();
        $member_user = $members->where('user_id', $user->id)->first();

        if (!$member_user) {
            return redirect()->back()->withErrors(['general' => 'You are not member of this organization']);
        }

        $user_role = $member_user->role_name;

        return Inertia::render(
            'organization/show',
            [
                'members' => $members,
                'organization' => $organization,
                'role' => $user_role
            ]
        );
    }

    public function create(Request $request): Response
    {
        return Inertia::render('organization/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $owner_role_id = config('constants.OWNER_ROLE_ID');

        $request->validate([
            'organization_name' => 'required',
            'description' => 'required',
            'is_public' => 'required'
        ]);

        $organization = Organization::create([
            'organization_name' => $request->organization_name,
            'description' => $request->description,
            'is_public' => $request->is_public
        ]);

        OrganizationMember::create([
            'user_id' => $user->id,
            'organization_id' => $organization->id,
            'organization_role_id' => $owner_role_id
        ]);


        return redirect(route('listOrganization'));
    }

    public function renderUpdate(Request $request, string $id): Response
    {
        $organization = Organization::findOrFail($id);
        return Inertia::render('organization/update', [
            'organization' => $organization
        ]);
    }

    public function storeUpdate(Request $request, string $id): RedirectResponse
    {
        $request->validate(([
            'organization_name' => 'required',
            'description' => 'required',
            'is_public' => 'required'
        ]));

        $org = Organization::find($id);
        $org->update($request->all());

        return redirect(route('listOrganization'));
    }



    public function destroy(Request $request, string $id)
    {
        $org = Organization::find($id);
        $org->delete();

        return redirect(route('listOrganization'));
    }
}
