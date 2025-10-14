import MagixTextEditor from "@/components/text-editor";
import { Card } from "@/components/ui/card";
import useCourseEditor from "@/hooks/use-course-editor";
import { useForm } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { Descendant } from "slate";

export default function QuizDescriptionEditor() {
    const {
        selectedMaterial,
        updateCourseMaterial
    } = useCourseEditor()

    const {
        setData,
        data
    } = useForm<Required<{
        content: Array<Descendant>;
        description: string;
        title: string;
    }>>({
        content: selectedMaterial?.content || [],
        description: selectedMaterial?.description || '',
        title: selectedMaterial?.title || '',
    })

    function submitUpdate() {
        updateCourseMaterial({
            courseMaterialId: Number(selectedMaterial?.id),
            courseTopicId: Number(selectedMaterial?.course_topic_id),
            content: data.content,
            description: data.description,
            title: data.title
        })
    }

    return (
        <details className="accordion-item">
            <summary className="flex py-2 pr-2 gap-x-2 items-center  accordion-header justify-between">
                <div className="flex items-center gap-x-2">
                    <ChevronRight className="AccordionChevron" size={20} />
                    <p>Course Material Title</p>
                </div>
            </summary>
            <Card className="p-4">
                <div className="flex flex-col gap-y-2">
                    {/* <Label>Quiz Title</Label> */}
                    <input type="text" defaultValue={selectedMaterial?.title} />
                    <MagixTextEditor
                        key={selectedMaterial?.id}
                        onChange={(content) => { setData('content', content) }}
                        initialValue={data.content}
                        // editableClassName="min-h-screen"
                        withSaveButton
                        placeholder="Quiz Instruction"
                        onClickSave={submitUpdate}

                    />
                </div>
            </Card>

        </details>
    )
}