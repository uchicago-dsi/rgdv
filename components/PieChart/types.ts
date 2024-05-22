export type PieChartProps<T extends Record<string, any>> = {
  data: T[]
  dataKey: keyof T
  labelKey: keyof T
  minThreshold?: number
  tooltipFields?: Array<keyof T>
  tooltipFormatters?: Record<keyof T, any>
  
}