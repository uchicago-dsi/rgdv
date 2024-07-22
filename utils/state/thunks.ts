import { createAsyncThunk } from "@reduxjs/toolkit"
import { getDuckDB } from "duckdb-wasm-kit"
import { DataService, dataTableName } from "utils/data/service/service"
import { idColumn, summaryTractFile, timeSeriesDatasets } from "utils/data/config"
import { globals } from "utils/state/globals"
import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
import { timeSeriesConfig } from "utils/data/config"

export const fetchCentroidById = createAsyncThunk("map/setCentroid", async (id: string) => {
  if (id === null) {
    return {
      centroid: [-98.5833, 39.8333],
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

export const initializeDb = createAsyncThunk("map/initDb", async () => {
  if (globals.ready) {
    return "ready"
  }
  const [db, buffer] = await Promise.all([
    getDuckDB(),
    fetch(`${window.location.origin}/data/${summaryTractFile}`).then((r) => r.arrayBuffer()),
  ])

  const dataArray = new Uint8Array(buffer)

  const [_, conn] = await Promise.all([
    db.registerFileBuffer(dataTableName, dataArray),
    db.connect() as unknown as AsyncDuckDBConnection,
  ])

  globals.set({
    conn,
    db,
    ds: new DataService(conn, idColumn),
    ready: true,
  })
  return "ready"
})

export const loadTimeseriesData = createAsyncThunk(
  "map/loadTimeseriesData",
  async (dataset: keyof typeof timeSeriesConfig) => {
    const file = timeSeriesConfig[dataset].file
    const buffer = await fetch(`${window.location.origin}/data/${file}`).then((r) => r.arrayBuffer())
    const dataArray = new Uint8Array(buffer)
    await globals.db.registerFileBuffer(file, dataArray)
    return dataset
  }
)

export const fetchStoreData = createAsyncThunk("map/fetchStoreData", async (id: string) => {
  if (globals.ds.storeListResults[id]) {
    return id
  }
  const response = await fetch(`/api/stores/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch store data")
  }
  const data = (await response.json()) as any
  globals.ds.storeListResults[id] = data
  return id
})
