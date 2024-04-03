import defaultConfig from "./config"
import { DataConfig } from "./config.types"
import { DuckDBDataProtocol, type AsyncDuckDB, type AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
import { getDuckDb, runQuery } from "utils/duckdb"
import * as d3 from "d3"
import tinycolor from "tinycolor2"

export class DataService {
  config: DataConfig[]
  data: Record<string, Record<string, Record<string | number, number>>> = {}
  complete: Array<string> = []
  eagerData: Array<string> = []
  completeCallback?: (s: string) => void
  hasRunWasm: boolean = false
  dbStatus: "none" | "loading" | "loaded" | "error" = "none"
  db?: AsyncDuckDB
  baseURL: string = window.location.origin
  conn?: AsyncDuckDBConnection
  tooltipResults: any = {}

  constructor(completeCallback?: (s: string) => void, config: DataConfig[] = defaultConfig) {
    this.config = config
    this.completeCallback = completeCallback
  }

  initData() {
    const eagerData = this.config.filter((c) => c.eager)
    eagerData.forEach((c) => this.registerData(c))
  }

  async waitForDb() {
    if (this.dbStatus === "loaded") {
      return
    }
    while (this.dbStatus === "loading") {
      await new Promise((r) => setTimeout(r, 100))
    }
  }
  async initDb() {
    if (this.dbStatus === "loaded") {
      return
    } else if (this.dbStatus === "loading") {
      return this.waitForDb()
    }
    this.dbStatus = "loading"
    this.db = await getDuckDb()
    this.conn = await this.db.connect()
    this.dbStatus = "loaded"
  }

  backgroundDataLoad() {
    if (this.complete.length === this.config.length) {
      const remainingData = this.config.filter((c) => !this.complete.includes(c.filename))
      remainingData.forEach((c) => this.registerData(c))
    }
  }

  async registerData(config: DataConfig) {
    if (this.complete.includes(config.filename)) {
      return
    }
    await this.initDb()
    await this.db!.registerFileURL(
      config.filename,
      `${this.baseURL}/${config.filename}`,
      DuckDBDataProtocol.HTTP,
      false
    )
    if (this.completeCallback) {
      this.completeCallback(config.filename)
    }
    this.complete.push(config.filename)
  }

  getFromQueryString(filename: string) {
    if (this.complete.includes(filename)) {
      return `'${filename}'`
    } else {
      return `'${this.baseURL}/${filename}'`
    }
  }

  async runQuery(query: string, freshConn?: boolean) {
    await this.initDb()
    try {
      const conn = freshConn ? await this.db!.connect() : this.conn!
      const r =  await runQuery({
        conn,
        query,
      })
      if (freshConn) {
        await conn.close()
      }
      return r
    } catch (e) {
      console.error(e)
      return []
    }
  }
  async getQuantiles(column: string | number, table: string, n: number, idCol: string, filter?: string): Promise<Array<number>> {
    // breakpoints to use for quantile breaks
    // eg. n=5 - 0.2, 0.4, 0.6, 0.8 - 4 breaks
    // eg. n=4 - 0.25, 0.5, 0.75 - 3 breaks
    const quantileFractions = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n)
    let query = `SELECT 
      ${quantileFractions.map((f, i) => `round(approx_quantile("${column}", ${f}), 3) as break${i}`)}
      FROM ${this.getFromQueryString(table)}
    `
    if (filter) {
      query += ` WHERE "${idCol}" LIKE '${filter}%';`
    } else {
      query += ";"
    }
    const result = await this.runQuery(query)
    if (!result || result.length === 0) {
      console.error(`No results for quantile query: ${query}`)
      return []
    }
    // @ts-ignore
    return Object.values(result[0]) as Array<number>
  }
  async getColorValues(
    idColumn: string,
    colorScheme: string,
    reversed: boolean,
    column: string | number,
    table: string,
    n: number,
    filter?: string
  ) {
    // @ts-ignore
    const d3Colors = d3[colorScheme]?.[n]
    if (!d3Colors) {
      console.error(`Color scheme ${colorScheme} with ${n} bins not found`)
      return {
        colorMap: {},
        breaks: [],
        colors: [],
      }
    }
    let rgbColors = d3Colors.map((c: any) => {
      const tc = tinycolor(c).toRgb()
      return [tc.r, tc.g, tc.b]
    })
    if (reversed) {
      rgbColors.reverse()
    }
    const quantiles = await this.getQuantiles(column, table, n, idColumn, filter)
    let query = `
      SELECT "${column}", "${idColumn}",
      CASE 
        ${quantiles.map((q, i) => `WHEN "${column}" < ${q} THEN [${rgbColors[i]}]`).join("\n")}
        WHEN "${column}" IS NULL THEN [120,120,120,0]
        ELSE [${rgbColors[rgbColors.length - 1]}]
        END as color
        FROM ${this.getFromQueryString(table)}
    `
    if (filter) {
      query += ` WHERE "${idColumn}" LIKE '${filter}%';`
    } else {
      query += ";"
    }
    // @ts-ignore
    const colorValues = await this.runQuery(query)
    const colorMap = {}
    for (let i = 0; i < colorValues.length; i++) {
      // @ts-expect-error
      colorMap[colorValues[i][idColumn]] = colorValues[i].color.toJSON()
    }
    return {
      colorMap,
      breaks: quantiles,
      colors: rgbColors,
    }
  }

  async getTooltipValues(
    id: string
  ) {
    if (this.tooltipResults[id]) {
      return this.tooltipResults[id]
    }
    let data: any[] = []
    for (let i = 0; i < this.config.length; i++) {
      const c = this.config[i]
      if (!c) {
        continue
      }

      const query = `SELECT "${c.columns.map(spec => spec.column).join('","')}" FROM ${this.getFromQueryString(c.filename)} WHERE "${c.id}" = '${id}'`
      const result = await this.runQuery(query, true)
      data.push(result[0])
    }
    const mappedTooltipContent = this.config.map((c,i) => {
      const dataOutput = {
      header: c.name,
      }
      if (!data[i]) {
        return dataOutput
      }
      const columns = JSON.parse(JSON.stringify(data![i]))
      if (columns) {
        c.columns.forEach((col) => {
          // @ts-ignore
          dataOutput[col.name] = columns[col.column]
        })
      }
      return dataOutput
    })
    this.tooltipResults[id] = mappedTooltipContent
  }

  setCompleteCallback(cb: (s: string) => void) {
    this.completeCallback = cb
    this.complete.forEach(cb)
  }
}

export const ds = new DataService()
