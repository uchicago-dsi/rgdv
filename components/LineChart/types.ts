import React from "react";

type DataType<T extends Record<string, any>> = Array<T>;
export interface DimensionProps {
  xMax: number;
  yMax: number;
  xMin: number;
  yMin: number;
}

export interface LineChartProps<T extends Record<string, any>> {
  data: DataType<T>
  parentRef: React.RefObject<HTMLDivElement>
  dataKey?: keyof T
  aggregates?: Array<{role: keyof T}>
  yearKey: keyof T
  children?: React.ReactElement<DimensionProps> | React.ReactElement<DimensionProps>[];
  fixedRange?: [number, number]
  // lowerBandKey: keyof T
  // upperBandKey: keyof T
}