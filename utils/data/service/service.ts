import { dataConfig } from "../config"
import { DataConfig, DataRecord } from "../config.types"
import { DuckDBDataProtocol, type AsyncDuckDB, type AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
import { getDuckDb, runQuery } from "utils/duckdb"
import * as d3 from "d3"
import tinycolor from "tinycolor2"
import { BivariateColorParamteres, MonovariateColorParamteres, d3Bivariate } from "./types"

// 2000 to 2021
const fullYears = new Array(22).fill(0).map((_, i) => 2000 + i)

const timeseriesQueries = {
  "data/gravity_no_dollar_pivoted.parquet": {
    query: `SELECT
    median("2000") as "2000",
    median("2010") as "2010",
    median("2020") as "2020",
  from "data/gravity_dollar_pivoted.parquet" `,
    name: "Gravity (No Dollar Stores)",
  },

  "data/concentration_metrics_wide.parquet": {
    query: `SELECT
    ${fullYears.map((y) => `median("${y}") as "${y}"`).join(",\n")}
    from "data/concentration_metrics_wide.parquet" `,
    name: "Concentration Metrics (No Dollar Stores)",
  },
} as const

export class DataService {
  config: DataConfig
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

  constructor(completeCallback?: (s: string) => void, config: DataConfig = dataConfig) {
    this.config = config
    this.completeCallback = completeCallback
  }

  initData() {
    const eagerData = Object.entries(this.config).filter(([k, v]) => v.eager)
    eagerData.forEach(([k, v]) => this.registerData(k, v))
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
    if (this.complete.length === Object.keys(this.config).length) {
      const remainingData = Object.entries(this.config).filter(([k, v]) => !this.complete.includes(k))
      remainingData.forEach(([k, v]) => this.registerData(k, v))
    }
  }

  async registerData(name: string, config: DataRecord) {
    if (this.complete.includes(name)) {
      return
    }
    await this.initDb()
    await this.db!.registerFileURL(name, `${this.baseURL}/${config.filename}`, DuckDBDataProtocol.HTTP, false)
    if (this.completeCallback) {
      this.completeCallback(name)
    }
    this.complete.push(name)
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
      const r = await runQuery({
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

  async getUniqueValues(
    column: string | number,
    table: string,
    idCol: string,
    filter?: string
  ): Promise<Array<number>> {
    let query = `SELECT DISTINCT "${column}" FROM ${this.getFromQueryString(table)}`
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
  async getQuantiles(
    column: string | number,
    table: string,
    n: number,
    idCol: string,
    filter?: string
  ): Promise<Array<number>> {
    // breakpoints to use for quantile breaks
    // eg. n=5 - 0.2, 0.4, 0.6, 0.8 - 4 breaks
    // eg. n=4 - 0.25, 0.5, 0.75 - 3 breaks
    const quantileFractions = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n)
    let query = `SELECT 
      ${quantileFractions.map((f, i) => `round(approx_quantile(${column}, ${f}), 3) as break${i}`)}
      FROM ${this.getFromQueryString(table)}
    `
    if (filter) {
      query += ` WHERE ${idCol} LIKE '${filter}%';`
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

  getQuantileCaseClause(column: string | number, quantiles: Array<number>, valueName: string, _values?: Array<string | number>) {
    if (quantiles.length === 0) {
      return
    }
    const values = _values || [...quantiles.map((_, i) => i), quantiles.length]

    let query = `CASE `

    for (let i = 0; i < quantiles.length; i++) {
      query += ` WHEN ${column} < ${quantiles[i]} THEN ${values[i]} `
    }
    query += ` ELSE ${values[values.length - 1]} END as ${valueName}`
    return query
  }
  getBivariateCaseClause(columns: [string, string], colors: Array<Array<number>>) {
    let query = `CASE `
    query += "\n"
    query += `WHEN ${columns[0]} IS NULL and ${columns[1]} IS NULL THEN [120,120,120,0]`
    query += "\n"
    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors![i]!.length; j++) {
        query += ` WHEN ${columns[0]} = ${i} AND ${columns[1]} = ${j} THEN [${colors[i]![j]}]`
        query += "\n"
      }
    }
    query += ` ELSE [120,120,120,0] END as color`
    return query
  }

  async getBivariateColorValues({ idColumn, colorScheme, column, table, filter }: BivariateColorParamteres) {
    if (idColumn.length !== 2 || column.length !== 2 || table.length !== 2) {
      console.error(
        `Invalid Bivariate Color Values request: ${idColumn}, ${colorScheme}, ${column}, ${table}, ${filter}`
      )
      return
    }
    const cleanColumns = column.map((c) => typeof c === 'string' && c.startsWith('"') ? c : `"${c}"`)

    const colors = d3Bivariate[colorScheme]?.map((row: any) =>
      row.map((c: any) => {
        const tc = tinycolor(c).toRgb()
        return [tc.r, tc.g, tc.b]
      })
    )
    // map breaks values
    // always 1 less than desired breaks
    // eg quartiles = 0.25, 0.5, 0.75
    // for use less than value is that quantile
    const breaks = await Promise.all(
      table.map((t, i) => this.getQuantiles(cleanColumns[i]!, t, 3, idColumn[i]!, filter?.[i]))
    )
    let query = `SELECT t0.${idColumn[0]}, `
    query += `${this.getQuantileCaseClause(`t0.${cleanColumns[0]}`, breaks![0]!, "q0")}, `
    query += `${this.getQuantileCaseClause(`t1.${cleanColumns[1]}`, breaks![1]!, "q1")}, `
    query += `${this.getBivariateCaseClause(["q0", "q1"], colors)}`
    query += ` FROM ${this.getFromQueryString(table[0]!)} t0`
    query += ` JOIN ${this.getFromQueryString(table[1]!)} t1 ON t0.${idColumn[0]} = t1.${idColumn[1]}`
    // query += ";"
    const colorValues = await this.runQuery(query)
    const colorMap = {}
    for (let i = 0; i < colorValues.length; i++) {
      // @ts-expect-error
      colorMap[colorValues[i][idColumn[0]]] = colorValues[i].color.toJSON()
    }
    debugger;
    return {
      colorMap,
      breaks: breaks,
      colors,
    }
  }

  async getMonovariateColorValues({
    idColumn,
    colorScheme,
    column,
    table,
    nBins,
    reversed,
    filter,
    range,
  }: MonovariateColorParamteres) {
    const cleanColumn = typeof column === "string" ? column : `"${column}"`
    // @ts-ignore
    const d3Colors = d3[colorScheme]?.[nBins]
    if (!d3Colors) {
      console.error(`Color scheme ${colorScheme} with ${nBins} bins not found`)
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
    const values =
      range === "categorical"
        ? await this.getUniqueValues(cleanColumn, table, idColumn, filter)
        : await this.getQuantiles(cleanColumn, table, nBins, idColumn, filter)
    let query = ``
    if (!range || range === "continuous") {
      query += `SELECT ${cleanColumn}, ${idColumn}, `
      query += this.getQuantileCaseClause(
        cleanColumn,
        values,
        "color",
        rgbColors.map((v: any) => `[${v}]`)
      )
      query += ` FROM ${this.getFromQueryString(table)}`
    } else {
      query += `
      SELECT ${cleanColumn}, ${idColumn},
      CASE 
        ${values.map((q, i) => `WHEN ${column} = ${q} THEN [${rgbColors[i]}]`).join("\n")}
        WHEN ${column} IS NULL THEN [120,120,120,0]
        ELSE [${rgbColors[rgbColors.length - 1]}]
        END as color
        FROM ${this.getFromQueryString(table)}
    `
    }
    if (filter) {
      query += ` WHERE ${idColumn} LIKE '${filter}%';`
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
      breaks: values,
      colors: rgbColors,
    }
  }
  async getColorValues(
    props:
      | ({ bivariate: false } & {
          bivariate: boolean
          idColumn: string
          colorScheme: string
          column: string | number
          table: string
          nBins: number
          reversed?: boolean
          filter?: string
          range?: "continuous" | "categorical"
        })
      | ({ bivariate: true } & {
          idColumn: string[]
          colorScheme: keyof typeof d3Bivariate
          column: Array<string | number>
          table: string[]
          filter?: string
          [key: string]: any
        })
  ) {
    const bivariate = props.bivariate
    if (bivariate) {
      const { idColumn, table, column, colorScheme, filter } = props as BivariateColorParamteres
      // @ts-ignore
      return this.getBivariateColorValues({ idColumn, colorScheme, column, table, filter })
    } else {
      const { idColumn, colorScheme, reversed, column, table, nBins, filter, range } = props as MonovariateColorParamteres
      // @ts-ignore
      return this.getMonovariateColorValues({ idColumn, colorScheme, column, table, nBins, reversed, filter, range })
    }
  }

  async getTooltipValues(id: string) {
    // if (this.tooltipResults[id]) {
    //   return this.tooltipResults[id]
    // }
    // let data: any[] = []
    // for (let i = 0; i < this.config.length; i++) {
    //   const c = this.config[i]
    //   if (!c) {
    //     continue
    //   }
    //   if (!c.columns?.length) {
    //     continue
    //   }
    //   const query = `SELECT "${c.columns.map((spec) => spec.column).join('","')}" FROM ${this.getFromQueryString(
    //     c.filename
    //   )} WHERE "${c.id}" = '${id}'`
    //   const result = await this.runQuery(query, true)
    //   data.push(result[0])
    // }
    // const mappedTooltipContent = this.config.map((c, i) => {
    //   const dataOutput = {
    //     header: c.name,
    //   }
    //   if (!data[i]) {
    //     return dataOutput
    //   }
    //   const columns = JSON.parse(JSON.stringify(data![i]))
    //   if (columns) {
    //     c.columns.forEach((col) => {
    //       // @ts-ignore
    //       dataOutput[col.name] = columns[col.column]
    //     })
    //   }
    //   return dataOutput
    // })
    // this.tooltipResults[id] = mappedTooltipContent
  }

  async getTimeseries(id: string) {
    //   if (this.tooltipResults[id]) {
    //     return this.tooltipResults[id]
    //   }
    //   let data: any = {}
    //   for (let i = 0; i < this.config.length; i++) {
    //     const c = this.config[i]
    //     // @ts-ignore
    //     const timeseriesConfig = timeseriesQueries[c.filename]
    //     if (!c || !timeseriesConfig) {
    //       continue
    //     }
    //     const query = `${timeseriesConfig["query"]} WHERE "${c.id}" LIKE '${id}%'`
    //     const result = await this.runQuery(query, true)
    //     const resultData = JSON.parse(JSON.stringify(result[0]))
    //     data[c.name] = resultData
    //   }
    //   const outData: Record<number, Record<string | number, string | number>> = {}
    //   const datasets = Object.keys(data)
    //   for (const dataset of datasets) {
    //     const currentData = data[dataset]
    //     for (const year of fullYears) {
    //       if (!outData[year]) {
    //         outData[year] = {
    //           year,
    //         }
    //       }
    //       if (currentData[year]) {
    //         outData[year]![dataset] = currentData[year]
    //       }
    //     }
    //   }
    //   return Object.values(outData)
  }

  setCompleteCallback(cb: (s: string) => void) {
    this.completeCallback = cb
    this.complete.forEach(cb)
  }
}
