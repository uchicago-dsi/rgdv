"use client"
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import config from 'utils/data/config'
import { DataService } from 'utils/data/service'

export interface MapState {
  year: number
  breaks: Array<number>
  colors: Array<Array<number>>
  completeData: Array<string>
  currentData: string,
  currentColumn: string | number
  tooltip: {
    x: number,
    y: number,
    id: string,
  } | null
}

const initialState: MapState = {
  year: 2021,
  breaks: [0, 1, 2, 3, 4, 5],
  colors: [[
    255, 255, 255, 0
  ]],
  completeData: [],
  currentData: 'data/concentration_metrics_wide_ds.csv',
  currentColumn: 2021,
  tooltip: null
}

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setYear: (state, action: PayloadAction<number>) => {
      console.log('setYear', action.payload)
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
      state.currentData = action.payload
      const dataConfig = config.find(c => c.filename === action.payload)
      if (!dataConfig?.columns?.[0]) {
        return
      }
      if (state.currentColumn === '' || !dataConfig?.columns.find(c => c.name === state.currentColumn)) {
        state.currentColumn = dataConfig.columns[0].name
      }
    },
    setCurrentColumn: (state, action: PayloadAction<string|number>) => {
      state.currentColumn = action.payload
    },
    setTooltipInfo: (state, action: PayloadAction<{x: number, y: number, id: string}|null>) => {
      state.tooltip = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setYear, setBreaks, setColors, setCurrentColumn, setTooltipInfo } = mapSlice.actions

export default mapSlice.reducer