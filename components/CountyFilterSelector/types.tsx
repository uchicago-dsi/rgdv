export type CountyFilterSelectorProps = {
  handleSetFilter: (filter: string) => void
  currentFilter?: string
  size?: "sm" | "md" | "lg"
}
