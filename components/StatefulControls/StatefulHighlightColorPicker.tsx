import { useEffect, useRef, useState } from "react"
import tinycolor from "tinycolor2"
import { setHighlightColor } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"

export const StatefulHighlightColorPicker = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dispatch = useAppDispatch()
  const highlightColor = useAppSelector((state) => state.map.highlightColor)
  const highlightColorString = highlightColor ? `#${tinycolor({r: highlightColor[0], g: highlightColor[1], b:highlightColor[2]}).toHex()}` : "#000000"
  const [innerValue, setInnerValue] = useState<string>(highlightColorString)

  useEffect(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      dispatch(setHighlightColor(innerValue))
    }, 500)
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightColor])

  return <input type="color" value={innerValue} defaultValue={innerValue} onChange={(e) => setInnerValue(e.target.value)} />
}
