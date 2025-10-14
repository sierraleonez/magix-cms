import MagixRadio from "@/components/radio-group"
import MagixTextEditor from "@/components/text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { iCourseMaterial, iQuizOption } from "@/types"
import { parseErrorMessage } from "@/utils/error"
import { router, useForm } from "@inertiajs/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"

interface iCourseQuizProps {
    course_material: iCourseMaterial
}

const formEmptyState: iQuizOption = {
    id: 0,
    option: ''
}

export default function CourseQuiz({ course_material }: iCourseQuizProps) {
    const { data: quizFormState, setData: setQuizFormState } = useForm<Required<{ selected_option: { [key: number]: iQuizOption } }>>({
        selected_option: {}
    })

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [quizResult, setQuizResult] = useState(null)


    function previousQuestion() {
        const previousQuestionIdx = currentQuestionIdx - 1
        const isPreviousQuestionExist = !!course_material.course_quiz[previousQuestionIdx]

        if (isPreviousQuestionExist) {
            setCurrentQuestionIdx(previousQuestionIdx)

        }
    }


    function nextQuestion() {
        const nextQuestionIdx = currentQuestionIdx + 1

        if (!isLastQuestion) {
            setCurrentQuestionIdx(nextQuestionIdx)
        }
    }

    const currentQuestion = useMemo(() => {
        return course_material.course_quiz[currentQuestionIdx]
    }, [currentQuestionIdx])

    const selectedOption = useMemo(() => {
        if (currentQuestion) {
            const option = quizFormState.selected_option[currentQuestion.id] || formEmptyState
            return option
        }

        return formEmptyState
    }, [currentQuestion, quizFormState.selected_option[currentQuestion.id]])

    const isLastQuestion = useMemo(() => {
        const nextQuestionIdx = currentQuestionIdx + 1
        const nextQuestionExist = !!course_material.course_quiz[nextQuestionIdx]
        if (nextQuestionExist) {
            return false
        } else {
            return true
        }
    }, [currentQuestionIdx, currentQuestion])

    const { isCorrectAnswerCardShown, isReasonShown } = useMemo(() => {
        let isCorrectAnswerShown = false
        let isWrongAnswerShown = false
        if (!!quizResult) {
            if (selectedOption.id === currentQuestion.answer) {
                isCorrectAnswerShown = true
            } else {
                isWrongAnswerShown = true
            }
        }

        return {
            isCorrectAnswerCardShown: isCorrectAnswerShown,
            isReasonShown: isWrongAnswerShown
        }
    }, [quizResult, currentQuestionIdx])

    function checkAnswer() {
        nextQuestion()
    }

    function submitQuiz() {
        if (!quizResult) {
            router.post(
                route('checkQuizAnswer', {
                    course_material_id: course_material.id
                }),
                {
                    answers: quizFormState.selected_option
                },
                {
                    onSuccess: (res) => {
                        const result = res.props?.flash?.success
                        setQuizResult(result)

                    },
                    onError: (err) => {
                        const message = parseErrorMessage(err)
                        toast(message)
                    }
                }
            )
        }
    }

    function resetQuiz() {
        setCurrentQuestionIdx(0)
        setQuizFormState({
            selected_option: {}
        })
        setQuizResult(null)
    }

    function backToCourse() {
        router.visit(route('redirectToStudentCourseContent', {
            course_material_id: course_material.id
        }))
    }

    return (
        <div className="bg-bg p-3 grid grid-rows-6">
            {/* Quiz section */}
            <div className="row-span-5">
                <div className="flex items-center justify-between border-1 border rounded-md p-3">
                    <ChevronLeft onClick={previousQuestion} />
                    <div className="text-center">
                        <p className="font-bold text-md">Question {currentQuestionIdx + 1}</p>
                    </div>
                    <ChevronRight onClick={nextQuestion} />
                </div>
                <div>
                    <MagixTextEditor
                        initialValue={currentQuestion.question}
                        onChange={() => { }}
                        readOnly
                        key={currentQuestionIdx}
                        withToolbar={false}
                    />
                </div>
                <div className="py-4 mt-4">
                    <MagixRadio
                        items={currentQuestion.options}
                        key={currentQuestionIdx}
                        itemClassNameFn={(item) => {
                            const isRightAnswer = (item.id === currentQuestion.answer)
                            const isWrongAnswer = item.id === selectedOption.id
                            if (!!quizResult) {
                                if (isRightAnswer) {
                                    return "border-chart-2"
                                } else if (isWrongAnswer) {
                                    return "border-destructive"
                                }

                            }
                            return ""

                        }}
                        disabled={!selectedOption}
                        onChangeValue={(option) => {
                            const newOptions = { ...quizFormState.selected_option }
                            newOptions[currentQuestion.id] = option
                            setQuizFormState('selected_option', newOptions)
                        }}
                        value={quizFormState.selected_option[currentQuestion.id] || formEmptyState}
                        itemLabelKey="option"
                        itemValueKey="id"
                    />
                </div>
                <div className="space-y-3">

                    {
                        isCorrectAnswerCardShown && (
                            <Card className="border border-chart-2 px-3 py-4">
                                <p>
                                    Your answer is correct
                                </p>
                            </Card>
                        )
                    }
                    {
                        isReasonShown && (
                            <Card className="border border-destructive px-3 py-4">
                                <p >
                                    {currentQuestion.reason}
                                </p>
                            </Card>
                        )
                    }
                    {
                        quizResult && (
                            <Card className="border boder-border px-3 py-5">
                                <CardHeader>
                                    <CardTitle className="text-center">Congratulations!</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    You scored {quizResult?.score}
                                </CardContent>
                                <CardFooter>
                                    <div className="flex w-full justify-center items-center">
                                        <div className="grid grid-cols-2 justify-center space-x-2">
                                            <Button variant={"outline"} onClick={backToCourse}>
                                                Back to Course
                                            </Button>
                                            <Button onClick={resetQuiz}>
                                                Try Again
                                            </Button>
                                        </div>

                                    </div>
                                </CardFooter>
                            </Card>
                        )
                    }
                </div>

            </div>

            {/* Submit button */}
            <div className="flex justify-end items-end w-full py-5">
                {
                    isLastQuestion ? (
                        <Button className="flex-1" onClick={submitQuiz}>
                            Finish
                        </Button>
                    ) : (
                        <Button className="flex-1" onClick={checkAnswer}>
                            Next Question
                        </Button>
                    )
                }
            </div>
        </div>
    )
}