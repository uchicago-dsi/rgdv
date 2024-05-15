export type StoreListProps<T extends any[]> = {
  id: string
  columns?: T
  title?: string
  formatters?: Record<T[number], {
    label: string
    formatter: (value: any) => string
  }>
}
