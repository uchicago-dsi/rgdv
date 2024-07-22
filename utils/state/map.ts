"use client"
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import {
  DataColumns,
  columnGroups,
  columnsDict,
  defaultColumn,
  defaultColumnGroup,
  defaultTimeseriesDataset,
  combinedHighlightConfig,
  timeSeriesConfig,
  timeSeriesDatasets,
} from "utils/data/config"
import { fetchCentroidById, fetchStoreData, initializeDb, loadTimeseriesData } from "utils/state/thunks"
import { MapState } from "./types"
import { globals } from "./globals"
import tinycolor from "tinycolor2"

const initialState: MapState = {
  dbStatus: "uninitialized",
  currentColumn: defaultColumn,
  currentColumnGroup: defaultColumnGroup,
  tooltip: null,
  idFilter: undefined,
  colorFilter: undefined,
  snapshot: {},
  breaks: [],
  colors: [],
  tooltipStatus: undefined,
  clicked: undefined,
  timeseriesDatasets: [],
  timeseriesRequested: false,
  currentTimeseriesDataset: defaultTimeseriesDataset,
  storeDataId: undefined,
  highlight: undefined,
  highlightValue: undefined,
  highlightColor: undefined,
}

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setBreaks: (state, action: PayloadAction<Array<number>>) => {
      state.breaks = action.payload
    },
    setCurrentId: (state, action: PayloadAction<string>) => {
      state.storeDataId = action.payload
    },
    setColors: (state, action: PayloadAction<Array<Array<number>>>) => {
      state.colors = action.payload
    },
    setCurrentColumnGroup: (state, action: PayloadAction<keyof typeof columnGroups>) => {
      const columnGroup = columnGroups[action.payload]
      if (!columnGroup) {
        return
      }
      state.currentColumnGroup = action.payload
      state.colorFilter = undefined
      if (!columnGroup?.columns.includes(`${state.currentColumn}`) && columnGroup.columns.length > 0) {
        state.currentColumn = columnGroup.columns[0]!
      }
    },
    setCurrentColumn: (state, action: PayloadAction<DataColumns>) => {
      state.currentColumn = action.payload
      state.colorFilter = undefined
    },
    setHighlight: (state, action: PayloadAction<MapState["highlight"]>) => {
      if (action.payload) {
        state.highlight = action.payload
        // @ts-ignore
        const config = combinedHighlightConfig[action.payload]
        state.highlightValue = config.default as any
        if (config.color) {
          const tcColor = tinycolor(config.color)
          if (!tcColor.isValid()) {
            throw new Error(`Invalid color: ${config.color}`)
          }
          const tcRgb = tcColor.toRgb()
          state.highlightColor = [tcRgb.r, tcRgb.g, tcRgb.b]
        } else {
          state.highlightColor = [255, 255, 0]
        }
      } else {
        state.highlight = undefined
        state.highlightValue = undefined
      }
    },
    setHighlightValue: (state, action: PayloadAction<MapState["highlightValue"]>) => {
      state.highlightValue = action.payload as any
    },
    setHighlightColor: (state, action: PayloadAction<string>) => {
      const tcColor = tinycolor(action.payload)
      if (!tcColor.isValid()) {
        throw new Error(`Invalid color: ${action.payload}`)
      }
      const tcRgb = tcColor.toRgb()
      state.highlightColor = [tcRgb.r, tcRgb.g, tcRgb.b]
    },
    requestTimeseries: (state, action: PayloadAction<boolean>) => {
      state.timeseriesRequested = true
    },
    setTimeSeriesLoaded: (state, action: PayloadAction<keyof typeof timeSeriesConfig>) => {
      state.timeseriesDatasets.push(action.payload)
    },
    setTooltipInfo: (state, action: PayloadAction<Partial<MapState["tooltip"]> | null>) => {
      if (action.payload === null) {
        state.tooltip = null
        state.tooltipStatus = undefined
        return
      }

      state.tooltip = {
        x: action?.payload?.x || state.tooltip?.x || 0,
        y: action?.payload?.y || state.tooltip?.y || 0,
        id: action?.payload?.id || "",
      }
      const id = action?.payload?.id
      if (action?.payload?.data) {
        // chill
      } else if (!!id && !globals?.ds?.tooltipResults?.[id]) {
        state.tooltipStatus = "pending"
      } else {
        state.tooltipStatus = "ready"
      }
    },

    setClickInfo: (state, action: PayloadAction<MapState["clicked"] | null>) => {
      state.clicked = action?.payload
      const id = action?.payload?.id
      if (action?.payload?.data) {
        // chill
      } else if (!!id && !globals?.ds?.tooltipResults?.[id]) {
        state.tooltipStatus = "pending"
      } else {
        state.tooltipStatus = "ready"
      }
    },
    setTooltipReady: (state, action: PayloadAction<string>) => {
      if (state.tooltip?.id === action.payload) {
        state.tooltipStatus = "ready"
      }
    },
    setCurrentFilter: (state, action: PayloadAction<string>) => {
      state.idFilter = action.payload
    },
    upcertColorFilter: (state, action: PayloadAction<number[]>) => {
      state.snapshot.fill = performance.now()
      if (!state.colorFilter) {
        state.colorFilter = [action.payload]
        return
      } else {
        const idx = state.colorFilter.findIndex(
          (f) => f[0] === action.payload[0] && f[1] === action.payload[1] && f[2] === action.payload[2]
        )
        if (idx === -1) {
          state.colorFilter.push(action.payload)
        } else {
          state.colorFilter.splice(idx, 1)
        }
      }
    },
    setMapBreaksColors: (
      state,
      action: PayloadAction<{
        breaks: number[]
        colors: number[][]
      }>
    ) => {
      state.breaks = action.payload.breaks
      state.colors = action.payload.colors
      state.snapshot.fill = performance.now()
    },
    setSnapshot: (state, action: PayloadAction<string>) => {
      state.snapshot[action.payload] = performance.now()
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCentroidById.pending, (state, action) => {
      state.idFilter = action.meta.arg
    }),
      builder.addCase(fetchCentroidById.fulfilled, (state, action) => {
        state.centroid = {
          x: action.payload.centroid[0],
          y: action.payload.centroid[1],
          z: action.payload.zoom!,
        }
      }),
      builder.addCase(initializeDb.pending, (state) => {
        state.dbStatus = "loading"
      }),
      builder.addCase(initializeDb.fulfilled, (state, action) => {
        state.dbStatus = action.payload as MapState["dbStatus"]
      }),
      builder.addCase(loadTimeseriesData.fulfilled, (state, action) => {
        state.timeseriesDatasets.push(action.meta.arg)
      }),
      builder.addCase(fetchStoreData.fulfilled, (state, action) => {
        state.storeDataId = action.meta.arg
      })
  },
})

// Action creators are generated for each case reducer function
export const {
  setBreaks,
  setColors,
  setCurrentColumn,
  setTooltipInfo,
  setTooltipReady,
  setCurrentFilter,
  setCurrentColumnGroup,
  upcertColorFilter,
  requestTimeseries,
  setTimeSeriesLoaded,
  setHighlight,
  setHighlightValue,
  setHighlightColor,
  setClickInfo,
} = mapSlice.actions

export default mapSlice.reducer
