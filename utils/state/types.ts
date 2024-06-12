import { DataColumns, columnGroups, columnsDict, combinedHighlightConfig, timeSeriesConfig, timeSeriesDatasets } from "utils/data/config"

export interface MapState {
  breaks: Array<number>
  colors: Array<Array<number>>
  dbStatus?: 'uninitialized' | 'loading' | 'ready' | 'error'
  // currentData: string,
  currentColumn: DataColumns
  currentColumnGroup: keyof typeof columnGroups
  idFilter?: string
  centroid?: {
    x: number
    y: number
    z: number
  }
  colorFilter?: Array<Array<number>>
  tooltip: {
    x: number
    y: number
    id: string
    data?: TooltipData
  } | null
  clicked?: {
    id: string,
    data?: TooltipData
  } | null
  tooltipStatus?: "pending" | "ready"
  snapshot: Record<string,number>
  timeseriesRequested: boolean
  timeseriesDatasets: Array<keyof typeof timeSeriesConfig>
  currentTimeseriesDataset?: timeSeriesDatasets
  storeDataId?: string
  highlight?: keyof typeof combinedHighlightConfig
  highlightValue?: readonly [number, number] | readonly (number|string)[]
  highlightColor?: [number, number, number]
}

export type TooltipData = Array<{
  section: string
  columns: Array<{ label: string; col: string; data: string | number }>
}>
