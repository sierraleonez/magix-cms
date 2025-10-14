<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\CourseInvitation;
use App\Models\CourseMember;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Http\Request;

class CourseMemberController extends Controller
{
    public function storeByInvitation(Request $request, string $invitation_id) {
        // 1. Store organization member
        $course_invitation = CourseInvitation::find($invitation_id);
        $course_invitation->load('course');

        $organization_id = $course_invitation->course->organization_id;
        $user_id = $course_invitation->user_id;
        $organization_member = OrganizationMember::create([
            'user_id' => $user_id,
            'organization_id' => $organization_id,
            'organization_role_id' => 5,
        ]);

        $organization_member = $organization_member->fresh();

        // 2. Store course member
        $organization_member_id = $organization_member->id;
        $course_id = $course_invitation->course_id;
        CourseMember::create([
            'organization_member_id' => $organization_member_id,
            'course_id' => $course_id,
            'user_id' => $user_id
        ]);

        $course_invitation->delete();

        return redirect()->back()->with('success', 'member created');
    }

    public function store(Request $request, string $organization_id, string $course_id)
    {
        // 1. validate request
        $request->validate([
            'organization_member_id' => 'integer|required'
        ]);

        $user = $request->user();
        $user_id = $user->id;

        $organization_member_id = $request->organization_member_id;

        // 2. check is added member is member of community
        $new_member = OrganizationMember::find($organization_member_id);
        $new_member_organization_id = $new_member->organization_id;
        // 4. if no, throw error
        if ($new_member_organization_id != $organization_id) {
            return redirect()->back()->withErrors(['general' => 'Member not part of the organization']);
        }

        $is_already_join_course = CourseMember::where('organization_member_id', $organization_member_id)->where('course_id', $course_id)->first();
        if ($is_already_join_course) {
            return redirect()->back()->withErrors(['general' => 'Already join the course']);
        }

        // 3. if yes, add to course_member
        CourseMember::create([
            'organization_member_id' => $organization_member_id,
            'course_id' => $course_id,
            'user_id' => $user_id
        ]);

        return redirect()->back();
    }

    public function storeByEmail(Request $request, string $organization_id, string $course_id)
    {
        $request->validate([
            'email' => 'string|email|required'
        ]);

        $email = $request->email;

        $user = User::where('email', $email)->first();

        if (!$user) {
            return redirect()->back()->withErrors(['User not found.']);
        }

        $user_id = $user->id;

        CourseInvitation::create([
            'user_id' => $user_id,
            'course_id' => $course_id
        ]);

        return redirect()->back()->with('success', 'Invitation sent');
        // 1. send invitation to email
        // 1. create course_invitations table
        // 2. create course_invitation controller
        // 3. add course_invitation (course_id, target_user_id)

        // 1. Create ui for student
        // 2. Add notification panel for course invitation
        // 3. If clicked, redirect to course detail page


        // 2. show dialog join organization confirmation
        // 3. show course detail page with join button
        // 4. If paid course, redirect to subscribe page
        // For teacher / organization admin view
        // 1. add paid / free tag to course table
        // 2. add course subscription price column to course table
        // 3. create course_subscription table
        // Attributes: course_member_id, course_id, paid_at, expired_at
        // 4. create course_subscription controller

        // For Student
        // 1. create course_subscription_payment table
        // 2. after user submit payment: 
        // 1. user will added to course_member
        // 2. course_subscription will created

        // 5. 
    }
}
