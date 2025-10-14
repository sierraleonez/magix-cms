<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\CourseInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseInvitationController extends Controller
{
    public function list(Request $request)
    {
        $user = $request->user();
        $user_id = $user->id;

        $course_invitations = CourseInvitation::where('user_id', $user_id)->with('course')->get();
        return Inertia::render('invitation/index', [
            'course_invitations' => $course_invitations,
        ]);
    }

    public function show(Request $request, string $invitation_id) {
        $course_invitation = CourseInvitation::find($invitation_id);

        $course = $course_invitation->load('course');

        return Inertia::render('invitation/show', [
            'course_invitation' => $course_invitation
        ]);
    }
}
