export interface BarChartProps<T extends Record<string, any>> {
  barData: T[]
  sameYScale: boolean
  startCol: keyof T
  endCol: keyof T
  height1Col: keyof T
  height2Col?: keyof T
}
