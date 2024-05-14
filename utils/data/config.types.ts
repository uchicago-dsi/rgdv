import * as d3 from "d3"
import { d3Bivariate } from "./service/types"

export interface BaseColumnSchema {
  name: string
  description: string
}
export interface BinsSchema extends BaseColumnSchema {
  column: string | number
  colorScheme?: keyof typeof d3
  nBins?: number
  reversed?: boolean
  manualBreaks?: Array<number>
  range?: "continuous" | "categorical"
}

export interface BivariateBinsSchema extends BaseColumnSchema {
  column: Array<string | number>
  columnLabels?: Array<string>
  reversed?: Array<boolean>
  colorScheme?: keyof typeof d3Bivariate
  manualBreaks?: Array<Array<number>>
}

export type ColumnConfig =
  | ({
      bivariate: true
    } & BivariateBinsSchema)
  | ({
      bivariate: false
    } & BinsSchema)

export type Columns = Record<string, ColumnConfig>

export type ColumnGroups<T extends Record<any, any>> = Record<
  string,
  {
    description: string
    columns: Array<keyof T>
  }
>
