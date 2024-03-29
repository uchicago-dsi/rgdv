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

  async runQuery(query: string) {
    await this.initDb()
    try {
      return await runQuery({
        conn: this.conn!,
        query,
      })
    } catch (e) {
      console.error(e)
      return []
    }
  }
  async getQuantiles(column: string | number, table: string, n: number): Promise<Array<number>> {
    // breakpoints to use for quantile breaks
    // eg. n=5 - 0.2, 0.4, 0.6, 0.8 - 4 breaks
    // eg. n=4 - 0.25, 0.5, 0.75 - 3 breaks
    const quantileFractions = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n)
    const query = `SELECT 
      ${quantileFractions.map((f, i) => `approx_quantile("${column}", ${f}) as break${i}`)}
      FROM ${this.getFromQueryString(table)};
    `
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
    n: number
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
    const quantiles = await this.getQuantiles(column, table, n)
    const query = `
      SELECT "${column}", "${idColumn}",
      CASE 
        ${quantiles.map((q, i) => `WHEN "${column}" < ${q} THEN [${rgbColors[i]}]`).join("\n")}
        ELSE [${rgbColors[rgbColors.length - 1]}]
        END as color
        FROM ${this.getFromQueryString(table)};
    `
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

  ingestData(data: Array<any>, config: DataConfig, dataStore: any) {
    console.log(config, data[0])
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      if (!row?.[config.id]) {
        console.error(`Row ${i} in ${config.filename} is missing a valid id`)
        continue
      }
      let id = `${row[config.id]}`
      // if (id.length === 10) {
      //   id = `0${id}`
      // }
      dataStore[id] = {
        ...row,
        id,
      }
      // @ts-ignore
    }
    console.log("All done!")
    if (this.completeCallback) {
      this.completeCallback(config.filename)
    }
    this.complete.push(config.filename)
  }
  async fetchData(config: DataConfig) {
    if (this.complete.includes(config.filename)) {
      return
    }
    await this.initDb()
    const dataStore = this.data[config.filename]
    if (this.data[config.filename]) {
      // console.error(`Data store already exists for ${config.filename}`);
      return
    }
    this.data[config.filename] = {}
  }

  setCompleteCallback(cb: (s: string) => void) {
    this.completeCallback = cb
    this.complete.forEach(cb)
  }
}

export const ds = new DataService()
