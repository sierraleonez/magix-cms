<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseInvitation;
use App\Models\CourseMember;
use App\Models\CourseSubscription;
use App\Models\CourseSubscriptionPayment;
use App\Models\OrganizationMember;
use DateTime;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseSubscriptionPaymentController extends Controller
{
    public function showPaymentPage(Request $request, string $course_id)
    {
        $request->validate([
            'invitation' => 'required|numeric'
        ]);
        $invitation_id = $request->invitation;

        $course = Course::find($course_id);
        if (!$course) {
            return Inertia::render('404');
        }

        $user = $request->user();
        $user_id = $user->id;
        $organization_id = $course->organization_id;

        $organization_member = OrganizationMember::where('organization_id', $organization_id)
            ->where('user_id', $user_id)
            ->first();

        if ($organization_member) {
            $course_member = CourseMember::where([
                'course_id' => $course_id,
                'organization_member_id' => $organization_member->id,
            ])->get();

            if ($course_member) {
                return redirect()->route('listInvitation');
            }
        }

        return Inertia::render('course-subscription-payment/index', [
            'course' => $course,
            'invitation_id' => $invitation_id
        ]);
    }

    public function store(Request $request, string $course_id)
    {
        $request->validate([
            'amount_payment' => 'numeric|required',
            'payment_method' => 'string|required',
            'invitation_id' => 'numeric|required'
        ]);
        $course = Course::find($course_id);
        if (!$course) {
            return Inertia::render('404');
        }

        $user = $request->user();
        $user_id = $user->id;

        // Check if payment amount matched
        $subscription_price = $course->subscription_price;
        $payment_amount = $request->amount_payment;
        $payment_method = $request->payment_method;

        $organization_id = $course->organization_id;

        if ($subscription_price != $payment_amount) {
            return redirect()->back()->withErrors([
                'amount_payment' => 'Amount payment not matched with subcsription price'
            ]);
        }

        $subscription_payment = CourseSubscriptionPayment::create([
            'course_id' => $course_id,
            'user_id' => $user_id,
            'amount_payment' => $payment_amount,
            'payment_method' => $payment_method,
            'payment_status' => 'success'
        ]);

        $subscription_payment = $subscription_payment->fresh();

        $organization_member = OrganizationMember::where([
            'user_id' => $user_id,
            'organization_id' => $organization_id
        ])
            ->first();
        if (!$organization_member) {
            $organization_member = OrganizationMember::create([
                'user_id' => $user_id,
                'organization_id' => $organization_id,
                'organization_role_id' => 5
            ]);
    
            $organization_member->fresh();
        }

        $expiry_date = new DateTime();
        $expiry_date->modify('+1 month');

        $subscription = CourseSubscription::create([
            'payment_id' => $subscription_payment->id,
            'expired_at' => $expiry_date,
            'course_id' => $course_id,
            'organization_member_id' => $organization_member->id
        ]);

        $course_member = CourseMember::create([
            'organization_member_id' => $organization_member->id,
            'course_id' => $course_id,
            'user_id' => $user_id
        ]);

        $invitation_id = $request->invitation_id;
        $course_invitation = CourseInvitation::find($invitation_id);
        $course_invitation->delete();

        return redirect()->back()->with('success', 'course joined');
    }
}
