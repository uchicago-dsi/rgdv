"use client"
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { columnGroups, columnsDict, defaultColumn, defaultColumnGroup} from "utils/data/config"
import { fetchCentroidById, initializeDb } from "utils/state/thunks"
import { MapState } from "./types"
import { globals } from "./globals"

const initialState: MapState = {
  dbStatus: "uninitialized",
  currentColumn: defaultColumn,
  currentColumnGroup: defaultColumnGroup,
  tooltip: null,
  idFilter: undefined,
  colorFilter: undefined,
  snapshot: 0,
  breaks: [],
  colors: [],
  tooltipStatus: undefined
}

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setBreaks: (state, action: PayloadAction<Array<number>>) => {
      state.breaks = action.payload
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
    setCurrentColumn: (state, action: PayloadAction<keyof typeof columnsDict>) => {
      state.currentColumn = action.payload
      state.colorFilter = undefined
    },
    setTooltipInfo: (state, action: PayloadAction<{ x: number; y: number; id: string } | null>) => {
      state.tooltip = action.payload
      const id = action.payload?.id
      if (!!id && !globals.globalDs.tooltipResults[id]) {
        state.tooltipStatus = 'pending'
      } else {
        state.tooltipStatus = 'ready'
      }
    },
    setTooltipReady: (state, action: PayloadAction<string>) => {
      if (state.tooltip?.id === action.payload) {
        state.tooltipStatus = 'ready'
      }
    },
    setCurrentFilter: (state, action: PayloadAction<string>) => {
      state.idFilter = action.payload
    },
    upcertColorFilter: (state, action: PayloadAction<number[]>) => {
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
        breaks: number[]; 
        colors: number[][]
        snapshot: number 
      }>
    ) => {
      state.snapshot = action.payload.snapshot
      state.breaks = action.payload.breaks
      state.colors = action.payload.colors
    }
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
        state.dbStatus = action.payload
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
} = mapSlice.actions

export default mapSlice.reducer
