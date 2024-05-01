export const formatNumber = (n: number) => {
  if (typeof n == "number") {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      notation: "compact",
      maximumFractionDigits: 2,
    })
    return formatter.format(n)
  } else {
    return n
  }
}