import { PointerEvent, useCallback, useMemo, useState } from "react";
import { BaseEditor, createEditor, Descendant, Editor, Transforms } from "slate";
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, useFocused, useSelected, useSlate, useSlateStatic, withReact } from "slate-react";
import { Card } from "../ui/card";
import { Bold, Italic, Save, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { IMAGE_EXTENSIONS } from "@/constants/image-extensions";
import { iCustomEditor, ImageElement, ParagraphElement, RenderElementPropsFor } from "@/types/slate";
import axios from "axios";
import SlateImage from "./image";
import MagixPopover from "../popover";
import { v4 } from 'uuid'

const CustomEditor = {
    isBoldMarkActive(editor: ReactEditor) {
        const marks = Editor.marks(editor)
        return marks ? marks?.bold === true : false
    },
    isItalicMarkActive(editor: ReactEditor) {
        const marks = Editor.marks(editor)
        return marks ? marks?.italic === true : false
    },
    toggleBoldMark(editor: ReactEditor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'bold')
        } else {
            Editor.addMark(editor, 'bold', true)
        }
    },
    toggleItalicMark(editor: ReactEditor) {
        const isActive = CustomEditor.isItalicMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'italic')
        } else {
            Editor.addMark(editor, 'italic', true)
        }
    },


}

interface iMagixTextEditorProps {
    initialValue: Array<Descendant>;
    onChange: (val: Array<Descendant>) => void;
    onClickSave?: () => void;
    withToolbar?: boolean
    readOnly?: boolean;
    editableClassName?: string;
    withSaveButton?: boolean;
    placeholder?: string
}

export default function MagixTextEditor({
    initialValue,
    onChange,
    onClickSave,
    editableClassName = "",
    placeholder = "",
    readOnly = false,
    withSaveButton = false,
    withToolbar = true
}: iMagixTextEditorProps) {
    const id = useMemo(() => {
        return v4()
    }, [])

    const editor = useMemo(() => withImages(
        withReact(
            createEditor()
        )
    ), [])

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'image':
                return <SlateImage {...props} />
            default:
                return <DefaultElement {...props} />
        }

    }, [])

    return (
        <div>
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={value => {
                    const isAstChange = editor.operations.some(
                        op => 'set_selection' !== op.type
                    )
                    if (isAstChange) {
                        onChange(value)
                    }
                }}
            >
                {
                    withToolbar && (
                        <Toolbar
                            editor={editor}
                            key={id}
                            labelId={id}
                            withSaveButton={withSaveButton}
                            onClickSave={onClickSave}
                        />
                    )
                }
                <Editable
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={
                        cn(
                            "border border-border p-4 min-h-[100px] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus:outline-none rounded-b-lg",
                            editableClassName
                        )}
                    renderElement={renderElement}
                    renderLeaf={Leaf}
                />
            </Slate>
        </div>
    )
}

interface iTextEditorToolbarProps {
    withSaveButton?: boolean;
    onClickSave?: () => void;
    editor: iCustomEditor;
    labelId: string;
}

function Toolbar({ editor, labelId, onClickSave = () => { }, withSaveButton = false }: iTextEditorToolbarProps) {
    return (
        <div className="bg-card p-3 border border-border border-solid rounded-t-lg">
            <div className="flex justify-between">
                <div className="flex gap-x-2 items-center">
                    <div
                        onClick={(e) => {
                            e.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                        }}
                        className={cn(["hover:bg-chart-1 py-1 px-2 rounded-sm active:bg-chart-1 content-center", CustomEditor.isBoldMarkActive(editor) ? "bg-chart-1" : ""])}
                    >
                        <Bold size={16} />
                    </div>
                    <div
                        onClick={(e) => {
                            e.preventDefault()
                            CustomEditor.toggleItalicMark(editor)
                        }}
                        className={cn(["hover:bg-chart-1 py-1 px-2 rounded-sm active:bg-chart-1 content-center", CustomEditor.isItalicMarkActive(editor) ? "bg-chart-1" : ""])}
                    >
                        <Italic size={16} />
                    </div>
                    <MagixPopover
                        items={[
                            {
                                title: 'Upload from device',
                                value: '',
                                onClick: () => {
                                    const targetId = `file-input-${labelId}`
                                    document.getElementById(targetId)?.click()
                                }
                            },
                            {
                                title: 'Enter image URL',
                                value: '',
                                onClick: () => { }
                            },
                        ]}
                    >

                        <div
                            className={cn(["hover:bg-chart-1 py-1 px-2 rounded-sm active:bg-chart-1 content-center"])}
                        >
                            <ImageIcon
                                size={16}

                            />
                        </div>
                    </MagixPopover>

                    <input
                        className="hidden"
                        type="file"
                        onChange={async (e) => {
                            const file = (e.target.files?.[0])
                            if (file) {
                                const publicUrl = await uploadImage(file)
                                insertImage(editor, publicUrl)
                            }
                        }}
                        id={`file-input-${labelId}`}
                    />



                </div>
                {
                    withSaveButton && (
                        <div className="justify-self-end">
                            <Button onClick={onClickSave}>
                                <Save />
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const DefaultElement = (props: RenderElementProps) => {
    return <p {...props?.attributes}>{props?.children}</p>
}

const Leaf = (props: RenderLeafProps) => {
    const isBold = props?.leaf?.bold
    const isItalic = props?.leaf?.italic
    return (
        <span
            {...props?.attributes}
            style={{
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal'
            }}
        >
            {props?.children}
        </span>
    )
}



const withImages = (editor: iCustomEditor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', async () => {
                        const publicUrl = await uploadImage(file)
                        insertImage(editor, publicUrl)
                    })

                    reader.readAsDataURL(file)

                }
            })

        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

async function uploadImage(file: File) {
    const data = new FormData()
    data.append('image', file)

    const res = await axios.postForm(
        route('uploadImage'),
        data
    )
    const serverUrl = res.data?.url

    return serverUrl
}

const insertImage = (editor: iCustomEditor, url: string) => {
    const text = { text: '' }
    const image: ImageElement = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
    const paragraph: ParagraphElement = {
        type: 'paragraph',
        children: [{ text: '' }],
    }
    Transforms.insertNodes(editor, paragraph)
}

const isImageUrl = (url: string): boolean => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return IMAGE_EXTENSIONS.includes(ext!)
}

function isUrl(url: string) {
    return URL.canParse(url)
}