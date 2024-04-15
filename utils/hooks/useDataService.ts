import { useCallback, useEffect, useMemo } from "react"
import { ds } from "utils/data/service"
import { mapSlice } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { useMapColor } from "./useD3Color"
import config from "utils/data/config"


export const useDataService = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    ds.setCompleteCallback((s) => {
      dispatch(mapSlice.actions.setComplete(s))
    })
    ds.initData()
  }, [dispatch])

  const completeData = useAppSelector((state) => state.map.completeData)
  const currentData = useAppSelector((state) => state.map.currentData)
  const currentFilter = useAppSelector((state) => state.map.idFilter)
  const setCurrentData = (d: string) => {
    dispatch(mapSlice.actions.setCurrentData(d))
  }
  const currentColumn = useAppSelector((state) => state.map.currentColumn)
  const currentDataSpec = config.find(f => f.filename == currentData)

  const currentColumnSpec = currentDataSpec?.columns?.find((f) => f.column === currentColumn)
  const data = ds.data[currentData]
  const isReady = completeData.includes(currentData)
  const manualBreaks = currentColumnSpec?.manualBreaks || currentDataSpec?.manualBreaks
  const colorScheme = currentColumnSpec?.colorScheme || currentDataSpec?.colorScheme || "schemeYlOrRd"
  const reversed = currentColumnSpec?.reversed || currentDataSpec?.reversed || false
  const nBins = currentColumnSpec?.nBins || currentDataSpec?.nBins || 5
  
  const { colorFunc, breaks, colors } = useMapColor({
    table: currentDataSpec?.filename!,
    column: currentColumn,
    idColumn: currentDataSpec?.id || "GEOID",
    colorScheme,
    reversed,
    currentFilter,
    breaksSchema: manualBreaks ? {
      type: "manual",
      breaks: manualBreaks
    } : {
      type: "quantile",
      nBins
    }
  })
  
  return {
    testfn: () => {},
    ds,
    isReady,
    data,
    currentColumn,
    colorFunc,
    breaks,
    colors,
    currentDataSpec,
    currentColumnSpec,
    currentFilter,
    setCurrentData
  }
}
