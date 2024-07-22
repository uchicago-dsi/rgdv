export interface SliderRangeProps {
  onChange: (result: [number] | [number, number]) => void
  min: number
  max: number
  step: number
  value: [number] | [number, number]
  formatter?: (value: number) => string
  title?: string
  showRange?: boolean
  showValue?: boolean
  inverse?: boolean
}
