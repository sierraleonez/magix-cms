import MagixPopover from "@/components/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useCourseEditor from "@/hooks/use-course-editor"
import { cn } from "@/lib/utils"
import { iCourseMaterial, iCourseTopic, iCourseTopicWithMaterials } from "@/types"
import { resetField } from "@/utils/form"
import { createNewMaterialInputId, createNewMaterialSectionId, createNewMaterialTitleInputId } from "@/utils/id/generator"
import { ChevronDownIcon, ChevronRight, Delete, Edit, Plus, Trash } from "lucide-react"
import React, { useState } from "react"

interface iCourseContentSidebarProps {
    // courseTopicsWithMaterials: iCourseTopicsWithMaterials;
    // // onClickCreateNewMaterial: (courseTopicId: number) => void;
    // onClickMaterial: (courseMaterial: iCourseMaterial) => void;
    // onClickEditMaterial: (courseMaterialId: number) => void;
    // onSubmitCreateNewMaterial: (courseTopicId: number) => void;
}

export default function CourseContentSidebar({
}: iCourseContentSidebarProps) {
    const {
        courseTopicsWithMaterials,
        selectedMaterial,
        setSelectedMaterial,
        createCourseMaterial,
        openDeleteCourseMaterialDialog,
        updateCourseMaterial
    } = useCourseEditor()
    const [newMaterialType, setNewMaterialType] = useState('')

    function onClickCreateNewMaterial(topicId: number, materialType: string) {
        setNewMaterialType(materialType)
        openDetails(topicId)
        focusTargetInput(topicId)
    }

    function focusTargetInput(topicId: number) {
        const targetId = createNewMaterialInputId(topicId)
        
        const targetTextInput = document.getElementById(targetId)

        if (targetTextInput) {
            setTimeout(() => {
                targetTextInput?.focus()
            }, 100)
        } else {
            console.error("Target not found")
        }
    }

    function openDetails(topicId: number) {
        const targetId = createNewMaterialSectionId(topicId)
        const targetDetails = document.getElementById(targetId) as HTMLDetailsElement

        if (targetDetails) {
            targetDetails.open = true;
        }
    }

    async function submitCreateNewMaterial(newCourseTitle: string, courseTopic: iCourseTopicWithMaterials, materialType: string) {
        if (newCourseTitle) {
            const val = await createCourseMaterial(newCourseTitle, courseTopic.id, materialType)
            resetField(createNewMaterialInputId(courseTopic.id))
            if (val) {
                courseTopic.course_materials.push(val)
                setSelectedMaterial(val)
            }
        }
    }

    return (
        <div className="flex flex-col gap-y-2 p-3 bg-card-foreground w-[360px] min-h-screen text-secondary">
            <CourseHeader
                title="Course Title"
                description="Course Description"
            />
            <Separator />
            <div>
                {
                    courseTopicsWithMaterials.map((topic) => (
                        <details key={createNewMaterialSectionId(topic.id)} id={createNewMaterialSectionId(topic.id)} className="accordion-item">
                            <summary className="flex py-2 pr-2 gap-x-2 items-center hover:bg-chart-2 accordion-header justify-between">
                                <div className="flex items-center gap-x-2">
                                    {topic.course_materials.length ? (
                                        <ChevronRight className="AccordionChevron" size={20} />
                                    ) : null}
                                    <p>
                                        {topic.name}
                                    </p>

                                </div>
                                <MagixPopover
                                    items={[
                                        {
                                            title: 'Material',
                                            value: 'material',
                                            onClick: (value) => { onClickCreateNewMaterial(topic.id, value ) }
                                        },
                                        {
                                            title: 'Quiz',
                                            value: 'quiz',
                                            onClick: (value) => { onClickCreateNewMaterial(topic.id, value ) }
                                        },
                                    ]}
                                >
                                    <Plus size={20} />
                                </MagixPopover>

                            </summary>

                            <div className="accordion-content flex flex-col gap-y-2 px-4 pt-2">
                                {
                                    topic.course_materials.map((material) => (
                                        <CourseMaterial
                                            key={`topic-${topic.id}/material-${material.id}`}
                                            courseMaterial={material}
                                            onEditTitleBlur={(content) => updateCourseMaterial({
                                                ...content,
                                                courseMaterialId: material.id,
                                                courseTopicId: material.course_topic_id
                                            })}
                                            onClickItem={(courseMaterial) => setSelectedMaterial(courseMaterial)}
                                            selectedMaterial={selectedMaterial}
                                            onClickDeleteItem={
                                                (courseMaterial) => {
                                                    openDeleteCourseMaterialDialog(
                                                        courseMaterial.id,
                                                        courseMaterial.course_topic_id
                                                    )
                                                }
                                            }
                                        />
                                    ))
                                }
                                <input
                                    id={createNewMaterialInputId(topic.id)}
                                    placeholder="Test"
                                    className="focus:bg-card focus:text-card-foreground py-1 px-2 rounded-sm"
                                    onBlur={(event) => {
                                        const value = event.target.value
                                        if (value) {
                                            submitCreateNewMaterial(event.target.value, topic, newMaterialType)
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        const key = e.key
                                        if (key === 'Enter') {
                                            e.preventDefault()
                                            e.target.blur();
                                        }
                                    }}
                                />
                            </div>
                        </details>
                    ))
                }
            </div>
        </div>
    )
}

function CourseTopic() {

}

function CourseMaterial({
    courseMaterial,
    onClickItem,
    selectedMaterial,
    onClickDeleteItem,
    onEditTitleBlur
}: {
    courseMaterial: iCourseMaterial;
    onClickItem: (courseMaterial: iCourseMaterial) => void;
    selectedMaterial: iCourseMaterial | null;
    onClickDeleteItem: (courseMaterial: iCourseMaterial) => void;
    onEditTitleBlur: (courseMaterial: iCourseMaterial) => void
}) {

    function focusToNewMaterialInput() {
        const titleInputId = createNewMaterialTitleInputId(courseMaterial.id)
        const titleInput = document.getElementById(titleInputId)
        titleInput?.focus()
    }

    return (
        <div
            onClick={() => onClickItem(courseMaterial)}
            className={cn("group px-1 rounded-sm flex items-center justify-between", selectedMaterial?.id === courseMaterial.id ? "bg-chart-2" : "")}
        >
            <input
                id={createNewMaterialTitleInputId(courseMaterial.id)}
                defaultValue={courseMaterial.title}
                className="hover:cursor-pointer overflow-hidden text-ellipsis"
                onKeyDown={(e) => {
                    const key = e.key
                    if (key === 'Enter') {
                        e.preventDefault()
                        e.target.blur();
                    } else if (key === 'Escape') {
                        e.target.value = courseMaterial.title;
                        e.target.blur()
                    }
                }}
                onBlur={(e) => {
                    const value = e.target.value
                    if (value && value !== courseMaterial.title) {
                        onEditTitleBlur({
                            ...courseMaterial,
                            title: e.target.value
                        })
                    }
                }}
                onClick={(e) => e.target.blur()}
            />

            <div className="flex group-hover:opacity-100 opacity-0 gap-x-2">
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                        focusToNewMaterialInput()
                    }}
                    variant={"ghost"}
                >
                    <Edit
                        size={16}
                        className=""
                    />

                </Button>

                <Button
                    onClick={() => onClickDeleteItem(courseMaterial)}
                    className="px-0"
                    variant={'destructive'}
                >
                    <Trash />
                </Button>

            </div>
        </div>
    )
}

function CourseHeader({

}: {
    title: string;
    description: string;
}) {
    return (
        <div className="py-2">
            <p>Course Title</p>
            <p>Course Description</p>
        </div>
    )
}