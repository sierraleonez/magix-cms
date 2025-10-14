import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourseInvitations } from "@/types";
import { Link } from "@inertiajs/react";

interface iCourseInvitationProps {
    course_invitations: iCourseInvitations
}

export default function CourseInvitation({ course_invitations }: iCourseInvitationProps) {
    return (
        <AppLayout>
            <div className="p-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Invitation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            {course_invitations.map((invitation) => {
                                return (
                                    <div className="border border-solid border-border p-4 rounded-md flex items-center justify-between">
                                        <p>
                                            {invitation.course.name}
                                        </p>
                                        <div className="flex gap-x-4">
                                            <Link href={route('showInvitation', { id: invitation.id })}>
                                                Open
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}