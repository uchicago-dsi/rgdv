import { TinaMarkdown } from "tinacms/dist/rich-text"
import PercentileLineChart from "components/PercentileLineChart"
import Tooltip from "components/Tooltip"
import { DataLockupProps } from "./types"

export const DataLockup: React.FC<DataLockupProps> = ({
  title,
  tooltip,
  value,
  description,
  border,
  sigFigs,
  inverted,
}) => {
  const pow = Math.pow(10, sigFigs || 0)
  const cleanedUpValue = Number.isNaN(+value) ? value : Math.round(value * pow) / pow

  return (
    <div className={`${border ? "border-solid border-r-neutral-500 lg:border-r-2" : ""} lg:pr-8`}>
      <div className="flex items-start justify-start">
        <h3 className="font-weight-900 min-h-[3rem] max-w-full font-sans text-xl leading-6">{title}</h3>
        <Tooltip explainer={<TinaMarkdown content={tooltip} />} side="bottom" size="sm" withArrow />
      </div>
      <h4 className="font-serif text-6xl">{cleanedUpValue}</h4>
      <PercentileLineChart value={value} inverted={inverted} />
      {description ? <TinaMarkdown content={description} /> : null}
    </div>
  )
}
