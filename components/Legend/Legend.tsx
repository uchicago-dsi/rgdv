import LegendBreakText from "components/LegendBreakText"
import { LegendProps } from "./types"

export const Legend: React.FC<LegendProps> = ({ title, isBivariate, colors, breaks }) => {
  if (isBivariate && Array.isArray(colors?.[0]?.[0])) {
    return (
      <div className="ColorLegend">
        <h3>{title}</h3>

        <div className="relative mb-8 flex h-12 w-12 translate-x-4 translate-y-4 -rotate-[135deg] flex-row">
          {colors.map((crow: number[][], i) => (
            <div key={i}>
              {crow.map((c: number[], j: number) => (
                <div className="h-4 w-4" style={{ background: `rgb(${c.join(",")})` }} key={`${i}-${j}`}></div>
              ))}
            </div>
          ))}
          <p className="absolute left-0 top-0">asdf</p>
          <p className="absolute right-0 top-0">asdf2</p>
        </div>
      </div>
    )
  } else {
    return (
      <div className="ColorLegend">
        <h3>{title}</h3>
        {!!(colors?.length && breaks?.length) &&
          colors.map((_, i) => <LegendBreakText key={i} colors={colors as any} breaks={breaks as any} index={i} />)}
        <p style={{ maxWidth: "35ch", fontSize: "0.75rem" }}>{/* <i>{currentDataSpec?.attribution}</i> */}</p>
      </div>
    )
  }
}
