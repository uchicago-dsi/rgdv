import {
  DataConfig,
  ColumnConfig
} from './config.types'

const years = Array.from({ length: 25 }, (_, i) => 1997 + i);
const hhiColumns: Array<ColumnConfig> = years.map(year => ({
  name: `Concentration Index ${year}`,
  column: year,
  description: `Herfindahl-Hirschman Index for ${year}`
}))
const gravityColumns: Array<ColumnConfig> = years.map(year => ({
  name: `Gravity ${year}`,
  column: year,
  description: `Gravity for ${year}`
}))

const DollarStoreHhiConfig: DataConfig = {
  filename: 'data/concentration_metrics_wide_ds.csv',
  name: 'Concentration Metrics',
  id: 'GEOID',
  columns: hhiColumns,
  eager: true,
  attribution: '',
  colorScheme: 'schemeYlOrRd',
  nBins: 6,
}

const GravityNoDollar: DataConfig = {
  filename: 'data/gravity_no_dollar_pivoted.csv',
  name: 'Gravity (No Dollar Stores)',
  id: 'GEOID',
  columns: gravityColumns,
  eager: true,
  attribution: '',
  colorScheme: 'schemeRdYlGn',
  nBins: 9,
}

const GravityDollar: DataConfig = {
  name: 'Gravity (With Dollar Stores)',
  filename: 'data/gravity_dollar_pivoted.csv',
  id: 'GEOID',
  columns: gravityColumns,
  eager: true,
  attribution: '',
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

export const defaultData = GravityNoDollar.filename

export default [
  // GravityDollar,
  GravityNoDollar,
  // DollarStoreHhiConfig
]