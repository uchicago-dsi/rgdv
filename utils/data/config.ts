import { color } from "d3"
import { ColumnConfig, ColumnGroups } from "./config.types"
import { percentFormatter, wholeNumber } from "utils/display/formatValue"
import { primaryColumns } from "app/playground/page"

export const idColumn = "GEOID"
export const summaryTractFile = "full_tract.parquet"
const minYear = 1997
const maxYear = 2023
export const defaultYear = 2020

const generateHhiConfig = (year: number, ds: boolean = false) =>
  ({
    name: `Concentration Index ${year} (No Dollar Stores)`,
    column: `hhi_${ds ? "ds_" : ""}${year}`, // hhi_2000, hhi_2010
    bivariate: false,
    description: `Herfindahl-Hirschman Index for ${year}`,
    colorScheme: "schemePuRd",
  }) as ColumnConfig

const generateGravityConfig = (year: number, ds: boolean = false) =>
  ({
    name: `Gravity ${year}`,
    column: `gravity_${ds ? "ds_" : ""}${year}`,
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
  "Percent Walmart": {
    name: "Percent Walmart",
    column: '"WALMART INC"',
    description: "Percentage of Walmart stores",
    bivariate: false,
  },
  "Measure of Segregation (Black/African American and White)": {
    name: "Segregation Factor ICE Hispanic NH White Alone",
    bivariate: false,
    colorScheme: "schemeOranges",
    column: "ICE_Black_Alone_White_Alone",
    description: `Segregation ICE Black Alone White Alone`,
  },
  "Measure of Segregation (Hispanic/Latinx and Non-hispanic White)": {
    name: "Segregation Factor ICE Hispanic NH White Alone",
    bivariate: false,
    colorScheme: "schemeOranges",
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
    colorScheme: "schemeYlGnBu",
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
    colorScheme: "schemePuBuGn"
  },
  "Percent Hispanic or Latinx": {
    name: "Percent Hispanic or Latinx",
    column: '"PCT HISPANIC OR LATINO"',
    description: "Percentage of population that is Hispanic or Latinx",
    bivariate: false,
    colorScheme: "schemePuBuGn"
  },
  "Percent American Indian": {
    name: "Percent American Indian or Native American",
    column: '"PCT NH AMERICAN INDIAN"',
    description: "Percentage of population that is American Indian or Native American",
    bivariate: false,
    colorScheme: "schemePuBuGn"
  },
  "Percent Asian": {
    name: "Percent Asian",
    column: '"PCT NH ASIAN"',
    description: "Percentage of population that is Asian",
    bivariate: false,
    colorScheme: "schemePuBuGn"
  },
  "Percent Pacific Islander": {
    name: "Percent Pacific Islander or Native Hawaiian",
    column: '"PCT NH PACIFIC ISLANDER"',
    description: "Percentage of population that is Pacific Islander or Native Hawaiian",
    bivariate: false,
    colorScheme: "schemePuBuGn"
  },
  "Percent Other": {
    name: "Percent Other",
    column: '"PCT NH SOME OTHER"',
    description: "Percentage of population that is Other",
    bivariate: false,
    colorScheme: "schemePuBuGn"
  },
  "Percent Two or More": {
    name: "Percent Two or More",
    column: '"PCT NH TWO OR MORE"',
    description: "Percentage of population that is Two or More",
    bivariate: false,
    colorScheme: "schemePuBuGn"
  },
  "Percent White": {
    name: "Percent White",
    column: '"PCT NH WHITE"',
    description: "Percentage of population that is White",
    bivariate: false,
    colorScheme: "schemePuBuGn"
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
  "Economic Disadvantage & Food Access - Bivariate 2020": {
    name: "ADI & Food Access - 2020",
    bivariate: true,
    reversed: [true, true],
    column: ["ADI_NATRANK", "gravity_2020"],
    columnLabels: ["Economic Disadvantage", "Poor Food Access"],
    description: "Bivariate",
    colorScheme: "RdBu",
  },
  "Economic Disadvantage & Market Concentration - Bivariate 2020": {
    name: "ADI & Food Access - 2020",
    bivariate: true,
    reversed: [true, false],
    column: ["ADI_NATRANK", "hhi_2020"],
    columnLabels: ["Economic Disadvantage", "Market Concentration"],
    description: "Bivariate",
    colorScheme: "PuOr",
  },
  "Economic Disadvantage Index": {
    name: "Economic Disadvantage Index",
    column: "ADI_NATRANK",
    description: "ADI",
    bivariate: false,
    colorScheme: "schemeOranges",
  },
} as const

export type DataColumns = keyof typeof columnsDict

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
    file: "gravity_no_dollar_pivoted_normalized.parquet",
    label: "Food Access",
    columns: [2000, ...new Array(2021 - 2010).fill(null).map((_, i) => i + 2010)],
  },
  gravityDs: {
    file: "gravity_dollar_pivoted_normalized.parquet",
    label: "Food Access with Dollar Stores",
    columns: [2000, ...new Array(2021 - 2010).fill(null).map((_, i) => i + 2010)],
  },
} as const
export type timeSeriesDatasets = (typeof timeSeriesConfig)[keyof typeof timeSeriesConfig]["file"]
export const defaultTimeseriesDataset = "concentration_metrics_wide.parquet"

export const timeSeriesAggregates = [
  {
    template: (col: string) => `AVG("${col}")`,
    alias: (col: string) => `mean_${col}`,
    role: "mean",
  },
  {
    template: (col: string) => `approx_quantile("${col}", 0.5)`,
    alias: (col: string) => `median_${col}`,
    role: "median",
  },
  {
    template: (col: string) => `MAX("${col}")`,
    alias: (col: string) => `max_${col}`,
    role: "max",
  },
  {
    template: (col: string) => `MIN("${col}")`,
    alias: (col: string) => `min_${col}`,
    role: "min",
  },
  {
    template: (col: string) => `approx_quantile("${col}", 0.95)`,
    alias: (col: string) => `q95_${col}`,
    role: "q95",
  },
  {
    template: (col: string) => `approx_quantile("${col}", 0.75)`,
    alias: (col: string) => `q75_${col}`,
    role: "q75",
  },
  {
    template: (col: string) => `approx_quantile("${col}", 0.25)`,
    alias: (col: string) => `q25_${col}`,
    role: "q25",
  },
  {
    template: (col: string) => `approx_quantile("${col}", 0.05)`,
    alias: (col: string) => `q05_${col}`,
    role: "q05",
  },
]

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
      "Percent Walmart",
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
      "Economic Disadvantage Index",
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
      "Economic Disadvantage & Food Access - Bivariate 2020",
      "Economic Disadvantage & Market Concentration - Bivariate 2020",
    ],
  },
} as const

export const defaultColumn: DataColumns = "Concentration & Food Access - Bivariate 2020"

export const tooltipConfig: Array<{
  label: string
  column?: (typeof primaryColumns)[number]
  lead?: boolean
  inverted?: boolean
  maxOf?: (typeof primaryColumns)[number][]
  minOf?: (typeof primaryColumns)[number][]
  formatter?: (value: number) => string
}> = [
  {
    label: "Market Concentration",
    column: "hhi_2023_percentile",
    inverted: true,
    lead: true,
    formatter: wholeNumber.format,
  },
  {
    label: "Food Access",
    column: "gravity_2023_percentile",
    lead: true,
    formatter: wholeNumber.format,
  },
  {
    label: "Economic Disadvantage",
    column: "ADI_NATRANK",
    lead: true,
    inverted: true,
    formatter: wholeNumber.format,
  },
  {
    label: "Racial Segregation",
    column: "segregation_2023_percentile",
    inverted: true,
    lead: true,
    formatter: wholeNumber.format,
  },
]

export const defaultColumnGroup: keyof typeof columnGroups = Object.entries(columnGroups).find(([_k, v]) =>
  v.columns.includes(defaultColumn)
)![0]

export const communityHighlightConfig = {
  "Non-Hispanic Black or African American (%)": {
    column: '"PCT NH BLACK"',
    type: "continuous",
    default: [0.3, 1],
    range: [0, 1],
    step: 0.01,
    formatter: percentFormatter.format,
    color: "#FFFF00",
  },
  "Hispanic or Latinx (%)": {
    column: '"PCT HISPANIC OR LATINO"',
    type: "continuous",
    default: [0.3, 1],
    range: [0, 1],
    step: 0.01,
    formatter: percentFormatter.format,
    color: "#FFFF00",
  },
  "Non-Hispanic White (%)": {
    column: '"PCT NH WHITE"',
    type: "continuous",
    default: [0, 0.3],
    range: [0, 1],
    step: 0.01,
    formatter: percentFormatter.format,
    color: "#FFFF00",
    // inverse: true
  },
  "Poverty Rate": {
    column: '"POVERTY_RATE"',
    type: "continuous",
    default: [0.3, 1],
    range: [0, 1],
    step: 0.01,
    formatter: percentFormatter.format,
    color: "#FFFF00",
  },
  "Percent Receiving SNAP Benefits": {
    column: "PCT_SNAP_ASSISTANCE",
    type: "continuous",
    default: [0.3, 1],
    range: [0, 1],
    step: 0.01,
    formatter: percentFormatter.format,
    // yellow
    color: "#FFFF00",
  },
  "Percent with a Disability": {
    column: "PCT_WITH_A_DISABILITY",
    type: "continuous",
    default: [0.3, 1],
    range: [0, 1],
    step: 0.01,
    formatter: percentFormatter.format,
    color: "#FFFF00",
  },
  // median age
  // median HH income
  // USDA low income low access flag
} as const

const companyConfig = {
  type: "continuous",
  default: [0.3, 1],
  range: [0, 1],
  step: 0.01,
  formatter: percentFormatter.format,
  color: "#ff0000",
} as const

// AHOLD DELHAIZE USA INC	ALBERTSONS CO INC	COSTCO WHOLESALE CORP	DOLLAR GENERAL CORP	DOLLAR TREE INC	KROGER CO	LONE STAR FUNDS	MEIJER INC	PUBLIX SUPER MARKETS INC	TARGET CORP	TRADER JOE'S	WAKEFERN FOOD CORP INC	WALMART INC	WEGMANS FOOD MARKETS INC
export const parentCompanyHighlightConfig = {
  "Ahold Delhaize": {
    column: '"AHOLD DELHAIZE USA INC"',
    ...companyConfig,
  },
  Albertsons: {
    column: '"ALBERTSONS CO INC"',
    ...companyConfig,
  },
  Costco: {
    column: '"COSTCO WHOLESALE CORP"',
    ...companyConfig,
  },
  "Dollar General": {
    column: '"DOLLAR GENERAL CORP"',
    ...companyConfig,
  },
  "Dollar Tree": {
    column: '"DOLLAR TREE INC"',
    ...companyConfig,
  },
  Kroger: {
    column: '"KROGER CO"',
    ...companyConfig,
  },
  Meijer: {
    column: '"MEIJER INC"',
    ...companyConfig,
  },
  Publix: {
    column: '"PUBLIX SUPER MARKETS INC"',
    ...companyConfig,
  },
  Target: {
    column: '"TARGET CORP"',
    ...companyConfig,
  },
  "Trader Joe's": {
    column: '"TRADER JOE\'S"',
    ...companyConfig,
  },
  Wakefern: {
    column: '"WAKEFERN FOOD CORP INC"',
    ...companyConfig,
  },
  Wegmans: {
    column: '"WEGMANS FOOD MARKETS INC"',
    ...companyConfig,
  },
  Walmart: {
    column: '"WALMART INC"',
    ...companyConfig,
  },
} as const

export const raceEthnicityColumns = [
  "NH WHITE ALONE",
  "NH BLACK ALONE",
  "HISPANIC OR LATINO",
  "NH AMERICAN INDIAN ALONE",
  "NH ASIAN ALONE",
  "NH PACIFIC ISLANDER ALONE",
  "NH SOME OTHER RACE",
  "NH TWO OR MORE",
  "NH TWO OR MORE INCLUDING SOME OTHER",
  "NH TWO OR MORE EXCLUDING SOME OTHER",
] as const

export const combinedHighlightConfig = {
  ...communityHighlightConfig,
  ...parentCompanyHighlightConfig,
} as const

export const sidebarConfig = {
  tooltipConfig,
  parentCompanyHighlightConfig,
}

export const raceEthnicityLabels = {
  "NH WHITE ALONE": "White",
  "HISPANIC OR LATINO": "Hispanic or Latino/a",
  "NH BLACK ALONE": "Black or African American",
  "NH ASIAN ALONE": "Asian",
  "NH SOME OTHER RACE": "Some other race",
  "NH AMERICAN INDIAN ALONE": "American Indian",
  "NH PACIFIC ISLANDER ALONE": "Pacific Islander",
  "NH TWO OR MORE": "Two or more",
  "NH TWO OR MORE INCLUDING SOME OTHER": "Two or more including some other",
  "NH TWO OR MORE EXCLUDING SOME OTHER": "Two or more excluding some other",
}
