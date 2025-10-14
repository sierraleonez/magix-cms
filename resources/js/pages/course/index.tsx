import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation";
import MagixTable from "@/components/table/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, iCourses } from "@/types";
import { parseErrorMessage } from "@/utils/error";
import { Link, useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRoute } from "ziggy-js";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Organization',
        href: '/organization/',
    },
    {
        title: '',
        href: ''
    }
];

function createBreadcrumb(organizationId: number) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Organization',
            href: '/organization/',
        },
        {
            title: String(organizationId),
            href: `/organization/${organizationId}`
        },
        {
            title: 'Course',
            href: 'courses'
        }
    ];
    return breadcrumbs
}

interface iCourseIndexProps {
    courses: iCourses
}

export default function CourseIndex({ courses }: iCourseIndexProps) {
    const route = useRoute()
    const params = route().params
    const organizationId = Number(params?.id)
    const breadcrumbs = createBreadcrumb(organizationId)

    const { delete: deleteFn, resetAndClearErrors } = useForm()
    const { get } = useForm()
    const [deleteCourseDialogState, setDeleteCourseDialogState] = useState({
        isOpen: false,
        courseId: 0
    })

    function openDeleteCourseDialog(courseId: number) {
        setDeleteCourseDialogState({
            isOpen: true,
            courseId
        })
    }

    function onChangeDeleteCourseDialogState(isOpen: boolean) {
        setDeleteCourseDialogState({
            ...deleteCourseDialogState,
            isOpen
        })
    }

    function closeDeleteDialog() {
        setDeleteCourseDialogState({
            isOpen: false,
            courseId: 0
        })
    }

    function deleteCourse(courseId: number) {
        deleteFn(route('deleteOrganizationCourse', {
            id: organizationId,
            course_id: courseId
        }), {
            onSuccess: () => {
                toast('Course deleted')
                resetAndClearErrors()
                closeDeleteDialog()
            },
            onError: (err) => {
                const message = parseErrorMessage(err)
                toast(message)
                resetAndClearErrors()
                closeDeleteDialog()
            }
        })
    }

    function showCourseDetail(courseId: number) {
        if (courseId) {
            get(route('showOrganizationCourse', {
                id: organizationId,
                course_id: courseId
            }))
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-8">
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex flex-1 justify-between items-center gap-x-2">
                            <p>Courses</p>
                            <Link href={route('createOrganizationCourse', { id: organizationId })}>
                                <Button>
                                    <Plus />
                                </Button>
                            </Link>
                        </div>

                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex flex-col">
                            <MagixTable
                                onClickDelete={(course) => openDeleteCourseDialog(course.id)}
                                items={courses}
                                onClickItem={(course) => showCourseDetail(course.id)}
                                keys={['name', 'description', 'tags', 'action']}
                            />

                        </div>
                    </CardContent>
                </Card>
            </div>
            <DeleteConfirmationDialog
                title="Are you you want to delete this course?"
                description="Once deleted, this course and all related data cannot be recovered"
                isOpen={deleteCourseDialogState.isOpen}
                onClickDelete={() => deleteCourse(deleteCourseDialogState.courseId)}
                onIsOpenChange={onChangeDeleteCourseDialogState}
            />
        </AppLayout>
    )
}