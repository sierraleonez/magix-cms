import { Descendant } from "slate"

const EDITOR_INITAL_VALUE: Array<Descendant> = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
        // text: ''
    },
]

export {
    EDITOR_INITAL_VALUE
}