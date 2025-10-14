import MagixTextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { iCourseMaterial } from "@/types";
import { useForm } from "@inertiajs/react";
import { Edit } from "lucide-react";
import { useRoute } from "ziggy-js";

interface iShowCourseMaterialProps {
    course_material: iCourseMaterial
}

export default function ShowCourseMaterial({ course_material }: iShowCourseMaterialProps) {
    const { get } = useForm()
    const router = useRoute()
    const params = router().params
    const organizationId = Number(params?.id)
    const courseId = Number(params?.course_id)

    function redirectToEditCourseMaterial() {
        get(route('editCourseMaterial', {
            id: organizationId,
            course_id: courseId,
            course_topic_id: course_material.course_topic_id,
            course_material_id: course_material.id
        }))
    }

    return (
        <AppLayout>
            <div className="flex flex-col p-4 gap-y-3">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                {course_material.title}
                            </CardTitle>
                            <Button onClick={redirectToEditCourseMaterial}>
                                <Edit />
                            </Button>
                        </div>
                        <CardDescription>
                            {course_material.description}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MagixTextEditor
                            initialValue={course_material.content}
                            onChange={() => { }}
                            withToolbar={false}
                            readOnly
                        />
                    </CardContent>

                </Card>

            </div>
        </AppLayout>
    )
}

[{ "type": "paragraph", "children": [{ "bold": true, "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus sapien iaculis elit consequat ornare. Sed nec justo vitae justo ultrices faucibus vitae id ex. Proin eget porttitor arcu. Aenean mollis consectetur nunc, ut dictum ante suscipit eu. Vivamus vestibulum id risus sed dictum. Nullam pretium velit sit amet rhoncus interdum. Nam sed lorem convallis, facilisis lorem ac, vulputate augue. Quisque eu lectus non mauris sagittis lobortis. Vestibulum in viverra sem. Fusce odio libero, convallis vehicula neque ornare, fermentum vestibulum tellus. Fusce id lectus commodo, tempus augue vitae, vehicula est. Suspendisse fermentum lacinia nibh, eu gravida orci eleifend eu. Vestibulum commodo augue eget imperdiet mollis. Nulla dictum eu dolor in cursus. Etiam sapien ipsum, mattis id vulputate condimentum, malesuada id nunc. Donec mi orci, faucibus id quam eget, sagittis suscipit ipsum." }] }, { "type": "paragraph", "children": [{ "text": null }] }, { "type": "paragraph", "children": [{ "text": "Nullam egestas nulla quam, vitae dapibus erat congue quis. Praesent eu elit ac enim placerat pretium non vel ligula. Phasellus ut enim arcu. Ut vestibulum pharetra ex, et tempus ante congue id. Maecenas tincidunt laoreet neque non pretium. Nullam et tincidunt dui. Nullam sed ipsum molestie, dictum libero in, maximus odio. Phasellus consectetur sit amet nibh nec ornare.", "italic": true }] }, { "type": "paragraph", "children": [{ "text": null }] }, { "type": "paragraph", "children": [{ "text": "Praesent ultrices gravida ex, quis porta purus efficitur sit amet. Nullam sodales tellus arcu, id scelerisque purus convallis sed. Vivamus sit amet sem a augue malesuada tempor quis in orci. Nullam pulvinar fermentum commodo. Suspendisse lacinia suscipit leo, in consectetur leo egestas nec. Fusce ut ligula magna. Nullam interdum metus ligula, sed vulputate lacus viverra non. Donec egestas, lacus vel faucibus lobortis, ex diam ultrices nunc, quis tincidunt enim lacus eget erat. Nam mollis gravida purus vel vestibulum. Aliquam vel nisl eu eros scelerisque eleifend. Aliquam eget sodales purus." }] }, { "type": "paragraph", "children": [{ "text": null }] }, { "type": "paragraph", "children": [{ "text": "Donec tincidunt facilisis varius. Sed tincidunt vulputate augue. Quisque arcu neque, eleifend in pretium a, luctus at orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin cursus a nisi vel volutpat. Etiam blandit sed risus iaculis aliquam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;" }] }, { "type": "paragraph", "children": [{ "text": null }] }, { "type": "paragraph", "children": [{ "text": "Etiam pretium diam sit amet pulvinar aliquet. Mauris lacus neque, dapibus bibendum lorem eu, molestie euismod nulla. Etiam erat erat, commodo et eros et, sodales euismod est. Integer purus turpis, ullamcorper ac porta vel, egestas sit amet quam. Duis cursus id est quis volutpat. Phasellus efficitur aliquet molestie. Maecenas odio tellus, elementum quis imperdiet in, placerat non lacus. In ornare tortor ornare, ultrices magna sed, suscipit mi. Sed leo odio, tempor sit amet tortor in, iaculis auctor velit. Curabitur et leo finibus, molestie leo tempus, congue tortor. Aenean ultricies vestibulum velit. Praesent vestibulum facilisis felis et eleifend. Sed in tincidunt turpis. Vestibulum odio risus, sollicitudin eu commodo quis, tincidunt id ante. Quisque mollis erat urna, pharetra condimentum augue semper a. Aliquam feugiat tellus at odio gravida, sit amet pellentesque mauris facilisis." }] }, { "type": "paragraph", "children": [{ "text": null }] }, { "type": "paragraph", "children": [{ "text": null }] }]