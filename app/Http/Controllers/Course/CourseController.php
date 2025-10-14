<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\CourseMember;
use App\Models\CourseProgress;
use App\Models\CourseSubscription;
use App\Models\OrganizationMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function listByUser(Request $request)
    {
        $user = $request->user();
        $user_id = $user->id;

        $results = OrganizationMember::from('organization_members as om')
            ->join('courses as c', 'om.organization_id', '=', 'c.organization_id')
            ->where('om.user_id', $user_id)
            ->select('c.*', 'om.organization_role_id', 'c.name as course_name')
            ->get();

        return Inertia::render('course/student/list', [
            'courses' => $results
        ]);
    }

    public function showStudentCourse(Request $request, string $course_id)
    {
        $course = Course::find($course_id)->load(['course_materials']);
        $course_material_count = $course->course_materials->count();

        $user = $request->user();
        $user_id = $user->id;

        $organization_member = OrganizationMember::where([
            'user_id' => $user_id,
            'organization_id' => $course->organization_id
        ])
            ->first();

        $organization_member_id = $organization_member->id;

        $course_subscription = CourseSubscription::where([
            'course_id' => $course_id,
            'organization_member_id' => $organization_member_id
        ])
            ->first();

        $course_member = CourseMember::where([
            'course_id' => $course_id,
            'organization_member_id' => $organization_member_id
        ])->first();
        $course_member_id = $course_member->id;

        $finishedCount = CourseProgress::where('course_member_id', $course_member_id)
            ->where('is_finished', true)
            // Ensure the progress record belongs to a material within the target course.
            ->whereHas('course_material.courseTopic', function ($query) use ($course_id) {
                $query->where('course_id', $course_id);
            })
            ->count();

        return Inertia::render('course/student/show', [
            'course' => $course,
            'course_subscription' => $course_subscription,
            'progress' => [
                'finished_material_count' => $finishedCount,
                'total_material_count' => $course_material_count
            ]
        ]);
    }

    public function showStudentCourseContent(Request $request, string $course_id)
    {
        $user = $request->user();
        $user_id = $user->id;

        $course_membership = CourseMember::where([
            'course_id' => $course_id,
            'user_id' => $user_id
        ])->first();
        $course_member_id = $course_membership->id;

        $course = Course::find($course_id)->load([
            'course_topics.course_materials.courseQuiz',
            'course_topics.course_materials.progress' => function ($query) use ($course_member_id) {
                $query->where('course_member_id', $course_member_id);
            }
        ]);

        $course_content = $course->course_topics;

        return Inertia::render('course/student/course-material', [
            'course_content' => $course_content,
        ]);
    }

    public function showStudentCourseContentWithMaterialId(Request $request, string $course_material_id)
    {
        $course_material = CourseMaterial::find($course_material_id)->load('courseTopic');
        $course_id = $course_material->courseTopic->course_id;

        return redirect()->route('showStudentCourseContent', ['course_id' => $course_id]);
    }

    public function list(Request $request, string $organization_id)
    {
        $organization_member_id = $request->organization_member->id;

        $courses = Course::whereHas('course_members', function ($query) use ($organization_member_id) {
            $query->where('organization_member_id', $organization_member_id);
        })->get();
        return Inertia::render('course/index', ['courses' => $courses]);
    }


    public function showAllTopicAndMaterial(Request $request, string $organization_id, string $course_id)
    {
        $course = Course::find($course_id)->load(['course_topics.course_materials.courseQuiz']);

        $course_topics_with_materials = $course->course_topics;

        return Inertia::render('course/topic-material-editor', [
            'course_topics_with_materials' => $course_topics_with_materials
        ]);
    }

    public function show(Request $request, string $organization_id, string $course_id)
    {
        $course = Course::find($course_id)->load(['course_topics']);
        $course_topics = $course->course_topics;
        $course_members = $course->course_members->load(['detail']);

        if (!$course) {
            return redirect()->back()->withErrors(['general' => 'Course not found']);
        }

        return Inertia::render('course/show', [
            'course' => $course,
            'course_topics' => $course_topics,
            'course_members' => $course_members
        ]);
    }

    public function create(Request $request)
    {
        // dd($request->organization_member);
        return Inertia::render('course/create');
    }

    public function store(Request $request, string $organization_id)
    {
        $request->validate([
            'name' => 'string|required',
            'description' => 'string|required',
            'tags' => 'string|required',
            'is_paid' => 'boolean|required',
            'subscription_price' => [
                'required',
                'numeric',
                // Rule #1: When 'is_paid' is TRUE, price must be greater than 0
                Rule::when($request->boolean('is_paid'), [
                    'gt:0'
                ]),
                // Rule #2: When 'is_paid' is FALSE, price must be exactly 0
                Rule::when(!$request->boolean('is_paid'), [
                    'in:0'
                ]),
            ],
        ]);

        $member = $request->organization_member;
        $member_id = $member->id;
        $user = $request->user();
        $user_id = $user->id;

        $course = Course::create([
            'name' => $request->name,
            'description' => $request->description,
            'tags' => $request->tags,
            'organization_id' => $organization_id,
            'created_by' => $member_id,
            'is_paid' => $request->is_paid,
            'subscription_price' => $request->subscription_price
        ]);

        CourseMember::create([
            'organization_member_id' => $member_id,
            'course_id' => $course->id,
            'user_id' => $user_id
        ]);

        return redirect(route('listOrganizationCourse', ['id' => $organization_id]));
    }

    public function edit() {}

    public function storeUpdate() {}

    public function destroy(Request $request, string $organization_id, string $course_id)
    {
        $course = Course::find($course_id);
        $course->delete();

        return redirect(route('listOrganizationCourse', ['id' => $organization_id]));
    }
}
