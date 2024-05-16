import { type TinaMarkdownContent } from "tinacms/dist/rich-text"

export interface DataLockupProps {
    title: string
    tooltip: TinaMarkdownContent
    value: number
    description: TinaMarkdownContent[] | null
    border?: boolean
}