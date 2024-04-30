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

export type BivariateColorParamteres = {bivariate: true}&{
  idColumn: string[],
  colorScheme: keyof typeof d3Bivariate,
  column: (string | number)[],
  table: string[],
  filter?: string
}

export type MonovariateColorParamteres = {bivariate: false}&{
  idColumn: string,
  colorScheme: string,
  column: string | number,
  table: string,
  nBins: number,
  reversed?: boolean,
  filter?: string,
  range?: "continuous" | "categorical"
}