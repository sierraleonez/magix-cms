import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourse } from "@/types";
import { router } from "@inertiajs/react";
import { useMemo } from "react";

interface iShowStudentCourseProps {
    course: iCourse;
    course_subscription: any;
    progress: {
        finished_material_count: number;
        total_material_count: number;
    }

}

export default function ShowStudentCourse({ course, course_subscription, progress }: iShowStudentCourseProps) {
    const expiryDate = useMemo(() => {
        const date = new Date(course_subscription.expired_at)
        return date.toLocaleDateString()
    }, [course_subscription.expired_at])

    function showCourseContent() {
        router.visit(route('showStudentCourseContent', {
            course_id: course.id
        }))
    }

    return (
        <AppLayout>
            <div className="grid grid-cols-2 p-3 gap-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{course.description}</CardDescription>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription Detail</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Expired at {expiryDate}</CardDescription>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Material</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <CardDescription>
                            Progress: {progress.finished_material_count} / {progress.total_material_count}
                        </CardDescription>
                        <Button onClick={showCourseContent}>
                            Start Learning
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}