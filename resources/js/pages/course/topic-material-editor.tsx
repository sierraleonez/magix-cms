import AppLayout from "@/layouts/app-layout";
import { iCourse, iCourseMaterial, iCourseQuiz, iCourseTopic, iCourseTopicsWithMaterials, iCourseTopicWithMaterials, iQuizOption, iQuizOptions } from "@/types";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRoute } from "ziggy-js";
import CourseContentSidebar from "./component/course-content-sidebar";
import EditCourseMaterialForm from "./component/course-content-text-editor";
import useCourseEditor, { CourseEditorCtx } from "@/hooks/use-course-editor";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation";
import { Descendant } from "slate";
import QuizQuestionsSidebar from "./component/quiz-questions-sidebar";
import QuizDescriptionEditor from "./component/quiz-description-editor";
import QuizContentEditor from "./component/quiz-content-editor";

interface iCourseTopicMaterialEditorProps {
    course_topics_with_materials: iCourseTopicsWithMaterials
}

export default function CourseTopicMaterialEditor({ course_topics_with_materials }: iCourseTopicMaterialEditorProps) {
    const [selectedMaterial, setSelectedMaterial] = useState<iCourseMaterial | null>(null)
    const [courseMaterialDeleteDialogState, setCourseMaterialDeleteDialogState] = useState({
        isOpen: false,
        courseMaterialId: 0,
        courseTopicId: 0,
    })
    const router = useRoute()
    const params = router().params
    const organizationId = Number(params?.id)
    const courseId = Number(params?.course_id)

    return (
        <AppLayout>
            <CourseEditorCtx.Provider value={{
                courseId,
                courseTopicsWithMaterials: course_topics_with_materials,
                organizationId,
                selectedMaterial,
                setSelectedMaterial,
                courseMaterialDeleteDialogState,
                setCourseMaterialDeleteDialogState
            }}>
                <div className="flex flex-1 gap-x-2">
                    <CourseContentSidebar />
                    <div className="flex-1 h-full">
                        {selectedMaterial &&
                            (selectedMaterial.type === 'material' ? (
                                <EditCourseMaterialForm
                                    key={selectedMaterial.id}
                                    courseMaterial={selectedMaterial}
                                    organizationId={organizationId}
                                    courseId={courseId}
                                />
                            ) : (
                                <QuizEditor />
                            ))}
                    </div>
                </div>
                <DeleteMaterialConfirmationDialog />
            </CourseEditorCtx.Provider>
        </AppLayout>
    )
}

function DeleteMaterialConfirmationDialog() {
    const { deleteCourseMaterial, courseMaterialDeleteDialogState, setCourseMaterialDeleteDialogState } = useCourseEditor()

    function onCourseMaterialDeleteDialogStateChange(open: boolean) {
        setCourseMaterialDeleteDialogState({
            ...courseMaterialDeleteDialogState,
            isOpen: open
        })
    }
    return (
        <DeleteConfirmationDialog
            title="Are you sure you want to delete this material?"
            description="Once deleted, this course and all related data cannot be recovered"
            isOpen={courseMaterialDeleteDialogState.isOpen}
            onClickDelete={() => { deleteCourseMaterial(courseMaterialDeleteDialogState.courseMaterialId, courseMaterialDeleteDialogState.courseTopicId) }}
            onIsOpenChange={onCourseMaterialDeleteDialogStateChange}
        />
    )
}

interface iQuizEditorProps {

}

export interface iCreateQuizForm {
    question: Array<Descendant>;
    options: iQuizOptions;
    answer: iQuizOption;
    reason: string;
}

function QuizEditor({

}: iQuizEditorProps) {
    const {
        selectedMaterial,
    } = useCourseEditor()

    const [selectedQuiz, setSelectedQuiz] = useState<iCourseQuiz | null>(null)

    function openCreateNewQuiz() {
        setSelectedQuiz(null)
    }

    return (
        <div className="flex gap-x-4 px-2 py-2">
            <div className="flex flex-6 flex-col py-3 gap-y-4">
                <QuizDescriptionEditor
                    key={`quiz-description-${selectedQuiz?.id}-editor`}
                /> 

                <QuizContentEditor
                    selectedQuiz={selectedQuiz}
                    key={selectedQuiz?.id}
                />
            </div>
            <QuizQuestionsSidebar
                selectedMaterial={selectedMaterial}
                onClickQuiz={setSelectedQuiz}
                selectedQuiz={selectedQuiz}
                openCreateNewQuiz={openCreateNewQuiz}
            />

        </div >

    )
}