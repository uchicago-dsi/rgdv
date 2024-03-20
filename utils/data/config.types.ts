import * as d3 from "d3"
export type DataConfig = {
  filename: string;
  name: string;
  columns: Array<ColumnConfig>;
  eager: boolean;
  attribution: string;
  id: string;
  colorScheme: keyof typeof d3;
  nBins?: number;
  reversed?: boolean;
  manualBreaks?: Array<number>;
}
export type ColumnConfig = {
  name: string;
  column: string | number;
  description: string;
}