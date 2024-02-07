import * as d3 from "d3"
import { useMemo } from "react"
import tinycolor from 'tinycolor2'

export type ColorHook = (props: {
  data: any
  column: string | number
  colorScheme: string
  breaksSchema:
    | {
        type: "manual"
        breaks: Array<number>
      }
    | {
        type: "quantile"
        nBins: number
      }
}) => {
  colorFunc: (d: Record<any, any>) => Array<number>,
  breaks: number[],
  colors: Array<Array<number>>
}

// @ts-ignore
export const useD3Color: ColorHook = ({ data, column, colorScheme, breaksSchema }) => {
  const out = useMemo(() => {
    let breaks: number[] = []
    if (breaksSchema.type === "manual") {
      breaks = breaksSchema.breaks
    }
    if (breaksSchema.type === "quantile") {
      // @ts-ignore
      const keys = Object.keys(data)
      const values = keys
        .map((key: string | number) => data[key][column])
        .sort((a: number, b: number) => a - b) as number[]
      breaks = []
      const nBreakpoints = breaksSchema.nBins
      for (let i = 1; i < nBreakpoints; i++) {
        // @ts-ignore
        breaks.push(d3.quantileSorted(values, i / nBreakpoints))
      }
    }
    // @ts-ignore
    const nBins = breaksSchema?.nBins || breaksSchema?.breaks?.length
    const colors = d3.schemeYlOrRd[nBins]?.map(c => {
      const tc = tinycolor(c).toRgb()
      return [tc.r, tc.g, tc.b]
    })
    // @ts-ignore
    const innerColorFn = d3.scaleThreshold().domain(breaks).range(colors)
    const colorFunc = (d: Record<string | number, any>) => {
      return innerColorFn(d[column])
    }
    return {
      colorFunc,
      breaks,
      colors
    }
  }, [data, column, colorScheme, breaksSchema])

  return out
}
