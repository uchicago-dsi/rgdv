import * as d3 from "d3"

export type BinsSchema = {
  colorScheme?: keyof typeof d3;
  nBins?: number;
  reversed?: boolean;
  manualBreaks?: Array<number>;
  range?: 'continuous' | 'categorical';
}
export type DataConfig = {
  filename: string;
  name: string;
  columns: Array<ColumnConfig>;
  eager: boolean;
  attribution: string;
  id: string;
} & BinsSchema

export type ColumnConfig = {
  name: string;
  column: string | number;
  description: string;
} & BinsSchema