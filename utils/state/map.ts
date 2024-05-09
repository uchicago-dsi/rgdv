"use client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { columnGroups, defaultColumn, defaultColumnGroup, defaultYear } from "utils/data/config"

export interface MapState {
  year: number
  breaks: Array<number>
  colors: Array<Array<number>>
  completeData: Array<string>
  // currentData: string,
  currentColumn: string | number
  currentColumnGroup: keyof typeof columnGroups
  idFilter?: string
  centroid?: {
    x: number
    y: number
    z: number
  }
  colorFilter?: number[][]
  tooltip: {
    x: number
    y: number
    id: string
  } | null
}

const initialState: MapState = {
  year: defaultYear,
  breaks: [0, 1, 2, 3, 4, 5],
  colors: [[255, 255, 255, 0]],
  completeData: [],
  // currentData: defaultData,

  currentColumn: defaultColumn,
  currentColumnGroup: defaultColumnGroup,
  tooltip: null,
  idFilter: undefined,
}

export const fetchCentroidById = createAsyncThunk("map/setCentroid", async (id: string) => {
  if (id === null) {
    return {
      centroid: [
        -98.5833,
        39.8333,
      ],
      id: null,
      zoom: 4,
    }
  }
  const response = await fetch(`/api/centroids/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch centroid")
  }
  const centroid = (await response.json()) as [number, number]
  const zoom = {
    2: 6,
    5: 8,
    11: 12,
  }[id.length]

  return {
    centroid,
    zoom,
    id,
  }
})

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload
    },
    setBreaks: (state, action: PayloadAction<Array<number>>) => {
      state.breaks = action.payload
    },
    setColors: (state, action: PayloadAction<Array<Array<number>>>) => {
      state.colors = action.payload
    },
    setComplete: (state, action: PayloadAction<string>) => {
      state.completeData.push(action.payload)
    },
    setCurrentData: (state, action: PayloadAction<string>) => {
      // state.currentData = action.payload
      // const dataConfig = config.find(c => c.filename === action.payload)
      // if (!dataConfig?.columns?.[0]) {
      //   return
      // }
      // if (state.currentColumn === '' || !dataConfig?.columns.find(c => c.column === state.currentColumn)) {
      //   state.currentColumn = dataConfig.columns[0].column
      // }
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
    setCurrentColumn: (state, action: PayloadAction<string | number>) => {
      state.currentColumn = action.payload
      state.colorFilter = undefined
    },
    setTooltipInfo: (state, action: PayloadAction<{ x: number; y: number; id: string } | null>) => {
      state.tooltip = action.payload
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
      // @ts-ignore
    })
  },
})

// Action creators are generated for each case reducer function
export const {
  setYear,
  setBreaks,
  setColors,
  setCurrentColumn,
  setTooltipInfo,
  setCurrentData,
  setCurrentFilter,
  setCurrentColumnGroup,
  upcertColorFilter,
} = mapSlice.actions

export default mapSlice.reducer
