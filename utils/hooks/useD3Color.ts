import * as d3 from "d3"
import { useMemo } from "react"
import tinycolor from "tinycolor2"

export type ColorHook = (props: {
  data: any
  column: string | number
  colorScheme: string
  idColumn: string
  reversed?: boolean
  currentFilter?: string
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
  colorFunc: (d: Record<any, any>) => Array<number>
  breaks: number[]
  colors: Array<Array<number>>
}

// @ts-ignore
export const useD3Color: ColorHook = ({
  data,
  column,
  colorScheme,
  breaksSchema,
  reversed,
  idColumn,
  currentFilter,
}) => {
  const out = useMemo(() => {
    let breaks: number[] = []
    if (breaksSchema.type === "manual") {
      breaks = breaksSchema.breaks
    }
    if (breaksSchema.type === "quantile") {
      let values = [];
      const keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof typeof data
        const row = data[key]
        if (currentFilter?.length && row.id.startsWith(currentFilter) === false) {
          continue
        } 
        values.push(row[column])
      }
      values = values.sort((a, b) => a - b)
      breaks = []
      const nBreakpoints = breaksSchema.nBins
      for (let i = 1; i < nBreakpoints; i++) {
        // @ts-ignore
        breaks.push(Math.round(d3.quantileSorted(values, i / nBreakpoints) * 100) / 100)
      }
    }
    // @ts-ignore
    const nBins = breaksSchema?.nBins || breaksSchema?.breaks?.length

    // @ts-ignore
    let colors = d3[colorScheme][nBins]?.map((c) => {
      const tc = tinycolor(c).toRgb()
      return [tc.r, tc.g, tc.b]
    })
    if (reversed) {
      colors.reverse()
    }
    // @ts-ignore
    const innerColorFn = d3.scaleThreshold().domain(breaks).range(colors)
    const colorFunc = (d: Record<string | number, any>) => {
      const id = d.id
      if (currentFilter?.length && id.startsWith(currentFilter) === false) {
        return [120, 120, 120, 0]
      }
      const val = d[column]
      if (val === undefined || val === null || isNaN(val)) {
        return [120, 120, 120, 0]
      }
      return innerColorFn(d[column])
    }

    return {
      colorFunc,
      breaks,
      colors,
    }
  }, [data, column, colorScheme, breaksSchema])

  return out
}
