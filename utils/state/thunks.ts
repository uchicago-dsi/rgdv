import { createAsyncThunk } from "@reduxjs/toolkit"
import { getDuckDB } from "duckdb-wasm-kit"
import { DataService, dataTableName } from "utils/data/service/service"
import { idColumn } from "utils/data/config"
import { globals } from "utils/state/globals"
import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"

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
  if (globals.globalConn) {
    return "ready"
  }
  const [db, buffer] = await Promise.all([
    getDuckDB(),
    fetch(`${window.location.origin}/data/full_tract.parquet`).then((r) => r.arrayBuffer()),
  ])
  
  const dataArray = new Uint8Array(buffer)
  await db.registerFileBuffer(dataTableName, dataArray)
  const conn = (await db.connect()) as unknown as AsyncDuckDBConnection

  globals.set({
    conn,
    db,
    ds: new DataService(conn, idColumn),
  })
  return "ready"
})
