export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

export const formatterPresets = {
  percent: percentFormatter.format,
} as const

type FormatterFunction = (s: string) => string

export const formatValue = <T extends object>(
  row: T,
  key: keyof T,
  formatters?: Record<keyof T, { formatterPreset?: keyof typeof formatterPresets; formatter?: FormatterFunction }>
) => {
  const val = row[key]
  if (val === undefined) return String(val)
  const rowFormatter = formatters?.[key as keyof typeof formatters]
  const formatter = rowFormatter?.hasOwnProperty("formatter")
    ? rowFormatter.formatter!
    : rowFormatter?.formatterPreset && formatterPresets[rowFormatter.formatterPreset as keyof typeof formatterPresets]
    ? formatterPresets[rowFormatter.formatterPreset as keyof typeof formatterPresets]!
    : (v: any) => v

  // @ts-ignore
  return formatter(val)
}
