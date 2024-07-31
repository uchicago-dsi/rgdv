"use client"
import { useEffect, useRef, useState } from "react"
import { communityHighlightConfig, parentCompanyHighlightConfig } from "utils/data/config"
import { setHighlightValue } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import SliderRange from "../Slider/Slider"

const combinedConfig = {
  ...communityHighlightConfig,
  ...parentCompanyHighlightConfig,
}
export const StatefulHighlightForm = () => {
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const highlight = useAppSelector((state) => state.map.highlight)
  const _highlightValue = useAppSelector((state) => state.map.highlightValue)
  // @ts-ignore
  const highlightConfigValue = highlight && combinedConfig[highlight]
  const [innerValue, setInnerValue] = useState<[number] | [number, number]>([0, 0])

  useEffect(() => {
    if (_highlightValue && JSON.stringify(_highlightValue) !== JSON.stringify(innerValue)) {
      setInnerValue(_highlightValue as [number] | [number, number])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue])

  if (!highlightConfigValue) {
    return null
  }

  if (highlightConfigValue.type === "continuous") {
    // const highlightValue =
    //   _highlightValue?.length === 1 ? (_highlightValue as [number]) : (_highlightValue as [number, number])

    return (
      <>
        <p className="text-xs font-bold uppercase">Highlight: {highlight}</p>
        <SliderRange
          value={innerValue}
          min={highlightConfigValue.range[0]}
          max={highlightConfigValue.range[1]}
          step={highlightConfigValue?.step || 1}
          formatter={highlightConfigValue.formatter}
          inverse={(highlightConfigValue as any)?.inverse}
          showRange
          showValue
          onChange={setInnerValue}
        />
      </>
    )
  } else {
    return null
  }
}
