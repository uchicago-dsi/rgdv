"use client"
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { columnGroups, defaultColumn, defaultColumnGroup, defaultYear } from "utils/data/config"
import { DataService } from "utils/data/service/service"

export interface MapState {
  year: number
  breaks: Array<number>
  colors: Array<Array<number>>
  completeData: Array<string>
  // currentData: string,
  currentColumn: string | number
  currentColumnGroup: keyof typeof columnGroups
  idFilter?: string
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
      if (!columnGroup?.columns.includes(`${state.currentColumn}`) && columnGroup.columns.length > 0) {
        state.currentColumn = columnGroup.columns[0]!
      }
    },
    setCurrentColumn: (state, action: PayloadAction<string | number>) => {
      state.currentColumn = action.payload
    },
    setTooltipInfo: (state, action: PayloadAction<{ x: number; y: number; id: string } | null>) => {
      state.tooltip = action.payload
    },
    setCurrentFilter: (state, action: PayloadAction<string>) => {
      state.idFilter = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setYear, setBreaks, setColors, setCurrentColumn, setTooltipInfo, setCurrentData, setCurrentFilter } =
  mapSlice.actions

export default mapSlice.reducer
