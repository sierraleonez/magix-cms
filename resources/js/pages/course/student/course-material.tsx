import MagixTextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourseTopicsWithMaterials, iCourseTopicWithMaterials } from "@/types";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface iCourseMaterialProps {
    course_content: iCourseTopicsWithMaterials
}

export default function CourseMaterial({ course_content }: iCourseMaterialProps) {
    const [materialProgressState, setMaterialProgressState] = useState({
        topic_idx: 0,
        material_idx: 0
    })
    const courseProgressId = useRef(null);
    const { currentMaterial, currentTopic } = useMemo(() => {
        const topic = course_content[materialProgressState.topic_idx]
        topic
        const material = topic.course_materials[materialProgressState.material_idx]
        return {
            currentMaterial: material,
            currentTopic: topic
        }
    }, [materialProgressState.material_idx, materialProgressState.topic_idx])

    const {
        isNextMaterialExist,
        isPreviousMaterialExist,
        nextMaterialIndex,
        previousMaterialIndex
    } = useMemo(() => {
        const currentTopicIdx = materialProgressState.topic_idx
        const nextMaterialIdx = materialProgressState.material_idx + 1
        const previousMaterialIdx = materialProgressState.material_idx - 1
        const nextMaterialExist = !!course_content[currentTopicIdx].course_materials[nextMaterialIdx]
        const previousMaterialExist = !!course_content[currentTopicIdx].course_materials[previousMaterialIdx]
        return {
            isNextMaterialExist: nextMaterialExist,
            isPreviousMaterialExist: previousMaterialExist,
            nextMaterialIndex: nextMaterialIdx,
            previousMaterialIndex: previousMaterialIdx
        }
    }, [materialProgressState.material_idx, materialProgressState.topic_idx])

    const isQuiz = currentMaterial.type === 'quiz'

    function nextMaterial() {
        const currentTopicIdx = materialProgressState.topic_idx
        if (isNextMaterialExist) {
            const isNotFinished = !currentMaterial.progress?.is_finished
            if (currentMaterial.type === 'material' && isNotFinished) {
                storeFinishedCourseProgress()
            }

            setMaterialProgressState({
                topic_idx: currentTopicIdx,
                material_idx: nextMaterialIndex
            })
        }
    }

    function previousMaterial() {
        const currentTopicIdx = materialProgressState.topic_idx
        if (isPreviousMaterialExist) {
            setMaterialProgressState({
                topic_idx: currentTopicIdx,
                material_idx: previousMaterialIndex
            })
        }
    }

    function openQuiz(courseMaterialId: number) {
        window.open(route('showStudentCourseQuiz', {
            course_material_id: courseMaterialId
        }))
    }

    function storeCourseProgress(isFinished: boolean = false) {
        router.post(route('storeCourseProgress', {
            course_material_id: currentMaterial.id,
        }), {
            is_finished: isFinished
        }, {
            onSuccess(res) {
                const result = res.props?.flash?.success
                console.log('onsuccess', result)
                courseProgressId.current = result.id
            }
        })
    }
    console.log(courseProgressId.current)

    function storeFinishedCourseProgress() {
        const currentProgress = currentMaterial.progress
        const progressId = currentProgress ? currentProgress.id : courseProgressId.current
        router.post(route('storeFinishedCourseProgress', {
            course_progress_id: progressId,
        }))
    }

    useEffect(() => {
        if (!currentMaterial.progress) {
            storeCourseProgress()
        }
    }, [currentMaterial.id])

    return (
        <AppLayout>
            <div className="p-3 flex flex-col gap-y-4">
                <div className="flex items-center justify-between border-1 border rounded-md p-3">
                    <ChevronLeft onClick={previousMaterial} />
                    <div className="text-center">
                        <p className="font-bold text-md">{currentTopic.name}</p>
                        <p>{currentMaterial.title}</p>

                    </div>
                    <ChevronRight onClick={nextMaterial} />
                </div>
                {
                    isQuiz ? (
                        <Card>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center gap-y-2">
                                    <p>
                                        {currentMaterial.course_quiz.length} Questions
                                    </p>
                                    <Button onClick={() => openQuiz(currentMaterial.id)}>
                                        Start Quiz
                                    </Button>

                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        currentMaterial && (
                            <MagixTextEditor
                                key={`material-${materialProgressState.topic_idx}-${materialProgressState.material_idx}`}
                                readOnly
                                initialValue={currentMaterial.content}
                                onChange={() => { }}
                                withToolbar={false}
                            />
                        )
                    )
                }


            </div>
        </AppLayout>
    )
}