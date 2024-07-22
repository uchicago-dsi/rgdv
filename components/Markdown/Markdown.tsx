import { micromark } from "micromark"
import React from "react"
import { MarkdownProps } from "./types"

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: micromark(content) }} />
}

export default Markdown
