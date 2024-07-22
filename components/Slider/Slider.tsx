"use client"
import * as Slider from "@radix-ui/react-slider"
import * as Tooltip from "@radix-ui/react-tooltip"
import React, { useState } from "react"
import { SliderRangeProps } from "./types"

const invertValues = (values: number[], max: number, direction: "forward" | "backward") => {
  if (direction === "forward") {
    return values.map((v) => max - v).sort((a, b) => a - b)
  } else {
    return values.map((v) => max - v).sort((a, b) => b - a)
  }
}

const SliderRange: React.FC<SliderRangeProps> = ({
  onChange,
  min,
  max,
  step,
  value,
  title,
  inverse,
  formatter,
  showRange = false,
  showValue = false,
}) => {
  const [mouseInside, setMouseInside] = useState(false)

  let innerValue = inverse ? invertValues(value, max, "forward") : value

  const handleValueChange = (values: number[]) => {
    if (values.length === 1) {
      onChange([values[0]!])
    } else if (values.length === 2) {
      const output = inverse ? invertValues(values, max, "backward") : values
      onChange([output[0]!, output[1]!])
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
      {title && <p className="mb-1 text-sm">{title}</p>}
      <div className="flex w-full flex-row items-center justify-around">
        {showRange && <p className="prose my-0 py-0 pr-4 text-xs">{formatter ? formatter(min) : min}</p>}

        <Slider.Root
          className="relative flex h-5 grow touch-none select-none items-center"
          min={min}
          max={max}
          step={step}
          value={innerValue}
          onValueChange={handleValueChange}
        >
          <Slider.Track className="relative h-[3px] grow rounded-full bg-neutral-300">
            <Slider.Range className="absolute h-full rounded-full bg-primary-500" />
          </Slider.Track>{" "}
          <Tooltip.Provider>
            <Tooltip.Root open={mouseInside}>
              <Tooltip.Trigger asChild>
                <Slider.Thumb
                  className="block size-5 rounded-[10px] bg-primary-500 shadow-[0_2px_10px] shadow-blackA4 hover:bg-primary-900 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
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
                    className="block size-5 rounded-[10px] bg-primary-500 shadow-[0_2px_10px] shadow-blackA4 hover:bg-primary-900 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
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

        {showRange && <p className="prose my-0 py-0 pl-4 text-xs">{formatter ? formatter(max) : max}</p>}
      </div>
    </form>
  )
}

export default SliderRange
