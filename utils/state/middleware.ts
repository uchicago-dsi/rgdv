import { createListenerMiddleware } from "@reduxjs/toolkit"
import { mapSlice, setTooltipReady, setTimeSeriesLoaded } from "utils/state/map"
import { MapState } from "utils/state/types"
import { globals } from "./globals"
import { columnsDict } from "utils/data/config"
import { BivariateColorParamteres, MonovariateColorParamteres } from "utils/data/service/types"
import { loadTimeseriesData } from "./thunks"

// Create the middleware instance and methods
export const mapDataMiddleware = createListenerMiddleware<{ map: MapState }>()
mapDataMiddleware.startListening({
  // Can match against actions _or_ state changes/contents
  predicate: (action, currentState, previousState) => {
    const [columnChanged, idFilterChanged, dbStatusChanged] = [
      currentState.map.currentColumn !== previousState.map.currentColumn,
      currentState.map.idFilter !== previousState.map.idFilter,
      currentState.map.dbStatus !== previousState.map.dbStatus && currentState.map.dbStatus === "ready",
    ]
    return columnChanged || idFilterChanged || dbStatusChanged
  },
  // Listeners can have long-running async workflows
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState()
    const dispatch = listenerApi.dispatch
    const ds = globals.globalDs
    const columnConfig = columnsDict[state.map.currentColumn]
    const filter = state.map.idFilter
    if (!ds || !columnConfig) {
      return
    }
    // Spawn "child tasks" that can do more work and return results
    const task = listenerApi.fork(async (forkApi) => {
      // Can pause execution
      const _params = {
        ...columnConfig,
        filter
      } as unknown

      const colorParams = columnConfig.bivariate
        ? (_params as BivariateColorParamteres)
        : (_params as MonovariateColorParamteres)

      const colorResults = await ds.getColorValues(colorParams)
      if (!colorResults) {
        return null
      }
      const { colorMap, breaks, colors } = colorResults
      const colorFunction: (id: string | number) => Array<number> = (_id: string | number) => {
        const id = _id.toString()
        if (filter?.length && id.startsWith(filter) === false) {
          return [120, 120, 120, 0]
        }
        // @ts-ignore
        return colorMap?.[id] || [120, 120, 120, 0]
      }
      return {
        colorFunction,
        breaks,
        colors,
      }
    })

    // Unwrap the child result in the listener
    const result = await task.result
    if ("ok" == result.status && null !== result.value ) {
      globals.set({
        colorFunction: result.value.colorFunction,
      })
      const snapshot = performance.now()

      dispatch(mapSlice.actions.setMapBreaksColors({
        breaks: result.value.breaks,
        colors: result.value.colors,
        snapshot
      }))
    }
  },
})

mapDataMiddleware.startListening({
  // Can match against actions _or_ state changes/contents
  predicate: (action, currentState, previousState) => {
    return currentState.map.tooltip?.id !== previousState.map.tooltip?.id
  },
  // Listeners can have long-running async workflows
  effect: async (action, listenerApi) => {
    const id = (action as any).payload?.id as string
    const dispatch = listenerApi.dispatch
    // Spawn "child tasks" that can do more work and return results
    const task = listenerApi.fork(async (forkApi) => {
      if (!id) {
        return null
      }
      const tooltipInfo = await globals.globalDs.getTooltipValues(id)
      return true
    })

    // Unwrap the child result in the listener
    const result = await task.result
    if ("ok" == result.status && null !== result.value ) {
      dispatch(setTooltipReady(id))
    }
  },
})