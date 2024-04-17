import * as RadixTooltip from "@radix-ui/react-tooltip"
import { cva, VariantProps } from "class-variance-authority"

export const tooltipContent = cva([], {
  variants: {
    intent: {
      primary: [
        "rounded-0.5md",
        "bg-white",
        "shadow-xl", 
        "border-2",
        "border-black",
        "font-serif", 
        "max-w-[80vw]",
        "w-72",
        "prose",
        "text-black"],
    },
    size: {
      sm: ["px-2.5", "py-1.5", "text-xs"],
      md: ["px-4", "py-2.5", "text-2xs"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
})

export const tooltipArrow = cva([], {
  variants: {
    intent: {
      primary: ["fill-zinc-700"],
    },
    size: {
      sm: ["w-2", "h-1"],
      md: ["w-4", "h-2"],
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
})

export interface TooltipProps extends VariantProps<typeof tooltipContent>, RadixTooltip.TooltipProps {
  explainer: React.ReactElement | string
  className?: string
  withArrow?: boolean
  side?: "top" | "right" | "bottom" | "left"
}
