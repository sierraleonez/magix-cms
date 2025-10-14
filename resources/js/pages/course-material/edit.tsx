import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import CourseMaterialForm, { iCourseMaterialForm } from "./component/form";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { iCourseMaterial } from "@/types";

export default function EditCourseMaterial({
    course_id,
    course_material_id,
    course_topic_id,
    organization_id,
    course_material
}: {
    organization_id: number;
    course_id: number;
    course_topic_id: number;
    course_material_id: number;
    course_material: iCourseMaterial
}) {
    const form = useForm<Required<iCourseMaterialForm>>({
        content: course_material.content,
        description: course_material.description,
        title: course_material.title
    })
    const { patch } = form

    function submitUpdate() {
        patch(route('storeCourseMaterialUpdate', {
            id: organization_id,
            course_id,
            course_topic_id,
            course_material_id
        }))
    }

    return (
        <AppLayout>
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Course Material</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CourseMaterialForm
                            form={form}
                            onSubmit={() => { }}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={submitUpdate}>
                            Save
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    )
}