import { DataColumns } from "utils/data/config"

export interface Datum {
  [key: string]: number
}

export interface ScatterPlotProps<T extends Record<DataColumns, any>> {
  data: Array<T>
  xVar: DataColumns
  yVar: DataColumns
  showRegressionLine?: boolean
}

export interface ScatterPlotWrapperProps {
  id: string
  options: Array<DataColumns>
  initialXVar?: DataColumns
  initialYVar?: DataColumns
}
