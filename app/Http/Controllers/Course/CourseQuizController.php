<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\CourseMaterial;
use App\Models\CourseMember;
use App\Models\CourseQuiz;
use App\Models\CourseQuizAttempt;
use Illuminate\Http\Request;

class CourseQuizController extends Controller
{
    public function store(Request $request, string $organization_id, string $course_id, string $course_topic_id, string $course_material_id) {
        // 1. Validate the request
        $request->validate([
            'question' => 'required',
            'answer' => 'required|integer',
            'options' => 'array|required',
            'reason' => 'required',
        ]);
        // 2. Get member id from request
        $member = $request->organization_member;
        $member_id = $member->id;
        // 3. Create course quiz
        CourseQuiz::create([
            'question' => $request->question,
            'answer' => $request->answer,
            'options' => $request->options,
            'reason' => $request->reason,
            'course_material_id' => $course_material_id,
            'created_by' => $member_id
        ]);

        return redirect()->back()->with('success', 'quiz created');
    }

    public function update(Request $request, string $organization_id, string $course_id, string $course_topic_id, string $course_material_id, string $quiz_id)
    {
        // Check if CourseQuiz exists
        $quiz = CourseQuiz::find($quiz_id);
        if (!$quiz) {
            return redirect()->back()->withErrors(['Quiz not found.']);
        }

        // Validate the request
        $request->validate([
            'question' => 'required',
            'answer' => 'required|integer',
            'options' => 'array|required',
            'reason' => 'required',
        ]);

        // Update the quiz
        $quiz->update([
            'question' => $request->question,
            'answer' => $request->answer,
            'options' => $request->options,
            'reason' => $request->reason,
            'course_material_id' => $course_material_id,
        ]);

        return redirect()->back()->with('success', 'quiz updated');
    }

    public function showQuizView(Request $request, string $quiz_id) {
        $quiz = CourseQuiz::find($quiz_id);
        
    }

    public function checkQuizAnswer(Request $request, string $quiz_material_id) {
        // Validate the request
        // Request will have structure as following:
        // [{question_id} => ['option' => string, 'id' => numeric] ]
        $request->validate([
            'answers' => 'required|array',
            'answers.*.option' => 'required|string',
            'answers.*.id' => 'required|integer',
        ]);

        $course_material = CourseMaterial::find($quiz_material_id)->with('courseTopic')->first();
        $course_topic = $course_material->courseTopic;
        $course_id = $course_topic->course_id;

        $user = $request->user();
        $user_id = $user->id;

        $course_membership = CourseMember::where([
            'course_id' => $course_id,
            'user_id' => $user_id
        ])->first();

        // Get all quizzes for the course material
        $course_quizzes = CourseQuiz::where('course_material_id', $quiz_material_id)->get();

        // Check answers
        $results = [];
        $correct_answer_count = 0;
        foreach ($request->answers as $question_id => $answer) {
            $quiz = $course_quizzes->find($question_id);
            if ($quiz) {
                $isCorrect = $quiz->answer === $answer['id'];
                $results[$quiz->id] = [
                    'question_id' => $quiz->id,
                    'correct' => $quiz->answer === $answer['id'],
                ];

                if ($isCorrect) {
                    $correct_answer_count++;
                }

            }
        }
        $quiz_amount = $course_quizzes->count();
        $score = ($correct_answer_count / $quiz_amount) * 100;

        $results['score'] = $score;

        CourseQuizAttempt::create([
            'course_material_id' => $quiz_material_id,
            'course_member_id' => $course_membership->id,
            'score' => $score,
            'attempt' => $results
        ]);


        return back()->with('success', $results);
    }
}
