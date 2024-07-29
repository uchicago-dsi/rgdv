"use client"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import React from "react"
import { twMerge } from "tailwind-merge"
import { tooltipArrow, tooltipContent, TooltipProps } from "./types"

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
  children
}: TooltipProps) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} delayDuration={200}>
        <RadixTooltip.Trigger asChild className="mx-2 inline size-4 min-h-4 min-w-4">
          <InfoCircledIcon />
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={5}
            className={twMerge(tooltipContent({ intent, size, className })) + "max-h-96 max-w-xs overflow-auto text-xs"}
          >
            {explainer}
            {children}
            {withArrow ? <RadixTooltip.Arrow className={twMerge(tooltipArrow({ intent, size, className }))} /> : null}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
