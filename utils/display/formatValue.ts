export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

export const formatterPresets = {
  percent: percentFormatter.format,
} as const

type FormatterFunction = (s: string) => string

export const formatValue = <T extends object>({
  row,
  key,
  formatters,
  value,
}: {
  row: T
  key: keyof T
  formatters?: Record<keyof T, { formatterPreset?: keyof typeof formatterPresets; formatter?: FormatterFunction }>
  value?: number | string
}) => {
  const val = value === undefined ? row[key] : value
if (Number.isNaN(+val)) return String(val)
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
