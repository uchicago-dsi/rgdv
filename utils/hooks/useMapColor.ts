import { useEffect, useState } from "react"
import { ds } from "utils/data/service"
import { BivariateColorParamteres, MonovariateColorParamteres } from "utils/data/service/types"

export type ColorHook = (props: {
  table: string | string[]
  column: string | number | (string | number)[]
  colorScheme: string
  idColumn: string | string[]
  nbins?: number
  reversed?: boolean
  filter?: string
  bivariate: true | false
  breaksSchema:
    | {
        type: "manual"
        breaks: Array<number>
      }
    | {
        type: "quantile"
        nBins: number
      }
}, isReady: boolean) => {
  colorFunc: (d: Record<any, any>) => Array<number>
  breaks: number[]
  colors: Array<Array<number>>
}

export const useMapColor: ColorHook = (args,isReady) => {
  const [out, setOut] = useState<any>({
    colorFunc: () => [0, 0, 0, 0],
    breaks: [],
    colors: [],
  })
  const updateTrigger = JSON.stringify({
    t: args.table,
    c: args.column,
    cs: args.colorScheme,
    f: args.filter,
    b: args.nbins,
    isReady
  })

  useEffect(() => {
    const main = async () => {
      if (!isReady) {
        return
      }
      const colorParams = args.bivariate
        ? (args as BivariateColorParamteres)
        : (args as unknown as MonovariateColorParamteres)
      const colorResults = await ds.getColorValues(colorParams)
      if (!colorResults) {
        return
      }
      const { colorMap, breaks, colors } = colorResults

      const colorFunc = (_id: string | number) => {
        const id = _id.toString()
        if (args.filter?.length && id.startsWith(args.filter) === false) {
          return [120, 120, 120, 0]
        }
        // @ts-ignore
        return colorMap?.[id] || [120, 120, 120, 0]
      }
      setOut({
        colorFunc,
        breaks,
        colors,
      })
    }
    main()
  }, [updateTrigger])
  return out
}
