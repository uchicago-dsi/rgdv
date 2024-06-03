"use server"
import React from "react"
import { getMdxContent } from "hooks/useMdxContent"
import { getSummaryStats } from "utils/data/summaryStats"
import { ReportLayoutProps } from "./types"
import ComparabilityProvider from "./ComparabilityProvider"
import { ReportRenderer } from "./ReportRenderer"
import { ClientReportRenderer } from "./ClientReportRenderer"

const units = {
  2: "state",
  5: "county",
  11: "tract",
} as const

const comparability = {
  2: ["national"],
  5: ["national", "state"],
  11: ["national", "state", "county"],
} as const

export const ReportLayout: React.FC<ReportLayoutProps> = async ({ id }) => {
  const unit = units[id.length as keyof typeof units]
  const comparabilityOptions = comparability[id.length as keyof typeof comparability]
  const [_data, statText] = await Promise.all([
    getSummaryStats<any>(unit, id),
    getMdxContent("statistics", "primary.mdx"),
  ])

  if (!_data.ok) {
    return <div>Sorry, we couldn&apos;t find data for that place.</div>
  }

  return (
    <ComparabilityProvider comparabilityOptions={comparabilityOptions}>
      <ClientReportRenderer id={id} _data={_data} statText={statText} unit={unit}>
        <ReportRenderer id={id} _data={_data} statText={statText} unit={unit} />
      </ClientReportRenderer>
    </ComparabilityProvider>
  )
}
