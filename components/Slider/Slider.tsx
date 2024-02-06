import React from "react"
import * as Slider from "@radix-ui/react-slider"
import "./styles.css"
export interface SliderProps {
  value: number[]
  onChange: (value: number[]) => void
  min: number
  max: number
  step: number
}

const SliderDemo: React.FC<SliderProps> = ({ value, onChange, min, max, step }) => (
  <form>
    <Slider.Root className="SliderRoot" defaultValue={value} onValueChange={onChange} min={min} max={max} step={step}>
      <Slider.Track className="SliderTrack">
        <Slider.Range className="SliderRange" />
      </Slider.Track>
      <Slider.Thumb className="SliderThumb" aria-label="Volume" />
    </Slider.Root>
  </form>
)

export default SliderDemo
