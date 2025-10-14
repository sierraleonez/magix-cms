import { ImageElement, RenderElementPropsFor } from "@/types/slate"
import { ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react"
import { Button } from "../ui/button"
import { PointerEvent } from "react"
import { Trash } from "lucide-react"
import { Transforms } from "slate"

const SlateImage = ({
    attributes,
    children,
    element,
}: RenderElementPropsFor<ImageElement>) => {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)
    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            {children}
            <div
                contentEditable={false}
                className="relative"
            >
                <img
                    src={element.url}
                    className={`block max-w-full max-h-[20em] ${selected && focused ? 'shadow-[0_0_0_3px_#B4D5FF]' : ''}`}
                />
                <Button
                    onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
                        event.preventDefault()
                    }}
                    onClick={() => Transforms.removeNodes(editor, { at: path })}
                    className={`${selected && focused ? 'inline' : 'hidden'} absolute top-2 left-2 bg-white`}
                >
                    <Trash />
                </Button>
            </div>
        </div>
    )
}

export default SlateImage