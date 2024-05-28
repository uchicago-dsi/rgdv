import { useEffect } from "react"
import { initializeDb } from "utils/state/thunks"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { columnsDict } from "utils/data/config"
import { globals } from "utils/state/globals"

export const useDataService = (
  id?: string
) => {
  const dispatch = useAppDispatch()
  const dbStatus = useAppSelector((state) => state.map.dbStatus)
  const filter = useAppSelector((state) => state.map.idFilter)
  const currentColumn = useAppSelector((state) => state.map.currentColumn)
  const currentColumnGroup = useAppSelector((state) => state.map.currentColumnGroup)
  const colorFilter = useAppSelector((state) => state.map.colorFilter)
  const currentCentroid = useAppSelector((state) => state.map.centroid)
  const currentColumnSpec = columnsDict[currentColumn]
  const isBivariate = currentColumnSpec?.bivariate || false
  const colorFunction = globals.colorFunction
  const highlightFunction = globals.highlightFunction
  const snapshot = useAppSelector((state) => state.map.snapshot)
  const _storeDataLoaded = useAppSelector((state) => state.map.storeDataId === id)
  const breaks = useAppSelector((state) => state.map.breaks)
  const colors = useAppSelector((state) => state.map.colors)
  const storeData = id ? globals.ds.storeListResults?.[id] || [] : []
  const storesHaveGeo = storeData.length > 0 && storeData[0].hasOwnProperty('STORE_LAT')
  const highlight = useAppSelector((state) => state.map.highlight)

  useEffect(() => {
    dbStatus === 'uninitialized' && dispatch(initializeDb())
  }, [dispatch])

  return {
    isReady: dbStatus === 'ready',
    currentColumn,
    colorFunction,
    highlightFunction,
    snapshot,
    colorFilter,
    breaks,
    colors,
    currentCentroid,
    currentColumnSpec,
    currentColumnGroup,
    filter,
    isBivariate,
    storeData,
    storesHaveGeo,
    highlight
  }
}
