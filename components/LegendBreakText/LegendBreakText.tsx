import { deepCompare2d1d } from "utils/data/compareArrayElements"
import { getDecimalsFromRange } from "utils/data/service/service"
import { formatNumber } from "utils/display/formatNumber"
import { LegendBreakTextProps } from "./types"

export const LegendBreakText: React.FC<LegendBreakTextProps> = ({ breaks, index, colors, onClick, colorFilter }) => {
  // @ts-ignore
  const range = breaks[0] - breaks[breaks.length - 1]
  const numFractionDigits = getDecimalsFromRange(Math.abs(range))

  let text = ""
  if (index === 0) {
    text = `< ${formatNumber(breaks[0] as number, numFractionDigits)}`
  } else if (index === breaks.length) {
    text = `> ${formatNumber(breaks[breaks.length - 1] as number, numFractionDigits)}`
  } else {
    text = `${formatNumber(breaks[index - 1] as number, numFractionDigits)} - ${formatNumber(
      breaks[index] as number,
      numFractionDigits
    )}`
  }
  const color = colors[index]!
  const isOpaque = !colorFilter?.length || deepCompare2d1d(colorFilter, color)

  return (
    <div className="ColorRow">
      <button
        className={`mr-2 inline-block size-6 ${isOpaque ? "opactiy-100" : "opacity-10"}`}
        onClick={() => onClick && onClick(color, index)}
        style={{ background: `rgb(${color.join(",")})` }}
      ></button>
      <p>{text}</p>
    </div>
  )
}
