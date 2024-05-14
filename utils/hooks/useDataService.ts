import { useEffect } from "react"
import { initializeDb } from "utils/state/thunks"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { columnsDict } from "utils/data/config"
import { globals } from "utils/state/globals"

export const useDataService = () => {
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
  const _snapshot = useAppSelector((state) => state.map.snapshot)
  const breaks = useAppSelector((state) => state.map.breaks)
  const colors = useAppSelector((state) => state.map.colors)
  
  useEffect(() => {
    dbStatus === 'uninitialized' && dispatch(initializeDb())
  }, [dispatch])

  return {
    isReady: dbStatus === 'ready',
    currentColumn,
    colorFunction,
    colorFilter,
    breaks,
    colors,
    currentCentroid,
    currentColumnSpec,
    currentColumnGroup,
    filter,
    isBivariate,
  }
}
