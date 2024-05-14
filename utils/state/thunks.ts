import { createAsyncThunk } from "@reduxjs/toolkit"
import { getDuckDB } from "duckdb-wasm-kit"
import { DataService } from "utils/data/service/service"
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
  const { db, conn } = await getDuckDB().then(async (db) => {
    const conn = await db.connect() as unknown as AsyncDuckDBConnection
    return {
      db,
      conn,
    }
  })
  await conn.query(`CREATE TABLE IF NOT EXISTS data 
      AS 
      SELECT * 
      FROM '${window.location.origin}/data/full_tract.parquet'`)

  globals.set({
    conn,
    db,
    ds: new DataService(conn, idColumn),
  })
  return "ready"
})
