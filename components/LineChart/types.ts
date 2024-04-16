export interface DataRecord {
  [key: string]: any;
}

export interface LineChartProps {
  data: DataRecord[];
  dataKey: string;
  yearKey: string;
}

export interface ResponsiveXYChartProps extends LineChartProps {
  parentWidth: number;
  parentHeight: number;
}