"use client"
import {
  DataColumns,
  columnsDict,
  idColumn,
  timeSeriesAggregates,
  timeSeriesConfig,
  timeSeriesDatasets,
  tooltipConfig,
} from "../config"
import * as d3 from "d3"
import tinycolor from "tinycolor2"
import { BivariateColorParamteres, FilterSpec, MonovariateColorParamteres, d3Bivariate } from "./types"
import { deepCompare2d1d } from "../compareArrayElements"
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
export const dataTableName = "data.parquet"

const NULL_COLOR = [120, 120, 120, 0]
export const getDecimalsFromRange = (range: number) => {
  if (range < 0.01) {
    return 12
  } else if (range < 0.1) {
    return 8
  } else if (range < 1) {
    return 5
  } else if (range < 10) {
    return 2
  } else if (range < 100) {
    return 1
  } else {
    return 0
  }
}

const SENTINEL_VALUES = [-666666666.0, -666666666]
export class DataService<DataT extends Record<string, any>> {
  data: Record<string, Record<string, Record<string | number, number>>> = {}
  dbStatus: "none" | "loading" | "loaded" | "error" = "none"
  timeseriesTables: string[] = []
  baseURL: string = window?.location?.origin || ""
  conn?: AsyncDuckDBConnection
  tooltipResults: any = {}
  connectedScatterplotResults: any = {}
  highlightResult: Record<string, boolean> = {}
  storeListResults: Record<string, any> = {}
  timeseriesResults: any = {}
  _dataId: keyof DataT = "GEOID"
  idColumn: string
  _rawData: Record<string, DataT> = {}
  
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
  
  sanitizeColumn(col: string | any) {
    // if starts or ends with '"" then return else add
    if (col.startsWith('"') && col.endsWith('"')) {
      return col
    } else {
      return `"${col}"`
    }
  }
  async getUniqueValues(column: string | number, filter?: FilterSpec[]): Promise<Array<number>> {
    let query = `SELECT DISTINCT 
      "${column}" FROM ${dataTableName}
      ${this.getWhereClause(filter)}
    `
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
    return Object.values(result[0]) as Array<number>
  }
  async getQuantiles(column: string | number, n: number, filters?: FilterSpec[]): Promise<Array<number>> {
    // breakpoints to use for quantile breaks
    // eg. n=5 - 0.2, 0.4, 0.6, 0.8 - 4 breaks
    // eg. n=4 - 0.25, 0.5, 0.75 - 3 breaks
    const quantileFractions = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n)
    const rangeResponse = await this.runQuery(`SELECT MAX(${column}) - MIN(${column}) as range FROM ${dataTableName}`)
    const sigFigs = getDecimalsFromRange(rangeResponse[0].range)
    let query = `SELECT 
      ${quantileFractions.map((f, i) => `round(approx_quantile(${column}, ${f}), ${sigFigs}) as break${i}`)}
      FROM ${dataTableName}
      `
    // @ts-ignore
    query += `${this.getWhereClause([...(filters || []), { column: column, operator: "IS NOT", value: null }])}`
    const result = await this.runQuery(query)
    if (!result || result.length === 0) {
      console.error(`No results for quantile query: ${query}`)
      return []
    }
    return Object.values(result[0]) as Array<number>
  }
  async getEqualIntervalBreaks(column: string | number, n: number, filters?: FilterSpec[]) {
    const rangeResponse = await this.runQuery(`
      SELECT MAX(${column}) as max, MIN(${column}) as min 
      FROM ${dataTableName}
      ${this.getWhereClause(filters, true)}
    `)
    const [min, max] = [rangeResponse[0].min, rangeResponse[0].max]
    const range = max - min
    const step = range / n
    const breaks = Array.from({ length: n }, (_, i) => min + i * step)
    return breaks
  }

  getQuantileCaseClause(
    column: string | number,
    quantiles: Array<number>,
    valueName: string,
    _values?: Array<string | number>,
    separate_null = true
  ) {
    if (quantiles.length === 0) {
      return
    }
    const values = _values || [...quantiles.map((_, i) => i), quantiles.length]

    let query = `\nCASE 
    `
    if (separate_null) {
      query += `WHEN ${column} IS NULL THEN [${NULL_COLOR.join(",")}] \n`
    }

    for (let i = 0; i < quantiles.length; i++) {
      query += ` WHEN ${column} < ${quantiles[i]} THEN ${values[i]} `
    }
    query += ` ELSE ${values[values.length - 1]} END as ${valueName}`
    return query
  }
  getWhereClause(_filters?: FilterSpec[], filterSentinentValues = false) {
    let query = ""
    const __filters = _filters || []
    // @ts-ignore
    const filters: FilterSpec[] = filterSentinentValues
      ? [
          ...__filters,
          __filters.map((f) => ({
            column: f.column,
            operator: "IS NOT",
            value: SENTINEL_VALUES,
          })),
        ]
      : __filters
    if (filters) {
      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i]!
        query += ` ${i === 0 ? "WHERE" : "AND"} ${filter.column} ${filter.operator}`
        switch (filter.operator) {
          case "IN":
          case "NOT IN":
            query += `(${(filter.value as string[] | number[]).join(",")})`
            break
          case "BETWEEN":
            query += `${(filter.value as any as [number, number])[0]} AND ${
              (filter.value as any as [number, number])[1]
            }`
            break
          default:
            query += ` ${filter.value}`
            break
        }
      }
    }

    return query
  }
  getBivariateCaseClause(columns: [string, string, string], colors: Array<Array<number>>) {
    let query = `\nCASE `
    query += "\n"
    query += `WHEN ${columns[2]} IS TRUE THEN [120,120,120,0]`
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
    const breaks = await Promise.all([
      this.getQuantiles(cleanColumns[0]!, 3, filter),
      this.getQuantiles(cleanColumns[1]!, 3, filter),
    ])

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

    let query = `SELECT ${this.idColumn}, `
    // if both columns null
    query += `(${cleanColumns[0]} IS NULL AND ${cleanColumns[1]} IS NULL) as "null_value",\n`
    query += `${this.getQuantileCaseClause(`${cleanColumns[0]}`, breaks[0], "q0", undefined, false)}, `
    query += `${this.getQuantileCaseClause(`${cleanColumns[1]}`, breaks[1], "q1", undefined, false)}, `
    query += `${this.getBivariateCaseClause(["q0", "q1", "null_value"], colors)}`
    query += ` FROM ${dataTableName}`
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
    let dataNote = ""
    const cleanColumn = typeof column === "string" ? column : `"${column}"`
    const binsToGenerate = nBins || 5
    const _values =
      range === "categorical"
        ? await this.getUniqueValues(cleanColumn, filter)
        : await this.getQuantiles(cleanColumn, binsToGenerate, filter)
    // filter unique
    const values = _values.filter((v, i, a) => a.indexOf(v) === i)
    const n = Math.min(values.length + 1, binsToGenerate)
    if (n !== binsToGenerate) {
      dataNote = `Some quantiles had the same values and were combined.`
    }
    const cleanColorScheme = colorScheme || "schemeYlGn"
    // @ts-ignore
    const d3Colors = d3[cleanColorScheme]?.[n]
    if (!d3Colors) {
      console.error(`Color scheme ${cleanColorScheme} with ${n} bins not found`)
      return {
        colorMap: {},
        breaks: [],
        colors: [],
        dataNote,
      }
    }
    let rgbColors = d3Colors.map((c: any) => {
      const tc = tinycolor(c).toRgb()
      return [tc.r, tc.g, tc.b]
    })
    if (reversed) {
      rgbColors.reverse()
    }

    let query = ``
    if (!range || range === "continuous") {
      query += `SELECT ${cleanColumn}, ${this.idColumn}, `
      query += this.getQuantileCaseClause(
        cleanColumn,
        values,
        "color",
        rgbColors.map((v: any) => `[${v}]`)
      )
      query += ` FROM ${dataTableName}`
    } else {
      query += `
      SELECT ${cleanColumn}, ${this.idColumn},
      CASE 
        ${values.map((q, i) => `WHEN ${column} = ${q} THEN [${rgbColors[i]}]`).join("\n")}
        WHEN ${column} IS NULL THEN [120,120,120,0]
        ELSE [${rgbColors[rgbColors.length - 1]}]
        END as color
        FROM ${dataTableName}
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
      dataNote,
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
    const columnFilter: FilterSpec[] | undefined = props.filter
      ? [
          {
            column: idColumn,
            operator: "LIKE",
            value: `'${props.filter}%'`,
          },
        ]
      : undefined

    const bivariate = props.bivariate
    if (bivariate) {
      const { column, colorScheme, filter, reversed } = props as BivariateColorParamteres
      // @ts-ignore
      return this.getBivariateColorValues({ colorScheme, column, filter: columnFilter, reversed })
    } else {
      const { colorScheme, reversed, column, nBins, filter, range } = props as MonovariateColorParamteres
      // @ts-ignore
      return this.getMonovariateColorValues({ colorScheme, column, nBins, reversed, filter: columnFilter, range })
    }
  }

  async getHighlightValues(
    column: string | number,
    value: [number, number] | Array<string | number>,
    type: "categorical" | "continuous"
  ) {
    let r: any
    if (type === "continuous") {
      const queryVal = value as [number, number]
      const min = Math.min(...queryVal)
      const max = Math.max(...queryVal)
      const query = `SELECT ${idColumn} FROM ${dataTableName} WHERE ${column} BETWEEN ${min} AND ${max};`
      r = await this.runQuery(query)
    } else if (type === "categorical") {
      const queryVal = value as Array<string | number>
      const query = `SELECT ${idColumn} FROM ${dataTableName} WHERE ${column} IN (${queryVal.join(",")});`
      r = await this.runQuery(query)
    }
    if (!r || r.length === 0) {
      console.error(`No results for highlight query: ${value}`)
      return []
    }
    const resultDict: Record<string, boolean> = {}
    for (const entry of r) {
      resultDict[entry[idColumn]] = true
    }
    this.highlightResult = resultDict
    return performance.now()
  }
  formatTooltipData(data: any) {
    const formattedData: any = []

    tooltipConfig.forEach((c) => {
      let value: any = 'NULL_VALUE';
      if (c.column) {
        value = data[c.column]
      } else if (c.maxOf) {
        const vals = c.maxOf.map((col) => data[col])
        value = Math.max(...vals)
      } else if (c.minOf) {
        const vals = c.minOf.map((col) => data[col])
        value = Math.min(...vals)
      }
      if (value === 'NULL_VALUE') {
        return
      } else {
        formattedData.push({
          label: c.label,
          category: c.lead ? 'lead' : undefined,
          inverted: c.inverted,
          formatter: c.formatter,
          value,
        })
      }
    })

    return formattedData
  }
  async getTooltipValues(id: string) {
    if (this.tooltipResults[id]) {
      return this.tooltipResults[id]
    }
    const _res = await this.runQuery<DataT[]>(`SELECT * FROM ${dataTableName} WHERE "${this.idColumn}" LIKE '${id}'`)
    if (!_res || _res.length === 0) {
      console.error(`No results for tooltip query: ${id}`)
      return
    }
    const data = _res[0]!
    this._rawData[id] = data
    const formattedData = this.formatTooltipData(data)
    this.tooltipResults[id] = {
      sections: formattedData,
      name: data.NAME
    }
    return this.tooltipResults[id]
  }
  rotate(data: Array<Record<string | number, any>>, columnLabel: string, valueLabel: string, columns: Array<string>) {
    const rotatedData = []
    for (const column of columns) {
      rotatedData.push({
        [columnLabel]: column,
        [valueLabel]: data[column as keyof typeof data],
      })
    }
    return rotatedData
  }
  buildAgregateTimeseriesQuery(config: any, id: string) {
    const columns = config.columns
    const columnQuery = columns
      .map((col: string) => timeSeriesAggregates.map((f) => `${f.template(col)} as ${f.alias(col)}`))
      .flat()
      .join(", ")

    let q = `SELECT ${columnQuery} FROM "${config.file}" `
    if (id.length >= 2) {
      q += `WHERE "${this.idColumn}" LIKE '${id}%'`
    }
    return q
  }

  rotateSimple(
    data: Array<Record<string | number, any>>,
    columns: Array<any>,
    columnLabel: string,
    valueLabel: string
  ) {
    const rotatedData = []
    for (const column of columns) {
      rotatedData.push({
        [columnLabel]: column,
        [valueLabel]: data[column],
      })
    }
    return rotatedData.map((r) => ({
      ...r,
      year: new Date(`01-02-${r.year}`),
    }))
  }

  rotateAggregate(data: Record<string | number, any>, columns: Array<any>, yearLabel: string) {
    const rotatedData = []
    for (const column of columns) {
      const aggregates = timeSeriesAggregates.map((f) => f.alias(column))
      const entry = {
        [yearLabel]: new Date(`01-02-${column}`),
      }
      for (const aggregate of timeSeriesAggregates) {
        const alias = aggregate.alias(column)
        const role = aggregate.role
        entry[role] = data[alias]
      }
      rotatedData.push(entry)
    }
    return rotatedData
  }
  async getScatterPlotData(
    id: string,
    var1: DataColumns,
    var2: DataColumns,
    xLabel: string,
    yLabel: string,
    excludeZero = false
  ) {
    const [config1, config2] = [columnsDict[var1], columnsDict[var2]]
    const [col1, col2, label1, label2] = [config1.column, config2.column, xLabel, yLabel].map(this.sanitizeColumn)
    let query = `SELECT 
      ${col1} as ${label1}, 
      ${col2} as ${label2},
      ${this.idColumn} FROM ${dataTableName}
      WHERE ${this.idColumn} LIKE '${id}%'`
    if (excludeZero) {
      query += ` AND ${col1} != 0 AND ${col2} != 0`
    }
    const scatterData = await this.runQuery(query)
    return scatterData
  }

  async getConnectedLineData(
    id: string,
    variable1: keyof typeof timeSeriesConfig,
    variable2: keyof typeof timeSeriesConfig
  ) {
    const [config1, config2] = [timeSeriesConfig[variable1], timeSeriesConfig[variable2]]
    const isTract = id.length === 11
    const sharedColumns = config1.columns.filter((c) => config2.columns.includes(c))
    let query = ``
    for (const column of sharedColumns) {
      query += `
        SELECT var1.GEOID as GEOID, var1."${column}" as ${variable1}, '${column}' as year, var2."${column}" as ${variable2}
        From ${config1.file} var1 LEFT JOIN ${config2.file} var2
        ON var1.GEOID = var2.GEOID
        WHERE var1.GEOID LIKE '${id}%' AND var2.GEOID LIKE '${id}%'
        `
      if (sharedColumns.indexOf(column) !== sharedColumns.length - 1) {
        query += ` UNION ALL `
      }
    }
    query += " ORDER BY GEOID, year"
    const linesData = await this.runQuery(query)
    const linesDataParsed = []
    let currId = linesData[0].GEOID
    let nextId = linesData[0].GEOID
    let nextIdIndex = 0
    for (let i = 1; i < linesData.length; i++) {
      const line = linesData[i]
      nextId = line.GEOID
      if (currId !== nextId) {
        linesDataParsed.push(linesData.slice(nextIdIndex, i))
        nextIdIndex = i
        currId = nextId
      }
    }
    return linesDataParsed
  }
  async getConnectedScatterplotData(
    id: string,
    scatterVariable1: DataColumns,
    scatterVariable2: DataColumns,
    lineVariable1: keyof typeof timeSeriesConfig,
    lineVariable2: keyof typeof timeSeriesConfig
  ) {
    const [scatterData, linesData] = await Promise.all([
      this.getScatterPlotData(id, scatterVariable1, scatterVariable2, lineVariable1, lineVariable2),
      this.getConnectedLineData(id, lineVariable1, lineVariable2),
    ])
    const hash = `${scatterVariable1}-${scatterVariable2}-${lineVariable1}-${lineVariable2}-${id}`

    this.connectedScatterplotResults[hash] = {
      scatterData,
      linesData,
    }
  }

  stringifyJsonWithBigInts(obj: any) {
    return JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2)
  }

  async getTimeseries(id: string, variable: keyof typeof timeSeriesConfig) {
    if (this.timeseriesResults[id]?.[variable]) return
    const isTract = id.length === 11
    const config = timeSeriesConfig[variable]
    const file = config.file
    const columns = config.columns
    const query = isTract
      ? `SELECT * FROM "${file}" WHERE "${this.idColumn}" LIKE '${id}'`
      : this.buildAgregateTimeseriesQuery(config, id)
    const result = await this.runQuery(query)

    if (!this.timeseriesResults[id]) {
      this.timeseriesResults[id] = {}
    }
    const dataParsed = isTract
      ? this.rotateSimple(result[0], columns as any[], "year", "value")
      : this.rotateAggregate(result[0], columns as any[], "year")

    this.timeseriesResults[id][variable] = dataParsed
  }
  async getHistogramData({
    variable,
    filters,
    fixedBins,
    nBins,
  }: {
    variable: string
    filters?: FilterSpec[]
    fixedBins?: { binStart: number; binEnd: number; bin: number }[]
    nBins?: number
  }) {
    let query = ""
    if (!fixedBins) {
      query += `WITH data AS (
        SELECT "${variable}" as value FROM "${dataTableName}"
        `
    } else {
      // use case to match bins
      query += `
        SELECT COUNT(*) as count, (
          CASE 
          ${fixedBins
            .map((b, i) => `WHEN "${variable}" BETWEEN ${b.binStart} AND ${b.binEnd} THEN ${b.bin}`)
            .join("\n")}
          ELSE ${fixedBins.length}
          END
        ) as bin,
        FROM "${dataTableName}"
        ${this.getWhereClause(filters, true)}
        `
    }
    if (!fixedBins) {
      query += `), bounds AS (SELECT MIN(value) AS min, MAX(value) AS max FROM data),
            info AS (SELECT min, max, (max - min) / ${nBins}.0 AS width FROM bounds),
            bins AS (SELECT value, min, width, FLOOR((value - min) / width) AS bin FROM data, info),
            counts AS (
              SELECT bin, MIN(min + bin * width) AS binStart, MIN(min + (bin + 1) * width) AS binEnd, 
              COUNT(*) AS count FROM bins GROUP BY bin, width, min
            )
      SELECT bin, binStart, binEnd, count
      FROM counts
      ORDER BY bin;`
    } else {
      query += ` GROUP BY bin;`
    }
    const result = await this.runQuery(query)
    const output = fixedBins
      ? fixedBins.map((b) => {
          const entry = result.find((r) => r.bin === b.bin)
          return {
            ...b,
            count: entry ? parseInt(entry.count) : 0,
          }
        })
      : result.map((r) => ({ ...r, count: parseInt(r.count) }))
    return output
  }
  async getComparableHistogramData({
    variable,
    mainFilters,
    subPopulationFilters,
    nBins,
    includeNational = true,
    fixedBins,
  }: {
    variable: string
    mainFilters?: FilterSpec[]
    subPopulationFilters?: { column: string; operator: string; value: string | string[] | number }[]
    fixedBins?: { binStart: number; binEnd: number; bin: number }[]
    nBins?: number
    includeNational?: boolean
  }) {
    if (!includeNational) {
      return this.getHistogramData({ variable, filters: mainFilters, nBins, fixedBins })
    } else if (mainFilters && subPopulationFilters) {
      const nationalResults = await this.getHistogramData({ variable, fixedBins, filters: mainFilters, nBins })

      const filtered = await this.getHistogramData({
        variable,
        filters: [...mainFilters, ...subPopulationFilters],
        fixedBins: fixedBins || nationalResults,
      })

      const merged = nationalResults.map((r, i) => {
        const subPopRow = filtered.find((f) => f.bin === r.bin)
        return {
          ...r,
          subPopulationCount: subPopRow?.count || 0,
        }
      })
      return merged
    }
  }
  async getHeatMapData({
    variableX,
    variableY,
    filters,
    binsX = 10,
    binsY = 10, // fixedBins,
  }: {
    variableX: DataColumns
    variableY: DataColumns
    filters?: FilterSpec[]
    // fixedBinsX?: { binStart: number; binEnd: number; bin: number }[]
    // fixedBinsY?: { binStart: number; binEnd: number; bin: number }[]
    binsX?: number
    binsY?: number
  }) {
    const [colX, colY] = [variableX, variableY].map((c) => this.sanitizeColumn(columnsDict[c].column))
    const [quantilesX, quantilesY] = await Promise.all([
      this.getQuantiles(colX, binsX, filters?.[0] ? [filters[0]!] : undefined),
      this.getQuantiles(colY, binsY, filters?.[1] ? [filters[1]!] : undefined),
    ])
    quantilesX.push(Math.pow(10, 12))
    quantilesY.push(Math.pow(10, 12))

    const [xBinValues, yBinValues] = [quantilesX.map((_, i) => i), quantilesY.map((_, i) => i)]
    // let query = `
    //   SELECT
    //     COUNT(*) as count,
    //     ${this.getQuantileCaseClause(colX, quantilesX, "binX",xBinValues)},
    //     ${this.getQuantileCaseClause(colY, quantilesY, "binY",yBinValues)}
    //     FROM ${this.sanitizeColumn(dataTableName)}
    //     ${this.getWhereClause(filters)}
    //     GROUP BY "binX", "binY"
    //   `
    //   console.log(query)
    let query = `WITH quantiles AS (
      SELECT
          ${colX},
          ${colY},
          NTILE(${binsX}) OVER (ORDER BY ${colX}) AS qX,
          NTILE(${binsY}) OVER (ORDER BY ${colY}) AS qY
      FROM
          ${this.sanitizeColumn(dataTableName)}
  )
  SELECT
      qX,
      qY,
      COUNT(*) AS count,
  FROM
      quantiles
  GROUP BY
      qX,
      qY
  ORDER BY
      qX,
      qY;`
    const result = await this.runQuery(query)
    const countMax = Math.max(...result.map((r) => parseInt(r.count)))
    const bucketSizeMax = Math.max(binsX, binsY)
    let reshaped = []

    for (let x = 1; x <= binsX; x++) {
      const rowValues = result.filter((r) => r.qX == x)
      const row = {
        bin: x,
        bins: [] as any[],
      }
      for (let y = 1; y <= binsY; y++) {
        const entry = rowValues.find((r) => r.qY == y)
        row.bins.push({
          bin: y,
          count: parseInt(entry?.count || 0),
        })
      }
      reshaped.push(row)
    }
    return {
      data: reshaped,
      binsX: quantilesX,
      binsY: quantilesY,
      countMax,
      bucketSizeMax,
    }
  }
}
