"use client"
import React, { useState } from "react"
import * as Slider from "@radix-ui/react-slider"
import { SliderRangeProps } from "./types"
import * as Tooltip from "@radix-ui/react-tooltip"

const SliderRange: React.FC<SliderRangeProps> = ({
  onChange,
  min,
  max,
  step,
  value,
  title,
  formatter,
  showRange = false,
  showValue = false,
}) => {
  const [mouseInside, setMouseInside] = useState(false)

  const handleValueChange = (values: number[]) => {
    if (values.length === 1) {
      onChange([values[0]!])
    } else if (values.length === 2) {
      onChange([values[0]!, values[1]!])
    }
  }

  return (
    <form
      className="relative flex flex-col items-center"
      onMouseEnter={() => setMouseInside(true)}
      onMouseLeave={() => setMouseInside(false)}
      onTouchStart={() => setMouseInside(true)}
      onTouchEnd={() => setMouseInside(false)}
    >
      {showRange && (
        <div className="mb-1 flex w-full justify-between text-xs text-neutral-500">
          <span>{formatter ? formatter(min) : min}</span>
          <span>{formatter ? formatter(max) : max}</span>
        </div>
      )}
      <Slider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={handleValueChange}
      >
        <Slider.Track className="relative h-[3px] grow rounded-full bg-neutral-300">
          <Slider.Range className="absolute h-full rounded-full bg-primary-500" />
        </Slider.Track>{" "}
        <Tooltip.Provider>
          <Tooltip.Root open={mouseInside}>
            <Tooltip.Trigger asChild>
              <Slider.Thumb
                className="block h-5 w-5 rounded-[10px] bg-primary-500 shadow-[0_2px_10px] shadow-blackA4 hover:bg-primary-900 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
                aria-label="Minimum"
              />
            </Tooltip.Trigger>
            {showValue && (
              <Tooltip.Content side="top" align="center" className="rounded bg-black px-2 py-1 text-xs text-white">
                {formatter ? formatter(value[0]) : value[0]}
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            )}
          </Tooltip.Root>
          {value.length === 2 && (
            <Tooltip.Root open={mouseInside}>
              <Tooltip.Trigger asChild>
                <Slider.Thumb
                  className="block h-5 w-5 rounded-[10px] bg-primary-500 shadow-[0_2px_10px] shadow-blackA4 hover:bg-primary-900 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
                  aria-label="Maximum"
                />
              </Tooltip.Trigger>
              {showValue && (
                <Tooltip.Content side="top" align="center" className="rounded bg-black px-2 py-1 text-xs text-white">
                  {formatter ? formatter(value[1]) : value[1]}
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              )}
            </Tooltip.Root>
          )}
        </Tooltip.Provider>
      </Slider.Root>
    </form>
  )
}

export default SliderRange
