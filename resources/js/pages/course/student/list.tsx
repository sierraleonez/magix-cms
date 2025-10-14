import MagixTable from "@/components/table/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourse, iCourses } from "@/types";
import { router } from "@inertiajs/react";

interface iStudentCourseProps {
    courses: iCourses
}

export default function StudentCourses({ courses }: iStudentCourseProps) {
    function showCourse(item: iCourse) {
        router.visit(route('showStudentCourse', {
            course_id: item.id
        }))
    }
    return (
        <AppLayout>
            <div className="p-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex flex-col">
                            <MagixTable
                                items={courses}
                                keys={['course_name', 'description', 'tags']}
                                onClickItem={showCourse}
                            />

                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}