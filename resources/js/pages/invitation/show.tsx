import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourseInvitation } from "@/types";
import { parseErrorMessage } from "@/utils/error";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

interface iShowCourseInvitationProps {
    course_invitation: iCourseInvitation
}

export default function ShowInvitation({ course_invitation }: iShowCourseInvitationProps) {
    const isPaidCourse = !!course_invitation.course.is_paid
    const paidCourseLabel = "Paid Course"
    const freeCourseLabel = "Free Course"
    const label = isPaidCourse ? paidCourseLabel : freeCourseLabel

    const { post, get } = useForm()

    function finishSubscriptionPayment() {
        get(route('showPaymentPage', {
            course_id: course_invitation.course_id,
            invitation: course_invitation.id
        }))
    }

    function acceptInvitation() {
        post(route('acceptInvitation', { id: course_invitation.id }), {
            onSuccess: () => {
                toast('Course Joined!')
            },
            onError: (err) => {
                const message = parseErrorMessage(err)
                toast(message)
            }
        })
    }

    function onClickJoin() {
        if (isPaidCourse) {
            finishSubscriptionPayment()
        } else {
            acceptInvitation()
        }
    }
    return (
        <AppLayout>
            <div className="p-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {course_invitation.course.name}
                        </CardTitle>
                        <CardDescription>
                            {label}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-1">
                        <Button className="flex-1" onClick={onClickJoin}>
                            Join
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    )
}