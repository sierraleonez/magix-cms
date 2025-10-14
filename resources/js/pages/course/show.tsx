import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { iCourse, iCourseMemberDetails, iCourseMembers, iCourseTopics, iOrganizationMembers } from "@/types";
import { parseErrorMessage } from "@/utils/error";
import { useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createCourseBreadcrumb } from "./breadcrumbs";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useSearch } from "@/utils/autosearch";
import axios from 'axios'
import MagixCombobox from "@/components/combobox";


interface iShowCourseProps {
    course: iCourse;
    course_topics: iCourseTopics;
    course_members: iCourseMemberDetails;
}

export default function ShowCourse({ course, course_topics, course_members }: iShowCourseProps) {
    const [isCreateTopicDialogOpen, setIsCreateTopicDialogOpen] = useState(false)
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
    const organizationId = course.organization_id
    const courseId = course.id
    const { get } = useForm()

    const breadcrumbs = createCourseBreadcrumb(organizationId, [
        {
            href: route('showOrganizationCourse', { id: organizationId, course_id: courseId }),
            title: String(courseId)
        }
    ])

    function openCreateTopicDialog() {
        setIsCreateTopicDialogOpen(true)
    }

    function openAddMemberDialog() {
        setIsAddMemberDialogOpen(true)
    }

    function redirectToCourseTopicDetail(courseTopicId: number) {
        get(route('courseContentEditor', {
            id: organizationId,
            course_id: courseId,
        }))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="grid grid-cols-2 p-3 gap-3">
                <Card>
                    <CardHeader >
                        <CardTitle>{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            {course.description}
                        </CardDescription>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Course Schedules
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex justify-between flex-row items-center">
                        <CardTitle>
                            Course Topics
                        </CardTitle>
                        <Button onClick={openCreateTopicDialog}>
                            <Plus />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-y-3">
                            {
                                course_topics.map((courseTopic) => (
                                    <Card key={courseTopic.id} onClick={() => redirectToCourseTopicDetail(courseTopic.id)}>
                                        <CardHeader>
                                            <CardTitle>{courseTopic.name}</CardTitle>
                                            <CardDescription>
                                                {courseTopic.description}
                                            </CardDescription>
                                        </CardHeader>
                                        {/* <CardContent>
                                        </CardContent> */}
                                    </Card>

                                ))
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex justify-between flex-row items-center">

                        <CardTitle>
                            Course Members
                        </CardTitle>

                        <Button onClick={openAddMemberDialog}>
                            <Plus />
                        </Button>

                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-2">
                        {
                            course_members.map((courseMember) => (
                                <Card key={courseMember.id}>
                                    <CardHeader>
                                        <CardTitle>{courseMember?.detail?.name}</CardTitle>
                                        <CardDescription>{courseMember?.detail?.email}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))
                        }
                    </CardContent>
                </Card>
            </div>
            <CreateCourseTopicDialog
                isOpen={isCreateTopicDialogOpen}
                onOpenChange={setIsCreateTopicDialogOpen}
                courseId={courseId}
                organizationId={organizationId}
            />
            <AddCourseMemberDialog
                isOpen={isAddMemberDialogOpen}
                onOpenChange={setIsAddMemberDialogOpen}
                courseId={courseId}
                organizationId={organizationId}

            />

        </AppLayout>
    )
}

interface iCreateCourseTopicDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    organizationId: number;
    courseId: number;
}

interface iCreateCourseTopicForm {
    name: string;
    description: string;
}

function CreateCourseTopicDialog({
    isOpen,
    onOpenChange,
    courseId,
    organizationId
}: iCreateCourseTopicDialogProps) {
    const {
        data,
        setData,
        processing,
        post,
        resetAndClearErrors
    } = useForm<Required<iCreateCourseTopicForm>>({
        description: '',
        name: ''
    })

    function closeDialog() {
        onOpenChange(false)
    }

    function createCourseTopic() {
        post(route('storeCourseTopic', {
            id: organizationId,
            course_id: courseId
        }), {
            onSuccess: () => {
                toast('Create Topic Success')
                closeDialog()
                resetAndClearErrors()
            },
            onError: err => {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Course Topic</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-2">
                    <Input
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Course Name"
                    />
                    <Input
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        placeholder="Course Description"
                    />

                </div>
                <DialogFooter>
                    <Button disabled={processing} onClick={createCourseTopic} >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface iAddCourseMemberDialogForm {
    organization_member_id: number;
    email: string;
}

function AddCourseMemberDialog({
    isOpen,
    onOpenChange,
    courseId,
    organizationId
}: iCreateCourseTopicDialogProps) {
    const [result, setResult] = useState<iOrganizationMembers>([])

    useEffect(() => {
        async function getInitialData() {
            const res = await axios.get(
                route('listOrganizationMember', { id: organizationId }),
            )
            setResult(res.data?.data)
        }
        getInitialData()
    }, [organizationId])

    const {
        data,
        setData,
        processing,
        post,
        resetAndClearErrors
    } = useForm<Required<iAddCourseMemberDialogForm>>({
        organization_member_id: 0,
        email: ''
    })

    function closeDialog() {
        onOpenChange(false)
    }

    function submitAddmember() {
        const isOrganizationMember = !!data.organization_member_id
        if (isOrganizationMember) {
            addCourseMember()
        } else {
            sendCourseInvitation()
        }
    }

    function sendCourseInvitation() {
        post(route('storeCourseMemberByEmail', {
            id: organizationId,
            course_id: courseId
        }), {
            onSuccess: () => {
                toast('Invitation Sent')
                closeDialog()
                resetAndClearErrors()
            },
            onError: err => {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }

    function addCourseMember() {
        post(route('storeCourseMember', {
            id: organizationId,
            course_id: courseId
        }), {
            onSuccess: () => {
                toast('Create Member Added')
                closeDialog()
                resetAndClearErrors()
            },
            onError: err => {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }

    function handleSuggestionClick(email: string) {
        const selectedMember = result.find(member => {
            return member.email === email
        })
        setData('organization_member_id', Number(selectedMember?.id))
    }


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Course Topic</DialogTitle>
                </DialogHeader>
                <MagixCombobox
                    items={result}
                    itemKey="email"
                    onValueChange={val => setData('email', val)}
                    onSuggestionClick={handleSuggestionClick}
                />
                <DialogFooter>
                    <Button disabled={processing} onClick={submitAddmember} >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}