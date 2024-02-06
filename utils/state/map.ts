"use client"
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MapState {
  year: number
  breaks: Array<number>
  colors: Array<Array<number>>
}

const initialState: MapState = {
  year: 2021,
  breaks: [0, 1, 2, 3, 4, 5],
  colors: [[
    255, 255, 255, 0
  ]]
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
  },
})

// Action creators are generated for each case reducer function
export const { setYear, setBreaks, setColors } = mapSlice.actions

export default mapSlice.reducer