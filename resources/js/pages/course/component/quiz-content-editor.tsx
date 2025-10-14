import MagixRadio from "@/components/radio-group";
import MagixTextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EDITOR_INITAL_VALUE } from "@/constants/editor";
import useCourseEditor from "@/hooks/use-course-editor";
import { iCourseQuiz } from "@/types";
import { useForm } from "@inertiajs/react";
import { Plus, Save } from "lucide-react";
import { iCreateQuizForm } from "../topic-material-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface iQuizContentEditorProps {
    selectedQuiz: iCourseQuiz | null;

}
export default function QuizContentEditor({ selectedQuiz }: iQuizContentEditorProps) {
    const {
        createQuiz,
        selectedMaterial,
        updateQuiz
    } = useCourseEditor()

    const { data: createQuizFormState, setData: setQuizFormData, post } = useForm<Required<iCreateQuizForm>>({
        question: selectedQuiz ? selectedQuiz.question : EDITOR_INITAL_VALUE,
        options: selectedQuiz ? selectedQuiz.options : [],
        answer: selectedQuiz ? { id: selectedQuiz.answer, option: ''} : { id: 0, option: '' },
        reason: selectedQuiz ? selectedQuiz.reason : ''
    })

    function submitUpdate() {
        const courseTopicId = Number(selectedMaterial?.course_topic_id)
        const courseMaterialId = Number(selectedMaterial?.id)
        const isCreate = !selectedQuiz?.id

        if (isCreate) {
            createQuiz(
                courseTopicId,
                courseMaterialId,
                createQuizFormState
            )
        } else {
            updateQuiz(
                courseTopicId,
                courseMaterialId,
                selectedQuiz.id,
                createQuizFormState
            )
        }
    }

    return (
        <Card >
            <CardHeader>
                <CardTitle>New Question</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-3">
                    <MagixTextEditor
                        key={`quiz-content-${selectedQuiz?.id}-editor`}
                        initialValue={createQuizFormState.question}
                        onChange={(content) => setQuizFormData('question', content)}
                    />
                </div>

                <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between items-center">
                        <CardTitle>Options</CardTitle>
                        <Button variant={"secondary"} onClick={() => {
                            const target = document.getElementById("add-new-quiz-input")
                            if (target) {
                                target.focus()
                            }
                        }}>
                            <Plus />
                        </Button>

                    </div>
                    <div className="Options flex flex-col gap-y-2">
                        {
                            createQuizFormState.options && (
                                <MagixRadio
                                    items={createQuizFormState.options}
                                    onChangeValue={(value) => {
                                        setQuizFormData('answer', value)
                                    }}
                                    value={createQuizFormState.answer}
                                    itemLabelKey="option"
                                    itemValueKey="id"
                                />
                            )
                        }

                        <AddNewQuizInput
                            value=""
                            onSubmitInput={content => {
                                const newOptions = [...createQuizFormState.options]
                                const lastOptionId = newOptions?.[newOptions.length - 1]?.id
                                const newOptionId = lastOptionId ? (lastOptionId + 1) : 1
                                newOptions.push({
                                    option: content,
                                    id: newOptionId
                                })
                                setQuizFormData('options', newOptions)
                            }}
                        />

                    </div>

                    <div>
                        <Label>Reason</Label>
                        <Input
                            value={createQuizFormState.reason}
                            onChange={(e) => { setQuizFormData('reason', e.target.value) }}

                        />
                    </div>
                </div>
                <Button onClick={submitUpdate}>
                    <Save />
                </Button>
            </CardContent>
        </Card>
    )
}



function AddNewQuizInput({
    onSubmitInput,
    value
}: {
    value: string;
    onSubmitInput: (content: string) => void;
}) {
    return (
        <div
            tabIndex={-1}
            id="test-option-item"
            className="group relative flex cursor-pointer rounded-lg bg-card/5 px-5 py-2 text-secondary border border-border border-solid transition focus:not-data-focus:outline-none data-checked:bg-card/10 data-focus:outline data-focus:outline-primary"
            onClick={e => {
                const targetId = "add-new-quiz-input"
                const targetElement = document.getElementById(targetId)
                if (targetElement) {
                    targetElement.focus()
                }
            }}
        >
            <div id="test-quiz-option" className="flex w-full items-center justify-between">
                <div className="text-sm/6">
                    <input
                        className="font-semibold text-primary w-full"
                        id="add-new-quiz-input"
                        defaultValue={value}
                        onBlur={(e) => {

                        }}
                        onKeyDown={(e) => {
                            e.stopPropagation()
                            if (e.key === 'Enter') {
                                const value = e.target.value
                                if (value) {
                                    onSubmitInput(value)
                                    e.target.value = ""
                                }
                            }
                        }}
                    />
                </div>
            </div >
        </div >
    )
}
