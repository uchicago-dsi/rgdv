export type LegendProps = {
  title: string
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