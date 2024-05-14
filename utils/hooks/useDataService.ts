import { useEffect } from "react"
import { ds } from "utils/data/service"
import { initializeDb, mapSlice } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { useMapColor } from "./useMapColor"
import { columnGroups, columnsDict } from "utils/data/config"
export const useDataService = () => {
  const dispatch = useAppDispatch()
  const dbStatus = useAppSelector((state) => state.map.dbStatus)

  // useEffect(() => {
  //   ds.setCompleteCallback((s) => {
  //     dispatch(mapSlice.actions.setComplete(s))
  //   })
  //   ds.initData()
  // }, [dispatch])

  useEffect(() => {
    dbStatus === 'uninitialized' && dispatch(initializeDb())
  }, [dispatch])
  

  const completeData = useAppSelector((state) => state.map.completeData)
  const filter = useAppSelector((state) => state.map.idFilter)
  const setCurrentData = (d: string) => {
    dispatch(mapSlice.actions.setCurrentData(d))
  }
  const currentColumn = useAppSelector((state) => state.map.currentColumn)
  const currentColumnGroup = useAppSelector((state) => state.map.currentColumnGroup)
  const colorFilter = useAppSelector((state) => state.map.colorFilter)
  const currentCentroid = useAppSelector((state) => state.map.centroid)
  // @ts-ignore
  const currentColumnSpec = columnsDict[currentColumn]!
  if (!currentColumnSpec) {
    throw new Error(`Invalid column ${currentColumn}`)
  }
  const currentData = currentColumnSpec?.bivariate ? currentColumnSpec.tables : currentColumnSpec.table
  const isReady = Array.isArray(currentData)
  // @ts-ignore
    ? currentData.every((t) => completeData.includes(t))
    : completeData.includes(currentData)
  const isBivariate = currentColumnSpec?.bivariate || false
  const column = currentColumnSpec.column
  const manualBreaks = isBivariate ? undefined : currentColumnSpec?.manualBreaks
  const colorScheme = currentColumnSpec?.colorScheme || "schemeYlOrRd"
  const reversed = currentColumnSpec?.reversed || false
  const nBins = isBivariate ? 3 : currentColumnSpec?.nBins || 5
  const table = currentColumnSpec?.bivariate ? currentColumnSpec?.tables : currentColumnSpec.table
  const idColumn = currentColumnSpec?.bivariate ? currentColumnSpec?.idColumns : currentColumnSpec.idColumn
  const { colorFunc, breaks, colors } = useMapColor(
    {
      bivariate: currentColumnSpec?.bivariate || false,
      table,
      column,
      idColumn,
      // @ts-ignore
      colorScheme,
      reversed,
      filter,
      nBins,
      // breaksSchema: manualBreaks ? {
      //   type: "manual",
      //   breaks: manualBreaks
      // } : {
      //   type: "quantile",
      //   nBins
      // }
    },
    isReady
  )
  // console.log(breaks, colors)

  return {
    testfn: () => {},
    ds,
    isReady,
    currentColumn,
    colorFunc,
    colorFilter,
    breaks,
    colors,
    currentCentroid,
    currentColumnSpec,
    currentColumnGroup,
    filter,
    setCurrentData,
    isBivariate,
  }
}
