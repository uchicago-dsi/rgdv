export const formatNumber = (n: number, fractionDigits = 2) => {
  if (typeof n == "number") {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      notation: "compact",
      maximumFractionDigits: fractionDigits,
    })
    return formatter.format(n)
  } else {
    return n
  }
}