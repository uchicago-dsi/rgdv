import { color } from "d3"
import { ColumnConfig, ColumnGroups } from "./config.types"

export const idColumn = "GEOID"

const generateHhiConfig = (year: number, ds: boolean =false) =>
  ({
    name: `Concentration Index ${year} (No Dollar Stores)`,
    column: `hhi_${ds ? 'ds_' : ''}${year}`, // hhi_2000, hhi_2010
    bivariate: false,
    description: `Herfindahl-Hirschman Index for ${year}`,
    colorScheme: "schemeGreens"
  }) as ColumnConfig

const generateGravityConfig = (year: number, ds: boolean = false) =>
  ({
    name: `Gravity ${year}`,
    column: `gravity_${ds ? 'ds_' : ''}${year}`,
    bivariate: false,
    nBins: 9,
    colorScheme: "schemeSpectral",
    description: `Gravity for ${year}`,
  }) as ColumnConfig

export const columnsDict = {
  "Market Concentration - 2000": generateHhiConfig(2000),
  "Market Concentration - 2010": generateHhiConfig(2010),
  "Market Concentration - 2020": generateHhiConfig(2020),
  "Market Concentration - 2023 (Most Recent)": generateHhiConfig(2023),
  "Market Concentration - 2000 (With Dollar Stores)": generateHhiConfig(2000, true),
  "Market Concentration - 2010 (With Dollar Stores)": generateHhiConfig(2010, true),
  "Market Concentration - 2020 (With Dollar Stores)": generateHhiConfig(2020, true),
  "Food Access Supply - 2000": generateGravityConfig(2000),
  "Food Access Supply - 2010": generateGravityConfig(2010),
  "Food Access Supply - 2020": generateGravityConfig(2020),
  "Food Access Supply - 2000 (With Dollar Stores)": generateGravityConfig(2000, true),
  "Food Access Supply - 2010 (With Dollar Stores)": generateGravityConfig(2010, true),
  "Food Access Supply - 2020 (With Dollar Stores)": generateGravityConfig(2020, true),
  "Measure of Segregation (Black/African American and White)": {
    name: "Segregation Factor ICE Hispanic NH White Alone",
    bivariate: false,
    column: "ICE_Black_Alone_White_Alone",
    description: `Segregation ICE Black Alone White Alone`,
  },
  "Measure of Segregation (Hispanic/Latinx and Non-hispanic White)": {
    name: "Segregation Factor ICE Hispanic NH White Alone",
    bivariate: false,
    column: "ICE_Hispanic_NH_White_Alone",
    description: `Segregation ICE Hispanic NH White Alone`,
  },
  "Yost Overall Quintile": {
    name: "Yost Overall Quintile",
    bivariate: false,
    column: "Yost_Overall_Quintile",
    description: `Yost Segregation factor for Overall Quintile`,
    colorScheme: "schemeOranges",
    reversed: true,
  },
  "Yost State Quintile": {
    name: "Yost State Quintile",
    bivariate: false,
    column: "Yost_State_Quintile",
    description: `Yost Segregation factor for State Quintile`,
    colorScheme: "schemeOranges",
    reversed: true,
  },
  "Total Population": {
    name: "Total Population",
    column: "TOTAL_POPULATION",
    description: "Total population (ACS 2021 5-year estimates)",
    bivariate: false,
    nbins: 5,
    colorScheme: "schemeBlues",
  },
  "Median Household Income": {
    name: "Median Household Income",
    column: "MEDIAN_HOUSEHOLD_INCOME",
    description: "Median household income",
    bivariate: false,
  },
  "Poverty Rate": {
    name: "Poverty Rate",
    column: "POVERTY_RATE",
    description: "Poverty rate",
    colorScheme: "schemeBuPu",
    bivariate: false,
  },
  "No Healthcare (Percent)": {
    name: "No Healthcare (Percent)",
    column: "PCT_NO_HEALTHCARE",
    description: "Percentage of population without healthcare",
    bivariate: false,
  },
  "Percent Black or African American": {
    name: "Percent Black or African American",
    column: '"PCT NH BLACK"',
    description: "Percentage of population that is Black or African American",
    bivariate: false,
  },
  "Percent Hispanic or Latinx": {
    name: "Percent Hispanic or Latinx",
    column: '"PCT HISPANIC OR LATINO"',
    description: "Percentage of population that is Hispanic or Latinx",
    bivariate: false,
  },
  "Percent American Indian": {
    name: "Percent American Indian or Native American",
    column: '"PCT NH AMERICAN INDIAN"',
    description: "Percentage of population that is American Indian or Native American",
    bivariate: false,
  },
  "Percent Asian": {
    name: "Percent Asian",
    column: '"PCT NH ASIAN"',
    description: "Percentage of population that is Asian",
    bivariate: false,
  },
  "Percent Pacific Islander": {
    name: "Percent Pacific Islander or Native Hawaiian",
    column: '"PCT NH PACIFIC ISLANDER"',
    description: "Percentage of population that is Pacific Islander or Native Hawaiian",
    bivariate: false,
  },
  "Percent Other": {
    name: "Percent Other",
    column: '"PCT NH other"',
    description: "Percentage of population that is Other",
    bivariate: false,
  },
  "Percent Two or More": {
    name: "Percent Two or More",
    column: '"PCT NH TWO OR MORE"',
    description: "Percentage of population that is Two or More",
    bivariate: false,
  },
  "Percent White": {
    name: "Percent White",
    column: '"PCT NH WHITE"',
    description: "Percentage of population that is White",
    bivariate: false,
  },
  "Concentration & Food Access - Bivariate 2020": {
    name: "Concentration & Food Access - 2020",
    bivariate: true,
    reversed: [false, true],
    column: ["hhi_2020", "gravity_2020"],
    columnLabels: ["Market Concentration", "Poor Food Access"],
    description: "Bivariate",
    colorScheme: "BuPu",
  },
  "Economic Advantage & Food Access - Bivariate 2020": {
    name: "ADI & Food Access - 2020",
    bivariate: true,
    reversed: [true, true],
    column: ["ADI_NATRANK", "gravity_2020"],
    columnLabels: ["Economic Disadvantage", "Poor Food Access"],
    description: "Bivariate",
    colorScheme: "RdBu",
  },
  "Economic Advantage & Market Concentration - Bivariate 2020": {
    name: "ADI & Food Access - 2020",
    bivariate: true,
    reversed: [true, false],
    column: ["ADI_NATRANK", "hhi_2020"],
    columnLabels: ["Economic Disadvantage", "Market Concentration"],
    description: "Bivariate",
    colorScheme: "PuOr",
  },
  "Economic Advantage Index": {
    name: "Economic Advantage Index",
    column: "ADI_NATRANK",
    description: "ADI",
    bivariate: false,
    colorScheme: "schemeOranges",
  },
} as const

const minYear = 1997
const maxYear = 2023
export const timeSeriesConfig = {
  hhi: {
    file: "concentration_metrics_wide.parquet",
    label: "Market Concentration",
    columns: new Array(maxYear - minYear).fill(null).map((_, i) => i + minYear),
  },
  hhiDs: {
    file: "concentration_metrics_wide_ds.parquet",
    label: "Market Concentration with Dollar Stores",
    columns: new Array(maxYear - minYear).fill(null).map((_, i) => i + minYear),
  },
  gravity: {
    file: "gravity_no_dollar_pivoted.parquet",
    label: "Food Access",
    columns: [2000, ...new Array(2021 - 2010).fill(null).map((_, i) => i + 2010)],
  },
  gravityDs: {
    file: "gravity_dollar_pivoted.parquet",
    label: "Food Access with Dollar Stores",
    columns: [2000, ...new Array(2021 - 2010).fill(null).map((_, i) => i + 2010)],
  },
} as const
export type timeSeriesDatasets = typeof timeSeriesConfig[keyof typeof timeSeriesConfig]['file']
export const defaultTimeseriesDataset = "concentration_metrics_wide.parquet"

export const columnGroups: ColumnGroups<typeof columnsDict> = {
  "Market Concentration": {
    description: "Concentration Metrics",
    columns: [
        "Market Concentration - 2023 (Most Recent)",
        "Market Concentration - 2020",
        "Market Concentration - 2010",
        "Market Concentration - 2000",
        "Market Concentration - 2020 (With Dollar Stores)",
        "Market Concentration - 2010 (With Dollar Stores)",
        "Market Concentration - 2000 (With Dollar Stores)",
    ],
  },
  "Food Access": {
    description: "Gravity",
    columns: [
      "Food Access Supply - 2020",
      "Food Access Supply - 2010",
      "Food Access Supply - 2000",
      "Food Access Supply - 2020 (With Dollar Stores)",
      "Food Access Supply - 2010 (With Dollar Stores)",
      "Food Access Supply - 2000 (With Dollar Stores)",
    ],
  },
  "Racial Equity": {
    description: "Segregation Factors",
    columns: [
      "Economic Advantage Index",
      "Measure of Segregation (Black/African American and White)",
      "Measure of Segregation (Hispanic/Latinx and Non-hispanic White)",
      "Yost Overall Quintile",
      "Yost State Quintile",
    ],
  },
  "Demographic Data": {
    description: "Various Demographic Data",
    columns: [
      "Total Population",
      "Median Household Income",
      "Poverty Rate",
      "No Healthcare (Percent)",
      "Percent Black or African American",
      "Percent Hispanic or Latinx",
      "Percent American Indian",
      "Percent Asian",
      "Percent Pacific Islander",
      "Percent Other",
      "Percent Two or More",
      "Percent White",
    ],
  },
  Bivariate: {
    description: "Bivariate",
    columns: [
      "Concentration & Food Access - Bivariate 2020",
      "Economic Advantage & Food Access - Bivariate 2020",
      "Economic Advantage & Market Concentration - Bivariate 2020",
    ],
  },
} as const

export const defaultColumn: keyof typeof columnsDict = "Concentration & Food Access - Bivariate 2020"

export const tooltipConfig: Array<{
  section?: string
  columns: Array<{
    col: keyof typeof columnsDict
    label?: string
    format?: string
  }>
}> = [
  {
    section: "Food Access",
    columns: [
      {
        col: "Food Access Supply - 2020",
        label: "2020",
      },
      {
        col: "Food Access Supply - 2010",
        label: "2010",
      },
      {
        col: "Food Access Supply - 2000",
        label: "2000",
      },
    ],
  },
  {
    section: "Market Concentration",
    columns: [
      {
        col: "Market Concentration - 2023 (Most Recent)",
        label: "2023",
      },
      {
        col: "Market Concentration - 2020",
        label: "2020",
      },
      {
        col: "Market Concentration - 2010",
        label: "2010",
      },
      {
        col: "Market Concentration - 2000",
        label: "2000",
      },
    ],
  },
  {
    section: "Racial Equity",
    columns: [
      {
        col: "Measure of Segregation (Black/African American and White)",
        label: "Segregation - Black Alone White Alone",
      },
      {
        col: "Measure of Segregation (Hispanic/Latinx and Non-hispanic White)",
        label: "Segregation - Hispanic NH White Alone",
      },
    ],
  },
]

export const defaultColumnGroup: keyof typeof columnGroups = Object.entries(columnGroups).find(([_k, v]) =>
  v.columns.includes(defaultColumn)
)![0]
export const defaultYear = 2020
