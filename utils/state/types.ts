import { columnGroups, columnsDict, timeSeriesConfig, timeSeriesDatasets } from "utils/data/config"

export interface MapState {
  breaks: Array<number>
  colors: Array<Array<number>>
  dbStatus?: string
  // currentData: string,
  currentColumn: keyof typeof columnsDict
  currentColumnGroup: keyof typeof columnGroups
  idFilter?: string
  centroid?: {
    x: number
    y: number
    z: number
  }
  colorFilter?: number[][]
  tooltip: {
    x: number
    y: number
    id: string
  } | null,
  tooltipStatus?: 'pending' | 'ready'
  snapshot: number
  timeseriesRequested: boolean
  timeseriesDatasets: Array<keyof typeof timeSeriesConfig>
  currentTimeseriesDataset?: timeSeriesDatasets
}