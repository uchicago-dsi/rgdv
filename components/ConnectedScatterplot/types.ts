// Generic interface for data points
export interface ConnectedScatterplotProps<T> {
  pointsData: T[]
  xKey: keyof T
  yKey: keyof T
  linesData?: T[][]
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  parentRef?: React.RefObject<HTMLDivElement>
}
