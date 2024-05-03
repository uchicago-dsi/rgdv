import { MapState } from "utils/state/map"

export type LegendBreakTextProps = {
  breaks: number[]
  index: number
  colors: number[][]
  onClick?: (color: number[], index?: number) => void
  colorFilter?: MapState["colorFilter"]
}
