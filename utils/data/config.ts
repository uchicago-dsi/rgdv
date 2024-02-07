export type DataConfig = {
  filename: string;
  columns: Array<ColumnConfig>;
  eager: boolean;
  attribution: string;
  id: string;
}
export type ColumnConfig = {
  name: string;
  column: string | number;
  description: string;
}
const years = Array.from({ length: 25 }, (_, i) => 1997 + i);
const hhiColumns: Array<ColumnConfig> = years.map(year => ({
  name: `Concentration Index ${year}`,
  column: year,
  description: `Herfindahl-Hirschman Index for ${year}`
}))
const DollarStoreHhiConfig: DataConfig = {
  filename: 'data/concentration_metrics_wide_ds.csv',
  id: 'GEOID',
  columns: hhiColumns,
  eager: true,
  attribution: ''
}
export const defaultConfig = {
}

export default [
  DollarStoreHhiConfig
]