<?php

namespace App\Http\Controllers\Course;

use App\Enum\CourseMaterialType;
use App\Http\Controllers\Controller;
use App\Models\CourseMaterial;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class CourseMaterialController extends Controller
{
    public function show(Request $request, string $organization_id, string $course_id, string $course_topic_id, string $course_material_id)
    {
        // 1. find course material with course_material_id
        $course_material = CourseMaterial::find($course_material_id);

        if (!$course_material) {
            return Inertia::render('404');
        }
        // 2. render the ui

        return Inertia::render('course-material/show', [
            'course_material' => $course_material
        ]);
    }

    public function create(Request $request, string $organization_id, string $course_id, string $course_topic_id)
    {
        return Inertia::render('course-material/create', [
            'organization_id' => $organization_id,
            'course_id' => $course_id,
            'course_topic_id' => $course_topic_id
        ]);
    }

    public function store(Request $request, string $organization_id, string $course_id, string $course_topic_id)
    {
        // 1. Validate the request
        $request->validate([
            'title' => 'string|required',
            'description' => 'string|required',
            'content' => 'array|required',
            'order' => 'integer',
            'type' => [Rule::enum(CourseMaterialType::class)]
        ]);

        // 2. Get member id from request
        $member_id = $request->organization_member->id;

        $order = $request->order;
        if (!$order) {
            $materials = CourseMaterial::where('course_topic_id', $course_topic_id)
                ->orderByDesc('order')
                ->first();
            if ($materials) {
                $order = $materials->order + 1;
            } else {
                $order = 1;
            }
        }

        // 3. if order is included in request, use it
        // if not check for other course material in the same topic for the last order
        // 4. Create entity
        $course_material = CourseMaterial::create([
            'course_topic_id' => $course_topic_id,
            'title' => $request->title,
            'description' => $request->description,
            'order' => $order,
            'content' => $request->content,
            'created_by' => $member_id
        ]);

        return redirect(route('showCourseMaterial', [
            'id' => $organization_id,
            'course_id' => $course_id,
            'course_topic_id' => $course_topic_id,
            'course_material_id' => $course_material->id,
        ]));
    }

    public function storeWithoutRedirect(Request $request, string $organization_id, string $course_id, string $course_topic_id)
    {
        $request->validate([
            'title' => 'string|required',
            'description' => 'string|required',
            'content' => 'array|required',
            'order' => 'integer',
            'type' => 'string|required'
        ]);

        // 2. Get member id from request
        $member_id = $request->organization_member->id;

        $order = $request->order;
        if (!$order) {
            $materials = CourseMaterial::where('course_topic_id', $course_topic_id)
                ->orderByDesc('order')
                ->first();
            if ($materials) {
                $order = $materials->order + 1;
            } else {
                $order = 1;
            }
        }

        // 3. if order is included in request, use it
        // if not check for other course material in the same topic for the last order
        // 4. Create entity
        $course_material = CourseMaterial::create([
            'course_topic_id' => $course_topic_id,
            'title' => $request->title,
            'description' => $request->description,
            'order' => $order,
            'content' => $request->content,
            'created_by' => $member_id,
            'type' => $request->type
        ]);

        return response()->json($course_material);
    }

    public function edit(Request $request, string $organization_id, string $course_id, string $course_topic_id, string $course_material_id)
    {
        $course_material = CourseMaterial::find(2);

        if (!$course_material) {
            return Inertia::render('404');
        }

        return Inertia::render('course-material/edit', [
            'course_material' => $course_material,
            'organization_id' => $organization_id,
            'course_id' => $course_id,
            'course_topic_id' => $course_topic_id,
            'course_material_id' => $course_material->id,
        ]);
    }

    public function update(Request $request, string $organization_id, string $course_id, string $course_topic_id, string $course_material_id)
    {
        $request->validate([
            'title' => 'string|required',
            'description' => 'string|required',
            'content' => 'array|required',
            'order' => 'integer',
        ]);

        // 1. find couse material by id
        $course_material = CourseMaterial::find($course_material_id);

        if (!$course_material) {
            return Inertia::render('404');
        }

        $course_material->update([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'course material updated');
        // return redirect(route('showCourseMaterial', [
        //     'id' => $organization_id,
        //     'course_id' => $course_id,
        //     'course_topic_id' => $course_topic_id,
        //     'course_material_id' => $course_material_id,
        // ]));
    }

    public function destroy(Request $request, string $organization_id, string $course_id, string $course_topic_id, string $course_material_id)
    {
        $course_material = CourseMaterial::find($course_material_id);

        if (!$course_material) {
            return Inertia::render('404');
        }

        $course_material->delete();

        return redirect()->back()->with('success', 'item deleted');
    }

    public function showStudentCourseQuiz(Request $request, string $course_material_id) {
        $course_material = CourseMaterial::find($course_material_id);

        $course_material->load('courseQuiz');
        
        return Inertia::render('course/student/quiz', [
            'course_material' => $course_material
        ]);
    }
}
