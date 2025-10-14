<?php

namespace App\Http\Controllers;

use App\Models\CourseMaterial;
use App\Models\CourseMember;
use App\Models\CourseProgress;
use Illuminate\Http\Request;

class CourseProgressController extends Controller
{
    public function store(Request $request, string $course_material_id)
    {
        $request->validate([
            'is_finished' => 'boolean|required'
        ]);

        $user = $request->user();

        $course_material = CourseMaterial::find($course_material_id);

        $courseTopic = $course_material->courseTopic;
        $course = $courseTopic->course;

        $course_id = $course->id;

        $course_membership = CourseMember::where([
            "course_id" => $course_id,
            "user_id" => $user->id,
        ])->first();

        if (!$course_membership) {
            return redirect()->back()->withErrors(['course_member', 'not found']);
        }

        if (!$course_material) {
            return redirect()->back()->withErrors(['course_material', 'not found']);
        }

        $course_progress = CourseProgress::create([
            'course_material_id' => $course_material_id,
            'course_member_id' => $course_membership->id,
            'is_finished' => $request->is_finished
        ]);

        $course_progress->fresh();

        return redirect()->back()->with('success', $course_progress);
    }

    public function storeFinishedCourse(Request $request, string $course_progress_id) {
        $course_progress = CourseProgress::find($course_progress_id);

        $course_progress->is_finished = true;

        $course_progress->save();

        return redirect()->back();
    }
}
