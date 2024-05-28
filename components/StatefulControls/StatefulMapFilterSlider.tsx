"use client"
import { highlightConfig } from "utils/data/config"
import SliderRange from "../Slider/Slider"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { setHighlightValue } from "utils/state/map"
import { useEffect, useRef, useState } from "react"

export const StatefulHighlightForm = () => {
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const highlight = useAppSelector((state) => state.map.highlight)
  const _highlightValue = useAppSelector((state) => state.map.highlightValue)
  const highlightConfigValue = highlight && highlightConfig[highlight]
  const [innerValue, setInnerValue] = useState<[number] | [number, number]>([0, 0])

  useEffect(() => {
    if (_highlightValue && JSON.stringify(_highlightValue) !== JSON.stringify(innerValue)) {
      setInnerValue(_highlightValue as [number] | [number, number])
    }
  }, [_highlightValue])

  useEffect(() => {
    // debounced dispatch set highlight value
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (innerValue !== null) {
        dispatch(setHighlightValue(innerValue as readonly [number, number] | [number]))
      }
    }, 500)
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
    }
  }, [innerValue])

  if (!highlightConfigValue) {
    return null
  }

  if (highlightConfigValue.type === "continuous") {
    const highlightValue =
      _highlightValue?.length === 1 ? (_highlightValue as [number]) : (_highlightValue as [number, number])

    return (
      <SliderRange
        value={innerValue}
        min={highlightConfigValue.range[0]}
        max={highlightConfigValue.range[1]}
        step={highlightConfigValue?.step || 1}
        formatter={highlightConfigValue.formatter}
        showRange
        showValue
        onChange={setInnerValue}
      />
    )
  } else {
    return null
  }
}
