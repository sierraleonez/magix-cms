<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\CourseMaterial;
use App\Models\CourseTopic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseTopicController extends Controller
{
    public function show(Request $request, string $organization_id, string $course_id, string $course_topic_id) {
        $course_topic = CourseTopic::find($course_topic_id);
        if (!$course_topic) {
            return Inertia::render('404');
        }
        $course_materials = $course_topic->course_materials;
        return Inertia::render('course-topic/index', [
            'course_materials' => $course_materials,
            'course_topic' => $course_topic,
            'organization_id' => $organization_id
        ]);
    }

    public function store(Request $request, string $organization_id, string $course_id) {
        // 1. Validate request
        $request->validate([
            'name' => 'string|required',
            'description' => 'string|required'
        ]);

        $member = $request->organization_member;
        $member_id = $member->id;
        // 2. Create course topic instance
        CourseTopic::create([
            'course_id' => $course_id,
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $member_id
        ]);

        return redirect(route('showOrganizationCourse', ['id' => $organization_id, 'course_id' => $course_id]));
    }
}
