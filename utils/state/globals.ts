import { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
import { AsyncDuckDB } from "duckdb-wasm-kit"
import { DataService } from "utils/data/service/service"
import { PrimaryData } from "utils/data/service/types"

class GlobalServices {
  _db?: AsyncDuckDB
  _conn?: AsyncDuckDBConnection
  _ds?: DataService<PrimaryData>
  _colorFunction: (id: string | number) => Array<number> = (_: string | number) => [120, 120, 120, 0]
  _highlightFunction: (id: string | number) => Array<number> = (_: string | number) => [120, 120, 120, 0]
  ready: boolean = false

  set(args: {
    conn?: AsyncDuckDBConnection
    db?: any
    ds?: DataService<PrimaryData>
    colorFunction?: (id: string | number) => Array<number>
    highlightFunction?: (id: string | number) => Array<number>
    ready?: boolean
  }) {
    for (const key in args) {
      // @ts-ignore
      this[`_${key}`] = args[key]
    }
  }
  
  get ds(){
    return this._ds! || {}
  }
  get db(){
    return this._db! || {}
  }
  get conn(){
    return this._conn! || {}
  }
  get colorFunction(){
    return this._colorFunction!
  }
  get highlightFunction(){
    return this._highlightFunction!
  }
}

export const globals = new GlobalServices()