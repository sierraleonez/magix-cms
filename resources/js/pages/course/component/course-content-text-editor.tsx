import MagixTextEditor from "@/components/text-editor";
import { iCourseMaterial } from "@/types";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

interface iEditCourseMaterialFormProps {
    courseMaterial: iCourseMaterial;
    organizationId: number;
    courseId: number;
}

export default function EditCourseMaterialForm({ courseMaterial, courseId, organizationId }: iEditCourseMaterialFormProps) {
    const { data, setData, patch } = useForm<Required<Pick<iCourseMaterial, "content" | "title" | "description">>>({
        content: courseMaterial.content,
        description: courseMaterial.description,
        title: courseMaterial.title
    })

    function submitUpdate() {
        patch(route('storeCourseMaterialUpdate', {
            id: organizationId,
            course_id: courseId,
            course_topic_id: courseMaterial.course_topic_id,
            course_material_id: courseMaterial.id
        }), {
            onSuccess: () => {
                toast('Update success')
            }
        })
    }

    return (
        <div>
            <div className="py-3">
                <input
                    className="flex text-lg font-bold w-full"
                    value={data.title}
                    onChange={e => {
                        setData('title', e.currentTarget.value)
                    }}
                    onBlur={() => {
                        const isTitleUpdated = data.title !== courseMaterial.title
                        if (data.title && isTitleUpdated) {
                            submitUpdate()
                        }
                    }}
                />
            </div>
            <MagixTextEditor
                key={courseMaterial.id}
                onChange={(content) => { setData('content', content) }}
                initialValue={data.content}
                editableClassName="min-h-screen"
                withSaveButton
                onClickSave={submitUpdate}
            />

        </div>
    )

}