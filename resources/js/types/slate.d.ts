// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'


type EditorElements = 'paragraph' | 'image'

type CustomElement = ImageElement | ParagraphElement
type CustomText = {
    text: string;
}

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: CustomElement
        Text: CustomText
    }
}

export interface RenderElementProps {
    children: any
    element: CustomElement
    attributes: {
        'data-slate-node': 'element'
        'data-slate-inline'?: true
        'data-slate-void'?: true
        dir?: 'rtl'
        ref: any
    }
}

export type RenderElementPropsFor<T> = RenderElementProps & {
    element: T
}

export type EmptyText = {
    text: string
}

export type ImageElement = {
    type: 'image'
    url: string
    children: EmptyText[]
}

export type ParagraphElement = {
    type: 'paragraph'
    align?: string
    children: Descendant[]
}

export type iCustomEditor = BaseEditor &
    ReactEditor &
{
    nodeToDecorations?: Map<Element, Range[]>
}