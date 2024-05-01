import { formatNumber } from "utils/display/formatNumber"
import { LegendBreakTextProps } from "./types"

export const LegendBreakText: React.FC<LegendBreakTextProps> = ({ breaks, index, colors }) => {
  let text = ""
  if (index === 0) {
    text = `< ${formatNumber(breaks[0] as number)}`
  } else if (index === breaks.length) {
    text = `> ${formatNumber(breaks[breaks.length - 1] as number)}`
  } else {
    text = `${formatNumber(breaks[index - 1] as number)} - ${formatNumber(breaks[index] as number)}`
  }
  return (
    <div className="ColorRow">
      {/* @ts-ignore */}
      <span style={{ background: `rgb(${colors[index].join(",")})` }}></span>
      <p>{text}</p>
    </div>
  )
}
