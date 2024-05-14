import { color } from "d3"
import { ColumnConfig, ColumnGroups } from "./config.types"

export const idColumn = "GEOID"

const generateHhiConfig = (year: number) =>
  ({
    name: `Concentration Index ${year} (No Dollar Stores)`,
    column: `hhi_${year}`, // hhi_2000, hhi_2010
    bivariate: false,
    description: `Herfindahl-Hirschman Index for ${year}`,
    colorScheme: "schemeGreens"
  }) as ColumnConfig

const generateGravityConfig = (year: number, dollar_stores: boolean) =>
  ({
    name: `Gravity ${year}`,
    column: `gravity_${year}`,
    bivariate: false,
    nBins: 9,
    colorScheme: "schemeSpectral",
    description: `Gravity for ${year}`,
  }) as ColumnConfig

export const columnsDict = {
  "Concentration Index 2000 (No Dollar Stores)": generateHhiConfig(2000),
  "Concentration Index 2010 (No Dollar Stores)": generateHhiConfig(2010),
  "Concentration Index 2020 (No Dollar Stores)": generateHhiConfig(2020),
  "Gravity 2000": generateGravityConfig(2000, false),
  "Gravity 2010": generateGravityConfig(2010, false),
  "Gravity 2020": generateGravityConfig(2020, false),
  "Gravity 2000 (With Dollar Stores)": generateGravityConfig(2000, true),
  "Gravity 2010 (With Dollar Stores)": generateGravityConfig(2010, true),
  "Gravity 2020 (With Dollar Stores)": generateGravityConfig(2020, true),
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
    column: "NH BLACK ALONE",
    description: "Percentage of population that is Black or African American",
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
  },
} as const

export const timeSeriesConfig = {
  hhi: {
    columns: new Array(2021 - 1997).fill(null).map((_, i) => i + 1997),
  },
  hhiDs: {
    columns: new Array(2021 - 1997).fill(null).map((_, i) => i + 1997),
  },
  gravity: {
    columns: [2000, ...new Array(2021 - 2010).fill(null).map((_, i) => i + 2010)],
  },
  gravityDs: {
    columns: [2000, ...new Array(2021 - 2010).fill(null).map((_, i) => i + 2010)],
  },
} as const

export const columnGroups: ColumnGroups<typeof columnsDict> = {
  "Market Concentration": {
    description: "Concentration Metrics",
    columns: [
      "Concentration Index 2020 (No Dollar Stores)",
      "Concentration Index 2010 (No Dollar Stores)",
      "Concentration Index 2000 (No Dollar Stores)",
    ],
  },
  "Food Access": {
    description: "Gravity",
    columns: [
      "Gravity 2020",
      "Gravity 2010",
      "Gravity 2000",
      "Gravity 2020 (With Dollar Stores)",
      "Gravity 2010 (With Dollar Stores)",
      "Gravity 2000 (With Dollar Stores)",
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
        col: "Gravity 2020",
        label: "2020",
      },
      {
        col: "Gravity 2010",
        label: "2010",
      },
      {
        col: "Gravity 2000",
        label: "2000",
      },
    ],
  },
  {
    section: "Market Concentration",
    columns: [
      {
        col: "Concentration Index 2020 (No Dollar Stores)",
        label: "2020",
      },
      {
        col: "Concentration Index 2010 (No Dollar Stores)",
        label: "2010",
      },
      {
        col: "Concentration Index 2000 (No Dollar Stores)",
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
