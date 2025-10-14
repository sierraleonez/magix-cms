import MagixTextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Descendant } from "slate";


interface iCreateCourseMaterialForm {
    content: Array<Descendant>;
    title: string;
    description: string;
}

interface iCreateCourseMaterialProps {
    organization_id: number;
    course_id: number;
    course_topic_id: number;
}

export default function CreateCourseMaterial({ organization_id, course_id, course_topic_id }: iCreateCourseMaterialProps) {
    const { data, setData, post } = useForm<Required<iCreateCourseMaterialForm>>({
        content: [{
            type: 'paragraph',
            children: [
                { text: '' }
            ]
        }],
        title: '',
        description: ''
    })

    function onClickSubmit() {
        post(route('storeCourseMaterial', {
            id: organization_id,
            course_id,
            course_topic_id
        }), {
            onSuccess() {
                toast('Create material success')
            }
        })
    }

    return (
        <AppLayout>
            <div className="p-4">

                <Card>
                    <CardHeader>
                        <CardTitle>Create Course Material</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col gap-y-4">
                            <div>
                                <Label>
                                    Title
                                </Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />

                            </div>
                            <div>
                                <Label>
                                    Description
                                </Label>
                                <Input
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />

                            </div>

                            <MagixTextEditor
                                initialValue={data.content}
                                onChange={(val) => {
                                    setData('content', val)
                                }}
                            />
                        </div>

                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button onClick={onClickSubmit}>
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </AppLayout>
    )
}

