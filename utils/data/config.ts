import { DataConfig, ColumnConfig, ColumnGroups, Columns } from "./config.types"

const years = [2000, 2010, 2020]


const generateHhiConfig = (year: number) =>
  ({
    name: `Concentration Index ${year} (No Dollar Stores)`,
    column: year,
    bivariate: false,
    idColumn: "GEOID",
    table: "data/concentration_metrics_wide.parquet",
    description: `Herfindahl-Hirschman Index for ${year}`,
  }) as ColumnConfig

const generateGravityConfig = (year: number, dollar_stores: boolean) =>
  ({
    name: `Gravity ${year}`,
    column: year,
    bivariate: false,
    table: "data/gravity_no_dollar_pivoted.parquet",
    idColumn: "GEOID",
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
    table: "data/sdoh.parquet",
    idColumn: "GEOID",
    column: "ICE_Black_Alone_White_Alone",
    description: `Segregation ICE Black Alone White Alone`,
  },
  "Measure of Segregation (Hispanic/Latinx and Non-hispanic White)": {
    name: "Segregation Factor ICE Hispanic NH White Alone",
    bivariate: false,
    table: "data/sdoh.parquet",
    idColumn: "GEOID",
    column: "ICE_Hispanic_NH_White_Alone",
    description: `Segregation ICE Hispanic NH White Alone`,
  },
  "Yost Overall Quintile": {
    name: "Yost Overall Quintile",
    bivariate: false,
    table: "data/sdoh.parquet",
    idColumn: "GEOID",
    column: "Yost_Overall_Quintile",
    description: `Yost Segregation factor for Overall Quintile`,
    colorScheme: "schemeOranges",
    reversed: true,
  },
  "Yost State Quintile": {
    name: "Yost State Quintile",
    bivariate: false,
    table: "data/sdoh.parquet",
    idColumn: "GEOID",
    column: "Yost_State_Quintile",
    description: `Yost Segregation factor for State Quintile`,
    colorScheme: "schemeOranges",
    reversed: true,
  },
  "Total Population": {
    name: "Total Population",
    column: "TOTAL_POPULATION",
    description: "Total population",
    table: "data/demography_tract.parquet",
    idColumn: "GEOID",
    bivariate: false,
  },
  "Median Household Income": {
    name: "Median Household Income",
    column: "MEDIAN_HOUSEHOLD_INCOME",
    description: "Median household income",
    table: "data/demography_tract.parquet",
    idColumn: "GEOID",
    bivariate: false,
  },
  "Poverty Rate": {
    name: "Poverty Rate",
    column: "POVERTY_RATE",
    description: "Poverty rate",
    table: "data/demography_tract.parquet",
    idColumn: "GEOID",
    bivariate: false,
  },
  "No Healthcare (Percent)": {
    name: "No Healthcare (Percent)",
    column: "PCT_NO_HEALTHCARE",
    description: "Percentage of population without healthcare",
    table: "data/demography_tract.parquet",
    idColumn: "GEOID",
    bivariate: false,
  },
  "Percent Black or African American": {
    name: "Percent Black or African American",
    column: "NH BLACK ALONE",
    description: "Percentage of population that is Black or African American",
    table: "data/demography_tract.parquet",
    idColumn: "GEOID",
    bivariate: false,
  },
  "Concentration & Food Access - Bivariate 2020": {
    name: "Concentration & Food Access - 2020",
    bivariate: true,
    reversed: [false, true],
    column: ["2020", "2020"],
    columnLabels: ["Market Concentration", "Poor Food Access"],
    idColumns: ["GEOID", "GEOID"],
    tables: ["data/concentration_metrics_wide.parquet", "data/gravity_no_dollar_pivoted.parquet"],
    description: "Bivariate",
    colorScheme: "BuPu",
  },
  "Economic Advantage & Food Access - Bivariate 2020": {
    name: "ADI & Food Access - 2020",
    bivariate: true,
    reversed: [true, true],
    column: ["ADI_NATRANK", "2020"],
    columnLabels: ["Economic Disadvantage", "Poor Food Access"],
    idColumns: ["FIPS", "GEOID"],
    tables: ["data/adi/2021_tracts.parquet", "data/gravity_no_dollar_pivoted.parquet"],
    description: "Bivariate",
    colorScheme: "RdBu",
  },
  "Economic Advantage Index": {
    name: "Economic Advantage Index",
    column: "ADI_NATRANK",
    description: "ADI",
    table: "data/adi/2021_tracts.parquet",
    idColumn: "FIPS",
    bivariate: false
  }
} as const

export const dataConfig: DataConfig = {
  "data/concentration_metrics_wide_ds.parquet": {
    filename: "data/concentration_metrics_wide_ds.parquet",
    name: "Concentration Metrics (No Dollar Stores)",
    id: "GEOID",
    columns: [""],
    eager: true,
    attribution: "Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.",
  },
  "data/concentration_metrics_wide.parquet": {
    filename: "data/concentration_metrics_wide.parquet",
    name: "Concentration Metrics (Dollar Stores)",
    id: "GEOID",
    columns: [],
    eager: true,
    attribution: "Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.",
  },
  "data/gravity_no_dollar_pivoted.parquet": {
    filename: "data/gravity_no_dollar_pivoted.parquet",
    name: "Gravity (No Dollar Stores)",
    id: "GEOID",
    columns: [],
    eager: true,
    attribution: "Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.",
  },
  "data/gravity_dollar_pivoted.parquet": {
    name: "Gravity (With Dollar Stores)",
    filename: "data/gravity_dollar_pivoted.parquet",
    id: "GEOID",
    columns: [],
    eager: true,
    attribution: "Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.",
  },
  "data/sdoh.parquet": {
    filename: "data/sdoh.parquet",
    name: "Segregation Factors",
    id: "GEOID",
    columns: [],
    eager: true,
    attribution: "Data source: NIH NCI.",
  },
  "data/demography_tract.parquet": {
    filename: "data/demography_tract.parquet",
    name: "Demographic Data",
    id: "GEOID",
    columns: [],
    eager: true,
    attribution: "Data source: US Census Bureau. ACS 2021 5 year estimates",
  },
  "data/adi/2021_tracts.parquet": {
    filename: "data/adi/2021_tracts.parquet",
    name: "Economic Advantage Index",
    id: "FIPS",
    columns: [],
    eager: true,
    attribution: "Data source: UW ADI",
  },
} as const


export const timeSeriesConfig = {
  hhi: {
    table: "data/concentration_metrics_wide.parquet",
    columns: new Array(2021-1997).fill(null).map((_, i) => i + 1997),
    idColumn: "GEOID"
  },
  hhiDs: {
    table: "data/concentration_metrics_wide_ds.parquet",
    columns: new Array(2021-1997).fill(null).map((_, i) => i + 1997),
    idColumn: "GEOID"
  },
  gravity: {
    table: "data/gravity_no_dollar_pivoted.parquet",
    columns: [2000, ...(new Array(2021-2010).fill(null).map((_, i) => i + 2010))],
    idColumn: "GEOID"
  },
  gravityDs: {
    table: "data/gravity_dollar_pivoted.parquet",
    columns: [2000, ...(new Array(2021-2010).fill(null).map((_, i) => i + 2010))],
    idColumn: "GEOID"
  }
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
    description: "Demographic Data",
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
    columns: ["Concentration & Food Access - Bivariate 2020", "Economic Advantage & Food Access - Bivariate 2020"],
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
        col: "Segregation Factor ICE Black Alone White Alone",
        label: "Segregation - Black Alone White Alone",
      },
      {
        col: "Segregation Factor ICE Hispanic NH White Alone",
        label: "Segregation - Hispanic NH White Alone",
      },
    ],
  },
]

export const defaultColumnGroup: keyof typeof columnGroups = Object.entries(columnGroups).find(([_k, v]) =>
  v.columns.includes(defaultColumn)
)![0]
export const defaultYear = 2020
