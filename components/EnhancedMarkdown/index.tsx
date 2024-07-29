import React from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import PostWidget from "components/PostWidgets"
import { MdTooltip } from "./Tooltip"

const DEFAULT_MARKDOWN_COMPONENTS = {
  Tooltip: MdTooltip,
}

export const PostMarkdown: React.FC<{ content: any }> = ({ content }) => {
  return <EnhancedMarkdown components={{ PostWidget }} content={content} />
}

export const EnhancedMarkdown: React.FC<{ content: any; components?: any }> = ({ content, components = {} }) => {
  return <TinaMarkdown components={{ ...DEFAULT_MARKDOWN_COMPONENTS, ...components }} content={content} />
}
