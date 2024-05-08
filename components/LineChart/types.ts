import { timeSeriesConfig } from "utils/data/config";

export interface DataRecord {
  [key: string]: any;
}

export type TimeseriesConfigKey = keyof typeof timeSeriesConfig;
export type TimeseriesConfigEntry = typeof timeSeriesConfig[TimeseriesConfigKey];
export type TimeseriesConfigColumn = TimeseriesConfigEntry["columns"][number];
export type TimeseriesColumns = ('year' | 'median' | 'average'| 'q75'| 'q25')

export interface LineChartProps {
  data: Record<TimeseriesColumns, number>
  dataKey: TimeseriesColumns
  timeseriesConfigKey: TimeseriesConfigKey;
}

export interface ResponsiveXYChartProps extends LineChartProps {
  parentWidth: number;
  parentHeight: number;
}