export const d3Bivariate = {
  RdBu: [
    ["#e8e8e8", "#e4acac", "#c85a5a"],
    ["#b0d5df", "#ad9ea5", "#985356"],
    ["#64acbe", "#627f8c", "#574249"],
  ],
  BuPu: [
    ["#e8e8e8", "#ace4e4", "#5ac8c8"],
    ["#dfb0d6", "#a5add3", "#5698b9"],
    ["#be64ac", "#8c62aa", "#3b4994"],
  ],
  GnBu: [
    ["#e8e8e8", "#b5c0da", "#6c83b5"],
    ["#b8d6be", "#90b2b3", "#567994"],
    ["#73ae80", "#5a9178", "#2a5a5b"],
  ],
  PuOr: [
    ["#e8e8e8", "#e4d9ac", "#c8b35a"],
    ["#cbb8d7", "#c8ada0", "#af8e53"],
    ["#9972af", "#976b82", "#804d36"],
  ],
} as const

export type BivariateColorParamteres = { bivariate: true } & {
  idColumn: string[]
  colorScheme: keyof typeof d3Bivariate
  column: (string | number)[]
  table: string[]
  reversed?: boolean[]
  filter?: FilterSpec[]
  colorFilter?: number[][]
}

export type MonovariateColorParamteres = { bivariate: false } & {
  idColumn: string
  colorScheme: string
  column: string | number
  table: string
  nBins: number
  reversed?: boolean
  filter?: FilterSpec[]
  range?: "continuous" | "categorical"
  colorFilter?: number[][]
}

export type PrimaryData = {
  gravity_2021_weighted: number // Population-weighted value for the gravity metric for the county and state in 2021
  gravity_2023_percentile: number // Percentile ranking of the gravity metric for 2023
  gravity_2023_state_percentile: number // Percentile ranking of the gravity metric within the state for 2023
  hhi_2023_weighted: number // Population-weighted Herfindahl-Hirschman Index (HHI) value for 2023
  hhi_2023_percentile: number // Percentile ranking of the Herfindahl-Hirschman Index for 2023
  hhi_2023_state_percentile: number // Percentile ranking of the Herfindahl-Hirschman Index within the state for 2023
  segregation_ICE_Black_Alone_White_Alone_weighted: number // Population-weighted value of the segregation index for Black Alone vs. White Alone for 2023
  segregation_2023_percentile: number // Percentile ranking of the segregation index for 2023
  segregation_2023_state_percentile: number // Percentile ranking of the segregation index within the state for 2023
  GEOID: string // Geographic identifier for the tract/county/state
  NAME: string // Name of the geographic area
  TOTAL_POPULATION: number // Total population
  NH_WHITE_ALONE: number // Population count of Non-Hispanic White Alone individuals
  NH_BLACK_ALONE: number // Population count of Non-Hispanic Black Alone individuals
  NH_AMERICAN_INDIAN_ALONE: number // Population count of Non-Hispanic American Indian Alone individuals
  NH_ASIAN_ALONE: number // Population count of Non-Hispanic Asian Alone individuals
  NH_PACIFIC_ISLANDER_ALONE: number // Population count of Non-Hispanic Pacific Islander Alone individuals
  NH_SOME_OTHER_RACE: number // Population count of Non-Hispanic individuals of some other race
  NH_TWO_OR_MORE: number // Population count of Non-Hispanic individuals of two or more races
  NH_TWO_OR_MORE_INCLUDING_SOME_OTHER: number // Population count of Non-Hispanic individuals of two or more races, including some other race
  NH_TWO_OR_MORE_EXCLUDING_SOME_OTHER: number // Population count of Non-Hispanic individuals of two or more races, excluding some other race
  HISPANIC_OR_LATINO: number // Population count of Hispanic or Latino individuals
  "PCT NH WHITE": number // Percentage of Non-Hispanic White Alone individuals in the population
  PCT_NH_BLACK: number // Percentage of Non-Hispanic Black Alone individuals in the population
  PCT_NH_AMERICAN_INDIAN: number // Percentage of Non-Hispanic American Indian Alone individuals in the population
  PCT_NH_ASIAN: number // Percentage of Non-Hispanic Asian Alone individuals in the population
  PCT_NH_PACIFIC_ISLANDER: number // Percentage of Non-Hispanic Pacific Islander Alone individuals in the population
  PCT_NH_SOME_OTHER: number // Percentage of Non-Hispanic individuals of some other race in the population
  PCT_NH_TWO_OR_MORE: number // Percentage of Non-Hispanic individuals of two or more races in the population
  PCT_NH_TWO_OR_MORE_INCLUDING_SOME_OTHER: number // Percentage of Non-Hispanic individuals of two or more races, including some other race, in the population
  PCT_NH_TWO_OR_MORE_EXCLUDING_SOME_OTHER: number // Percentage of Non-Hispanic individuals of two or more races, excluding some other race, in the population
  PCT_HISPANIC_OR_LATINO: number // Percentage of Hispanic or Latino individuals in the population
  MEDIAN_AGE: number // Median age of the population
  POVERTY_RATE: number // Poverty rate of the population
  MEDIAN_HOUSEHOLD_INCOME: number // Median household income in the area
  NO_HEALTHCARE_TOTAL: number // Total number of individuals without healthcare
  PCT_NO_HEALTHCARE: number // Percentage of individuals without healthcare
  ADI_NATRANK: number // National rank for the Area Deprivation Index
  ADI_STATERNK: number // State rank for the Area Deprivation Index
  UNIT: string // Name of the geographic unit -- tract, county, or state
  UNIT_PLURAL: string // Plural name of the geographic unit -- tracts, counties, or states
}

export type FilterSpec = { 
  column: string; 
  operator: string; 
  value: string | string[] | number | number[]
}
