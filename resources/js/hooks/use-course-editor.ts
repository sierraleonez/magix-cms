import { iCourseMaterial, iCourseTopicsWithMaterials } from "@/types";
import axios from "axios";
import { createContext, useCallback, useContext } from "react";
import toast from "react-hot-toast";
import { parseErrorMessage } from "@/utils/error";
import { useForm } from "@inertiajs/react";
import { Descendant } from "slate";
import { iCreateQuizForm } from "@/pages/course/topic-material-editor";

interface iCourseMaterialDeleteDialogState {
    isOpen: boolean;
    courseMaterialId: number;
    courseTopicId: number;
}

interface iCourseEditorCtx {
    courseTopicsWithMaterials: iCourseTopicsWithMaterials;
    selectedMaterial: iCourseMaterial | null;
    courseId: number;
    organizationId: number;
    courseMaterialDeleteDialogState: iCourseMaterialDeleteDialogState
    setCourseMaterialDeleteDialogState: (newState: iCourseMaterialDeleteDialogState) => void;
    setSelectedMaterial: (courseMaterial: iCourseMaterial) => void;
    // submitCreateCourseMaterial: (courseTopicId: number, title: string) => Awaited<iCourseMaterial>;
    // submitCreateCourseTopic: () => void;

}

export const CourseEditorCtx = createContext<iCourseEditorCtx>({
    courseTopicsWithMaterials: [],
    selectedMaterial: null,
    courseId: 0,
    organizationId: 0,
    courseMaterialDeleteDialogState: {
        isOpen: false,
        courseMaterialId: 0,
        courseTopicId: 0
    },
    setCourseMaterialDeleteDialogState: () => { },
    setSelectedMaterial: () => { },
    // submitCreateCourseMaterial: () => {},
    // submitCreateCourseTopic: () => {},
})

export default function useCourseEditor() {
    const courseEditorCtx = useContext(CourseEditorCtx);
    const courseMaterialDeleteDialogState = courseEditorCtx.courseMaterialDeleteDialogState
    const organizationId = courseEditorCtx.organizationId
    const courseId = courseEditorCtx.courseId

    const { delete: deleteFn, patch, transform, post } = useForm()

    const createCourseMaterial = useCallback(async (title: string, courseTopicId: number, materialType: string) => {
        const payload = {
            content: [{
                type: 'paragraph',
                children: [
                    { text: '' }
                ]
            }],
            title,
            description: 'test description',
            type: materialType
        }
        try {
            const result = await axios.post(route('storeCourseMaterialWithoutRedirect', {
                id: organizationId,
                course_id: courseId,
                course_topic_id: courseTopicId
            }), payload)

            toast("Material created")
            return result.data

        } catch (err) {
            const message = err?.response?.data?.message
            if (message) {
                toast(message)
            }
        }
    }, [])

    function openDeleteCourseMaterialDialog(courseMaterialId: number, courseTopicId: number) {
        courseEditorCtx.setCourseMaterialDeleteDialogState({
            isOpen: true,
            courseMaterialId,
            courseTopicId
        })
    }

    const createCourseTopic = useCallback(() => {

    }, [])

    function closeDeleteMaterialDialog() {
        courseEditorCtx.setCourseMaterialDeleteDialogState({
            isOpen: false,
            courseMaterialId: 0,
            courseTopicId: 0
        })
    }

    function resetSelectedMaterial() {
        courseEditorCtx.setSelectedMaterial(null)
    }

    const deleteCourseMaterial = useCallback((courseMaterialId: number, courseTopicId: number) => {
        deleteFn(route('deleteCourseMaterial', {
            id: organizationId,
            course_id: courseId,
            course_topic_id: courseTopicId,
            course_material_id: courseMaterialId
        }), {
            preserveScroll: true,
            onSuccess: () => {
                toast("Material deleted")
                resetSelectedMaterial()
                closeDeleteMaterialDialog()
            },
            onError: (err) => {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }, [])

    const updateCourseMaterial = useCallback(({
        courseTopicId,
        courseMaterialId,
        content,
        description,
        title
    }: {
        courseTopicId: number;
        courseMaterialId: number;
        content: Array<Descendant>,
        description: string;
        title: string;
    }) => {

        transform((data) => ({
            content,
            description,
            title
        }))

        patch(route('storeCourseMaterialUpdate', {
            id: organizationId,
            course_id: courseId,
            course_topic_id: courseTopicId,
            course_material_id: courseMaterialId
        }), {
            onSuccess: () => {
                toast('Update success')
            },
            onError: (err) => {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })

    }, [organizationId, courseId])

    function createQuiz(courseTopicId: number, courseMaterialId: number, payload: iCreateQuizForm) {
        transform(() => ({
            ...payload,
            answer: payload.answer.id
        }))
        post(route('storeCourseQuiz', {
            id: organizationId,
            course_id: courseId,
            course_topic_id: courseTopicId,
            course_material_id: courseMaterialId
        }), {
            preserveState: true,
            onSuccess: () => {
                toast('Quiz created')
            },
            onError(err) {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }

    function updateQuiz(courseTopicId: number, courseMaterialId: number, quizId: number, payload: iCreateQuizForm) {
        transform(() => ({
            ...payload,
            answer: payload.answer.id
        }))
        patch(route('updateCourseQuiz', {
            id: organizationId,
            course_id: courseId,
            course_topic_id: courseTopicId,
            course_material_id: courseMaterialId,
            quiz_id: quizId
        }), {
            preserveState: true,
            onSuccess: () => {
                toast('Quiz updated')
            },
            onError(err) {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }


    return {
        courseTopicsWithMaterials: courseEditorCtx.courseTopicsWithMaterials,
        selectedMaterial: courseEditorCtx.selectedMaterial,
        setSelectedMaterial: courseEditorCtx.setSelectedMaterial,
        setCourseMaterialDeleteDialogState: courseEditorCtx.setCourseMaterialDeleteDialogState,
        courseMaterialDeleteDialogState,
        updateCourseMaterial,
        openDeleteCourseMaterialDialog,
        createCourseTopic,
        createCourseMaterial,
        deleteCourseMaterial,
        createQuiz,
        updateQuiz
    }
}
