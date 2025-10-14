<?php

use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\CourseInvitationController;
use App\Http\Controllers\Course\CourseMaterialController;
use App\Http\Controllers\Course\CourseMemberController;
use App\Http\Controllers\Course\CourseQuizController;
use App\Http\Controllers\Course\CourseSubscriptionPaymentController;
use App\Http\Controllers\Course\CourseTopicController;
use App\Http\Controllers\CourseProgressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Organization\OrganizationController;
use App\Http\Controllers\Organization\OrganizationMemberController;
use App\Http\Controllers\YouTubeController;
use App\Http\Middleware\CheckOrganizationRole;
use App\Models\CourseMember;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::prefix('/youtube')->group(function () {
    // Route to show the upload form
    Route::get('/upload', [YouTubeController::class, 'showUploadForm'])->name('youtube.upload_form');

    // Route to initiate the connection with Google
    Route::get('/connect', [YouTubeController::class, 'connect'])->name('youtube.connect');

    // The callback route that Google redirects to
    Route::get('/callback', [YouTubeController::class, 'callback'])->name('youtube.callback');

    // Route to handle the actual video upload
    Route::post('/upload', [YouTubeController::class, 'upload'])->name('youtube.upload');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('course')->group(function() {
        Route::get('/', [CourseController::class, 'listByUser'])
            ->name('listStudentCourse');
        Route::get('/{course_id}', [CourseController::class, 'showStudentCourse'])
            ->name('showStudentCourse');
        Route::get('/{course_id}/content', [CourseController::class, 'showStudentCourseContent'])
            ->name('showStudentCourseContent');
        Route::get('/content/${course_material_id}', [CourseController::class, 'showStudentCourseContentWithMaterialId'])
            ->name('redirectToStudentCourseContent');
    });

    Route::prefix('course-progress')->group(function() {
        Route::post('/{course_material_id}', [CourseProgressController::class, 'store'])
            ->name('storeCourseProgress');
        Route::post('/finished/{course_progress_id}', [CourseProgressController::class, 'storeFinishedCourse'])
            ->name('storeFinishedCourseProgress');
    });

    Route::prefix('course-quiz')->group(function() {
        Route::get('/{course_material_id}', [CourseMaterialController::class, 'showStudentCourseQuiz'])
            ->name('showStudentCourseQuiz');
        Route::post('/{course_material_id}/check-answer', [CourseQuizController::class, 'checkQuizAnswer'])
            ->name('checkQuizAnswer');
    });

    Route::prefix('invitation')->group(function () {
        Route::get('/', [CourseInvitationController::class, 'list'])
            ->name('listInvitation');
        Route::get('/{id}', [CourseInvitationController::class, 'show'])
            ->name('showInvitation');
        Route::post('/{id}', [CourseMemberController::class, 'storeByInvitation'])
            ->name('acceptInvitation');
    });

    Route::prefix('course-subscription-payment')->group(function() {
        Route::get('{course_id}', [CourseSubscriptionPaymentController::class, 'showPaymentPage'])
            ->name('showPaymentPage');
        Route::post('{course_id}/store', [CourseSubscriptionPaymentController::class, 'store'])
            ->name('storeSubscriptionPayment');
    });

    Route::prefix('organization')->group(function () {
        Route::get('/', [OrganizationController::class, 'list'])
            ->name('listOrganization');

        Route::get('create', [OrganizationController::class, 'create'])
            ->name('createOrganization');
        Route::post('create', [OrganizationController::class, 'store'])
            ->name('storeOrganization');

        Route::get('/{id}', [OrganizationController::class, 'listMember'])
            ->name('showOrganization');
        Route::get('{id}/update', [OrganizationController::class, 'renderUpdate'])
            ->name('renderUpdateOrganization');

        Route::middleware([CheckOrganizationRole::class])->group(function () {
            Route::patch('{id}', [OrganizationController::class, 'storeUpdate'])
                ->name('storeOrganizationUpdate');
            Route::delete('{id}', [OrganizationController::class, 'destroy'])
                ->name('deleteOrganization');

            Route::get('{id}/member', [OrganizationMemberController::class, 'list'])
                ->name('listOrganizationMember');
            Route::post('{id}/member', [OrganizationMemberController::class, 'storeByEmail'])
                ->name('storeOrganizationMember');
            Route::delete('{id}/member/{member_id}', [OrganizationMemberController::class, 'destroy'])
                ->name('deleteOrganizationMember');

            Route::prefix('{id}/course')->group(function () {
                Route::get('/', [CourseController::class, 'list'])
                    ->name('listOrganizationCourse');
                Route::get('/create', [CourseController::class, 'create'])
                    ->name('createOrganizationCourse');
                Route::get('{course_id}/editor', [CourseController::class, 'showAllTopicAndMaterial'])
                    ->name('courseContentEditor');
                Route::get('/{course_id}', [CourseController::class, 'show'])
                    ->name('showOrganizationCourse');
                Route::post('/create', [CourseController::class, 'store'])
                    ->name('storeOrganizationCourse');
                Route::delete('{course_id}', [CourseController::class, 'destroy'])
                    ->name('deleteOrganizationCourse');

                /**
                 * Course Topic
                 */
                Route::prefix('{course_id}/course-topic')->group(function () {
                    Route::get('{course_topic_id}', [CourseTopicController::class, 'show'])
                        ->name('showCourseTopic');

                    Route::post('/', [CourseTopicController::class, 'store'])
                        ->name('storeCourseTopic');

                    /**
                     * Course Material
                     */
                    Route::prefix('{course_topic_id}/course-material')->group(function () {
                        Route::get('/create', [CourseMaterialController::class, 'create'])
                            ->name('createCourseMaterial');
                        Route::post('/', [CourseMaterialController::class, 'store'])
                            ->name('storeCourseMaterial');
                        Route::post('/store', [CourseMaterialController::class, 'storeWithoutRedirect'])
                            ->name('storeCourseMaterialWithoutRedirect');
                        Route::get('{course_material_id}', [CourseMaterialController::class, 'show'])
                            ->name('showCourseMaterial');
                        Route::get('{course_material_id}/edit', [CourseMaterialController::class, 'edit'])
                            ->name('editCourseMaterial');
                        Route::patch('{course_material_id}', [CourseMaterialController::class, 'update'])
                            ->name('storeCourseMaterialUpdate');
                        Route::delete('{course_material_id}', [CourseMaterialController::class, 'destroy'])
                            ->name('deleteCourseMaterial');

                        Route::prefix('{course_material_id}/quiz')->group(function () {
                            Route::post('/', [CourseQuizController::class, 'store'])
                                ->name('storeCourseQuiz');
                            Route::patch('/{quiz_id}', [CourseQuizController::class, 'update'])
                                ->name('updateCourseQuiz');
                        });
                    });
                });

                /**
                 * Course Member
                 */
                Route::prefix('{course_id}/course-member')->group(function () {
                    Route::post('/', [CourseMemberController::class, 'store'])
                        ->name('storeCourseMember');
                    Route::post('/store-by-email', [CourseMemberController::class, 'storeByEmail'])
                        ->name('storeCourseMemberByEmail');
                });
            });
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
