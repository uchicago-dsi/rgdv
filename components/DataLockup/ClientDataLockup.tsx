"use client"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import PercentileLineChart from "components/PercentileLineChart"
import Tooltip from "components/Tooltip"
import { DataLockupProps } from "./types"
import { useComparability } from "components/ReportLayout/ComparabilityProvider"

export const ClientDataLockup: React.FC<DataLockupProps & { children: React.ReactNode }> = ({
  children,
  ...props
}) => {
  const { comparability } = useComparability()
  const isServer = typeof window === "undefined"
  return (
    <div>
      asdf asdf asdf
      {true && children}
    </div>
  )
}
