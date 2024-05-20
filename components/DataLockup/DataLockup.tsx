import PercentileLineChart from "components/PercentileLineChart"
import { DataLockupProps } from "./types"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import Tooltip from "components/Tooltip"

export const DataLockup: React.FC<DataLockupProps> = ({ title, tooltip, value, description, border, sigFigs, inverted}) => {
  const pow = Math.pow(10, sigFigs || 0)
  return (
    <div className={`${border ? "border-solid border-r-neutral-500 lg:border-r-2" : ""} lg:pr-8`}>
      <div className="flex items-center">
        <h3 className="font-weight-900 font-sans text-xl">{title}</h3>
        <Tooltip explainer={<TinaMarkdown content={tooltip} />} side="bottom" size="sm" withArrow />
      </div>
      <h4 className="font-serif text-6xl">{Math.round(value*pow)/pow}</h4>
      <PercentileLineChart value={value} inverted={inverted} />
      {description ? <TinaMarkdown content={description} /> : null}
    </div>
  )
}
