import { useEffect } from "react"
import { DataService } from "utils/data/service"
import { mapSlice } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { useD3Color } from "./useD3Color"
import config from "utils/data/config"

const ds = new DataService()

export const useDataService = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    ds.setCompleteCallback((s) => {
      dispatch(mapSlice.actions.setComplete(s))
    })
  }, [dispatch])
  const completeData = useAppSelector((state) => state.map.completeData)
  const currentData = useAppSelector((state) => state.map.currentData)
  const currentColumn = useAppSelector((state) => state.map.currentColumn)
  const currentDataSpec = config.find(f => f.filename == currentData)
  const currentColumnSpec = currentDataSpec?.columns?.find((f) => f.column === currentColumn)

  const data = ds.data[currentData]
  const isReady = completeData.includes(currentData)

  const { colorFunc, breaks, colors } = useD3Color({
    data,
    column: currentColumn,
    colorScheme: "interpolateRdYlBu",
    breaksSchema: {
      type: "quantile",
      nBins: 5,
    },
  })

  return {
    ds,
    isReady,
    data,
    currentColumn,
    colorFunc,
    breaks,
    colors,
    currentDataSpec,
    currentColumnSpec
  }
}