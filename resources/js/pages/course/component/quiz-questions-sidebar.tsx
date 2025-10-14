import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { iCourseMaterial, iCourseQuiz } from "@/types";
import { Plus } from "lucide-react";

interface iQuizQuestionsSidebarProps {
    selectedMaterial: iCourseMaterial | null;
    selectedQuiz: iCourseQuiz | null;
    onClickQuiz: (quiz: iCourseQuiz) => void;
    openCreateNewQuiz: () => void;
}

export default function QuizQuestionsSidebar({ selectedMaterial, openCreateNewQuiz, onClickQuiz, selectedQuiz }: iQuizQuestionsSidebarProps) {
    const isHaveQuestion = selectedMaterial?.course_quiz?.length > 0

    return (
        <Card className="flex flex-2 ">
            <CardHeader>
                <CardTitle>
                    Quiz Questions
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full">

                {isHaveQuestion ?
                    (
                        <div className="flex gap-x-3">
                            {selectedMaterial?.course_quiz.map(quiz => (
                                <div
                                    onClick={() => onClickQuiz(quiz)}
                                    className={
                                        cn(
                                            "px-3 py-2 border-border border border-solid rounded-md",
                                            quiz.id === selectedQuiz?.id && "bg-border"
                                        )
                                    }
                                >
                                    {quiz.id}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <p>
                                You dont have any question.
                            </p>

                        </div>
                    )}
            </CardContent>
            <CardFooter>
                <Button onClick={openCreateNewQuiz} className="w-full">
                    <Plus />
                </Button>
            </CardFooter>
        </Card>
    )
}