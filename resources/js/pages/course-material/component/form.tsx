import MagixTextEditor from "@/components/text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InertiaFormProps } from "@inertiajs/react";
import { Descendant } from "slate";

export interface iCourseMaterialForm {
    content: Array<Descendant>;
    title: string;
    description: string;
}

type iCourseMaterialIntertiaForm = InertiaFormProps<Required<iCourseMaterialForm>>

interface iCourseMaterialFormProps {
    form: iCourseMaterialIntertiaForm;
    onSubmit: () => void;
}


export default function CourseMaterialForm({ form }: iCourseMaterialFormProps) {
    const { data, setData } = form;
    return (
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
            <div>
                <Label>
                    Content
                </Label>
                <MagixTextEditor
                    initialValue={data.content}
                    onChange={(val) => {
                        setData('content', val)
                    }}
                />

            </div>
        </div>
    )
}