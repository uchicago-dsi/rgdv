import { ColumnConfig } from "utils/data/config.types"

export type LegendProps = {
  column: ColumnConfig
} & (
  {
    isBivariate: true
  } & {
    colors: number[][][]
    breaks: number[][]
  }
  |
  {
    isBivariate: false
  } & {
    colors: number[][]
    breaks: number[]
  }
)