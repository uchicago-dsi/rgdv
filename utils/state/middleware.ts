import { createListenerMiddleware } from "@reduxjs/toolkit"
import { mapSlice, setTooltipReady, setTimeSeriesLoaded, setTooltipInfo } from "utils/state/map"
import { MapState } from "utils/state/types"
import { globals } from "./globals"
import { combinedHighlightConfig, columnsDict } from "utils/data/config"
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
    const ds = globals.ds
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
        filter,
      } as unknown

      const colorParams = columnConfig.bivariate
        ? (_params as BivariateColorParamteres)
        : (_params as MonovariateColorParamteres)
      const colorResults = await ds.getColorValues(colorParams)
      if (!colorResults) {
        return null
      }
      const { colorMap, breaks, colors } = colorResults
      const inFilterFn = !filter?.length
        ? (_id: any) => true
        : typeof filter === "string"
        ? (id: string) => id.startsWith(filter)
        : Array.isArray(filter)
        ? (id: string) => filter.some((f) => id.startsWith(f))
        : (_id: any) => true

      const colorFunction: (id: string | number) => Array<number> = (_id: string | number) => {
        const id = _id.toString()
        const isInSet = inFilterFn(id)
        if (!isInSet) {
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
    if ("ok" == result.status && null !== result.value) {
      globals.set({
        colorFunction: result.value.colorFunction,
      })

      dispatch(
        mapSlice.actions.setMapBreaksColors({
          breaks: result.value.breaks as number[],
          colors: result.value.colors,
        })
      )
    }
  },
})
mapDataMiddleware.startListening({
  // Can match against actions _or_ state changes/contents
  predicate: (action, currentState, previousState) => {
    const [highlightChanged, highlightThresholdChanged, highlightColorChanged] = [
      currentState.map.highlight !== previousState.map.highlight,
      currentState.map.highlightValue !== previousState.map.highlightValue,
      currentState.map.highlightColor !== previousState.map.highlightColor,
    ]
    return highlightChanged || highlightThresholdChanged || highlightColorChanged
  },
  // Listeners can have long-running async workflows
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState()
    const dispatch = listenerApi.dispatch
    const ds = globals.ds
    // @ts-ignore
    const config = state?.map?.highlight && combinedHighlightConfig[state?.map?.highlight]
    const value = state.map.highlightValue as any
    if (!ds || !config) {
      return
    }

    // Spawn "child tasks" that can do more work and return results
    const task = listenerApi.fork(async (forkApi) => {
      // Can pause execution
      const type = config.type
      await ds.getHighlightValues(config.column, value, config.type)
      const data = globals.ds.highlightResult
      const activeColor = state.map.highlightColor || [255, 0, 255]
      const nullColor = [0, 0, 0, 0]
      const highlightFunction: (id: string | number) => Array<number> = (_id: string | number) => {
        const id = _id.toString()
        if (data?.[id]) {
          return activeColor
        } else {
          return nullColor
        }
      }
      return {
        highlightFunction,
      }
    })

    // Unwrap the child result in the listener
    const result = await task.result
    if ("ok" == result.status && null !== result.value) {
      globals.set({
        highlightFunction: result.value.highlightFunction,
      })
      dispatch(mapSlice.actions.setSnapshot("highlight"))
    }
  },
})

mapDataMiddleware.startListening({
  // Can match against actions _or_ state changes/contents
  predicate: (action, currentState, previousState) => {
    return (
      currentState.map.tooltip?.id !== previousState.map.tooltip?.id ||
      currentState.map.clicked?.id !== previousState.map.clicked?.id
    )
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
      await globals.ds.getTooltipValues(id)
      return true
    })

    // Unwrap the child result in the listener
    const result = await task.result
    if ("ok" == result.status && null !== result.value) {
      dispatch(setTooltipReady(id))
    }
  },
})
