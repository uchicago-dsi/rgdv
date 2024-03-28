import {
  DataConfig,
  ColumnConfig
} from './config.types'

const years = [2000,2010,2020]

const hhiColumns: Array<ColumnConfig> = years.map(year => ({
  name: `Concentration Index ${year} (No Dollar Stores)`,
  column: year,
  description: `Herfindahl-Hirschman Index for ${year}`
}))

const gravityColumns: Array<ColumnConfig> = years.map(year => ({
  name: `Gravity ${year}`,
  column: year,
  description: `Gravity for ${year}`
}))

const DollarStoreHhiConfig: DataConfig = {
  filename: 'data/concentration_metrics_wide_ds.parquet',
  name: 'Concentration Metrics',
  id: 'GEOID',
  columns: hhiColumns,
  eager: true,
  attribution: 'Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.',
  colorScheme: 'schemeYlOrRd',
  nBins: 6,
}

const GravityNoDollar: DataConfig = {
  filename: 'data/gravity_no_dollar_pivoted.parquet',
  name: 'Gravity (No Dollar Stores)',
  id: 'GEOID',
  columns: gravityColumns,
  eager: true,
  attribution: 'Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.',
  colorScheme: 'schemeRdYlGn',
  nBins: 9,
}

const GravityDollar: DataConfig = {
  name: 'Gravity (With Dollar Stores)',
  filename: 'data/gravity_dollar_pivoted.parquet',
  id: 'GEOID',
  columns: gravityColumns,
  eager: true,
  attribution: 'Data source: InfoGroup Reference USA. ACS 2000-2020. Census Centers of Population 2020.',
  colorScheme: 'schemeRdYlGn',
  nBins: 9,
  // manualBreaks: [
  //   2,
  //   3,
  //   4,
  //   5,
  //   6,
  //   7,
  //   8,
  //   9
  // ]
}

export const defaultData = GravityDollar.filename
export const defaultYear = 2020
export default [
  GravityDollar,
  GravityNoDollar,
  DollarStoreHhiConfig
]