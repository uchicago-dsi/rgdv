"use client"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import React from "react"
import { twMerge } from "tailwind-merge"
import { tooltipArrow, tooltipContent, TooltipProps } from "./types"
import { InfoCircledIcon } from "@radix-ui/react-icons"
export function Tooltip({
  explainer,
  open,
  defaultOpen,
  onOpenChange,
  intent,
  size,
  side = "top",
  className,
  withArrow,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} delayDuration={200}>
        <RadixTooltip.Trigger asChild className="mx-2">
          <InfoCircledIcon />
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={5}
            className={twMerge(tooltipContent({ intent, size, className }))}
          >
            {explainer}
            {withArrow ? <RadixTooltip.Arrow className={twMerge(tooltipArrow({ intent, size, className }))} /> : null}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
