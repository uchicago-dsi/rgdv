"use client"
import { columnsDict, timeSeriesConfig, tooltipConfig } from "../config"
import * as d3 from "d3"
import tinycolor from "tinycolor2"
import { BivariateColorParamteres, MonovariateColorParamteres, d3Bivariate } from "./types"
import { deepCompare2d1d } from "../compareArrayElements"
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
export class DataService<DataT extends Record<string, any>> {
  data: Record<string, Record<string, Record<string | number, number>>> = {}
  dbStatus: "none" | "loading" | "loaded" | "error" = "none"
  baseURL: string = window?.location?.origin || ""
  conn?: AsyncDuckDBConnection
  tooltipResults: any = {}
  timeseriesResults: any = {}
  _dataId: keyof DataT = "GEOID"
  idColumn: string

  constructor(conn: AsyncDuckDBConnection, idColumn: keyof DataT) {
    this.conn = conn
    this._dataId = idColumn
    this.idColumn = idColumn.toString()
  }

  async runQuery<QueryT extends any[]>(query: string, freshConn?: boolean) {
    try {
      if (!this.conn) {
        throw new Error("No connection")
      }
      const conn = this.conn!
      const r = await conn.query(query)
      const array = r.toArray()
      return array as QueryT
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getUniqueValues(column: string | number, filter?: string): Promise<Array<number>> {
    let query = `SELECT DISTINCT "${column}" FROM data`
    if (filter) {
      query += ` WHERE "${this.idColumn}" LIKE '${filter}%';`
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
  async getQuantiles(column: string | number, n: number, filter?: string): Promise<Array<number>> {
    // breakpoints to use for quantile breaks
    // eg. n=5 - 0.2, 0.4, 0.6, 0.8 - 4 breaks
    // eg. n=4 - 0.25, 0.5, 0.75 - 3 breaks
    const quantileFractions = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n)
    let query = `SELECT 
      ${quantileFractions.map((f, i) => `round(approx_quantile(${column}, ${f}), 3) as break${i}`)}
      FROM data
    `
    if (filter) {
      query += ` WHERE ${this.idColumn} LIKE '${filter}%';`
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

  getQuantileCaseClause(
    column: string | number,
    quantiles: Array<number>,
    valueName: string,
    _values?: Array<string | number>
  ) {
    if (quantiles.length === 0) {
      return
    }
    const values = _values || [...quantiles.map((_, i) => i), quantiles.length]

    let query = `\nCASE `

    for (let i = 0; i < quantiles.length; i++) {
      query += ` WHEN ${column} < ${quantiles[i]} THEN ${values[i]} `
    }
    query += ` ELSE ${values[values.length - 1]} END as ${valueName}`
    return query
  }
  getBivariateCaseClause(columns: [string, string], colors: Array<Array<number>>) {
    let query = `\nCASE `
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

  async getBivariateColorValues({ colorScheme, column, filter, reversed, colorFilter }: BivariateColorParamteres) {
    const cleanColumns = column.map((c) => (typeof c === "string" && c.startsWith('"') ? c : `"${c}"`))
    const legendColors = d3Bivariate[colorScheme]?.map((row: any) =>
      row.map((c: any) => {
        const tc = tinycolor(c).toRgb()
        return [tc.r, tc.g, tc.b]
      })
    )
    let colors = legendColors
    if (reversed?.[1]) {
      colors = legendColors.map((row: any) => row.slice().reverse())
    }

    if (colorFilter) {
      for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors[i].length; j++) {
          const color = colors[i][j]
          const isInFilter = deepCompare2d1d(colorFilter, color)
          if (!isInFilter) {
            colors[i][j] = [...color, 120]
          }
        }
      }
    }

    const breaks = await Promise.all([
      this.getQuantiles(cleanColumns[0]!, 3, filter),
      this.getQuantiles(cleanColumns[1]!, 3, filter),
    ])

    let query = `SELECT ${this.idColumn}, `
    query += `${this.getQuantileCaseClause(`${cleanColumns[0]}`, breaks[0], "q0")}, `
    query += `${this.getQuantileCaseClause(`${cleanColumns[1]}`, breaks[1], "q1")}, `
    query += `${this.getBivariateCaseClause(["q0", "q1"], colors)}`
    query += ` FROM data`
    const colorMap = this.mapColors((await this.runQuery(query)) as DataT[])
    return {
      colorMap,
      breaks: breaks,
      colors: legendColors,
    }
  }

  mapColors(colorValues: Array<any>) {
    const colorMap: Record<string, any> = {}
    for (let i = 0; i < colorValues.length; i++) {
      const entryValue = colorValues[i]
      if (!entryValue) continue
      const id = entryValue[this._dataId]
      colorMap[id] = entryValue.color.toJSON()
    }
    return colorMap
  }

  async getMonovariateColorValues({ colorScheme, column, nBins, reversed, filter, range }: MonovariateColorParamteres) {
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
        ? await this.getUniqueValues(cleanColumn, filter)
        : await this.getQuantiles(cleanColumn, nBins, filter)

    console.log("VALUES", values)
    let query = ``
    if (!range || range === "continuous") {
      query += `SELECT ${cleanColumn}, ${this.idColumn}, `
      query += this.getQuantileCaseClause(
        cleanColumn,
        values,
        "color",
        rgbColors.map((v: any) => `[${v}]`)
      )
      query += ` FROM data`
    } else {
      query += `
      SELECT ${cleanColumn}, ${this.idColumn},
      CASE 
        ${values.map((q, i) => `WHEN ${column} = ${q} THEN [${rgbColors[i]}]`).join("\n")}
        WHEN ${column} IS NULL THEN [120,120,120,0]
        ELSE [${rgbColors[rgbColors.length - 1]}]
        END as color
        FROM data
    `
    }
    if (filter) {
      query += ` WHERE ${this.idColumn} LIKE '${filter}%';`
    } else {
      query += ";"
    }
    const colorMap = this.mapColors(await this.runQuery(query))
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
          colorScheme: string
          column: string | number
          nBins: number
          reversed?: boolean
          filter?: string
          range?: "continuous" | "categorical"
        })
      | ({ bivariate: true } & {
          colorScheme: keyof typeof d3Bivariate
          column: Array<string | number>
          filter?: string
          [key: string]: any
        })
  ) {
    const bivariate = props.bivariate
    if (bivariate) {
      const { column, colorScheme, filter, reversed } = props as BivariateColorParamteres
      // @ts-ignore
      return this.getBivariateColorValues({ colorScheme, column, filter, reversed })
    } else {
      const { colorScheme, reversed, column, nBins, filter, range } = props as MonovariateColorParamteres
      // @ts-ignore
      return this.getMonovariateColorValues({ colorScheme, column, nBins, reversed, filter, range })
    }
  }

  async getTooltipValues(id: string) {
    if (this.tooltipResults[id]) {
      return this.tooltipResults[id]
    }
    const _res = await this.runQuery<DataT[]>(`SELECT * FROM data WHERE "${this.idColumn}" LIKE '${id}'`)
    if (!_res || _res.length === 0) {
      console.error(`No results for tooltip query: ${id}`)
      return
    }
    const data = _res[0]!
    let formattedData = []
    for (const section of tooltipConfig) {
      const sectionData: any = {
        section: section.section,
        columns: [],
      }
      for (const column of section.columns) {
        const columnConfig = columnsDict[column.col]
        const entry = data[columnConfig.name]
        sectionData.columns.push({
          ...column,
          data: entry,
        })
      }
      formattedData.push(sectionData)
    }
    this.tooltipResults[id] = formattedData
    return this.tooltipResults[id]
  }

  async getTimeseries(id: string, variable: keyof typeof timeSeriesConfig) {
    if (this.timeseriesResults[id]?.[variable]) return
    const config = timeSeriesConfig[variable]
    const columns = config.columns
      .map(
        (c) => `
      sum("${c}" * "TOTAL_POPULATION") / sum("TOTAL_POPULATION") as average_${c},
      median("${c}") as median_${c},
      approx_quantile("${c}", 0.75) as q75_${c},
      approx_quantile("${c}", 0.25) as q25_${c}
    `
      )
      .join(", ")
    const result = await this.runQuery(`SELECT ${columns} FROM data`)
    if (!this.timeseriesResults[id]) {
      this.timeseriesResults[id] = {}
    }

    this.timeseriesResults[id][variable] = result[0]
  }
}
