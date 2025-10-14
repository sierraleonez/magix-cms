import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/ui/sidebar";
import AppLayout from "@/layouts/app-layout";
import { iCourseMaterials, iCourseTopic } from "@/types";
import { useForm } from "@inertiajs/react";
import { ChevronRight, Plus } from "lucide-react";

interface iShowCourseTopicProps {
    course_materials: iCourseMaterials;
    course_topic: iCourseTopic;
    organization_id: number;
}

export default function ShowCourseTopic({ course_materials, course_topic, organization_id }: iShowCourseTopicProps) {
    const { get } = useForm()
    const courseTopicId = course_topic.id
    const courseId = course_topic.course_id
    console.log(course_topic)
    function redirectToCreateCourseMaterial() {
        get(route('createCourseMaterial', {
            id: organization_id,
            course_id: courseId,
            course_topic_id: courseTopicId
        }))
    }


    function redirectToShowCourseMaterial(courseMaterialId: number) {
        get(route('showCourseMaterial', {
            id: organization_id,
            course_id: courseId,
            course_topic_id: courseTopicId,
            course_material_id: courseMaterialId
        }))
    }

    return (
        <AppLayout>
            <div className="flex-1">
                <div className="flex flex-col gap-y-2 p-3 bg-card-foreground w-[300px] h-full text-secondary">
                    <div className="py-2">
                        <p>Course Title</p>
                        <p>Course Description</p>
                    </div>
                    <Separator />
                    <div>
                        <details className="accordion-item">
                            <summary className="flex py-2 items-center accordion-header">
                                <ChevronRight className="AccordionChevron" size={20} />
                                Course Topic
                            </summary>

                            <div className="accordion-content px-4">
                                <div>
                                    Course Material
                                </div>
                                <div>
                                    Course Material
                                </div>
                                <div>
                                    Course Material
                                </div>
                            </div>
                        </details>


                    </div>
                </div>
                <div>

                </div>
            </div>
            {/* <div className="flex flex-col p-4 gap-y-3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {course_topic.name}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Course Materials

                            <Button onClick={redirectToCreateCourseMaterial}>
                                <Plus />
                            </Button>
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col gap-y-2">
                            {
                                course_materials.map((material) => (
                                    <Card onClick={() => redirectToShowCourseMaterial(material.id)} >
                                        <CardHeader>
                                            <CardTitle>
                                                {material.title}
                                            </CardTitle>
                                            <CardDescription>
                                                {material.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))
                            }
                        </div>
                    </CardContent>
                </Card>
            </div> */}
        </AppLayout>
    )
}