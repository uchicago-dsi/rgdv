import * as d3 from "d3"
import { useEffect, useMemo, useState } from "react"
import tinycolor from "tinycolor2"
import { ds } from "utils/data/service"

export type ColorHook = (props: {
  table: string
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
export const useMapColor: ColorHook = ({
  table,
  column,
  colorScheme,
  breaksSchema,
  reversed,
  idColumn,
  currentFilter,
}) => {
  const [out, setOut] = useState<any>({
    colorFunc: () => [120, 120, 120, 0],
    breaks: [],
    colors: [],
  })

  useEffect(() => {
    const main = async () => {
      const { colorMap, breaks, colors } = await ds.getColorValues(
        idColumn,
        colorScheme,
        reversed || false,
        column,
        table,
        // @ts-ignore
        breaksSchema.nBins || 5
      )

      const colorFunc = (_id: string | number) => {
        const id = _id.toString()
        if (currentFilter?.length && id.startsWith(currentFilter) === false) {
          return [120, 120, 120, 0]
        }
        // @ts-ignore
        return colorMap?.[+id] || [120, 120, 120, 0]
      }
      setOut({
        colorFunc,
        breaks,
        colors,
      })
    }
    main()
  }, [table, column, colorScheme, JSON.stringify(breaksSchema.type)])
  return out
}
