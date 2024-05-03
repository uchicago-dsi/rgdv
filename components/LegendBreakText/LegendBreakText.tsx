import { formatNumber } from "utils/display/formatNumber"
import { LegendBreakTextProps } from "./types"
import { deepCompare2d1d } from "utils/data/compareArrayElements"

export const LegendBreakText: React.FC<LegendBreakTextProps> = ({ breaks, index, colors, onClick, colorFilter }) => {
  let text = ""
  if (index === 0) {
    text = `< ${formatNumber(breaks[0] as number)}`
  } else if (index === breaks.length) {
    text = `> ${formatNumber(breaks[breaks.length - 1] as number)}`
  } else {
    text = `${formatNumber(breaks[index - 1] as number)} - ${formatNumber(breaks[index] as number)}`
  }
  const color = colors[index]!
  const isOpaque = !colorFilter?.length || deepCompare2d1d(colorFilter, color)

  return (
    <div className="ColorRow">
      <button
        className={`inline-block w-6 h-6 mr-2 ${isOpaque ? 'opactiy-100' : 'opacity-10'}`}
        onClick={() => onClick && onClick(color, index)}
        style={{ background: `rgb(${color.join(",")})` }}
      ></button>
      <p>{text}</p>
    </div>
  )
}
