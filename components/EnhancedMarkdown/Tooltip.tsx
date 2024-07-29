"use client"
import Tooltip from "components/Tooltip"
import { useState } from "react"
import { useClientMdxContent } from "hooks/useClientMdxContent"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export const MdTooltip: React.FC<{ tooltipKey?: string; body?: any }> = ({ tooltipKey, body }) => {
  const [open, setOpen] = useState(false)
  const handleToggleOpen = () => setOpen((p) => !p)
  const content = useClientMdxContent("tooltips", `${tooltipKey}.mdx`, body)
  const innerContent = body ? body : content
  if (!innerContent) return null

  return (
    <Tooltip explainer={""} open={open} defaultOpen={false} onOpenChange={handleToggleOpen} withArrow={true}>
      <TinaMarkdown content={innerContent} />
    </Tooltip>
  )
}
