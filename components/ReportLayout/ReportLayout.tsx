"use server"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import dynamic from "next/dynamic"
import React from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import DataLockup from "components/DataLockup"
import StatList from "components/StatList"
import TabsComponent from "components/Tabs/Tabs"
import TimeseriesChart from "components/TimeseriesChart"
import { getMdxContent } from "hooks/useMdxContent"
import { renderReportText } from "utils/data/renderReportText"
import { getSummaryStats } from "utils/data/summaryStats"
import { ReportLayoutProps } from "./types"
import { SectionScroll } from "./SectionScroll"

const Map = dynamic(() => import("components/Map/Map"), { ssr: false })
const StoreList = dynamic(() => import("components/StoreList"), { ssr: false })
// const ComparisonOverTimeChart = dynamic(() => import("components/ComparisonOverTime"), { ssr: false })
const PieChart = dynamic(() => import("components/PieChart/PieChart"), { ssr: false })

const units = {
  2: "state",
  5: "county",
  11: "tract",
} as const

const Sections = [
  {
    key: "Market Composition",
    Component: "Store List",
    id: "marketComposition",
  },
  {
    key: "Community Information",
    Component: "Key Statistics",
    id: "keyStatistics",
  },
  {
    key: "Race / Ethnicity",
    Component: "Pie Chart",
    id: "racialComposition",
  },
  {
    key: "Map",
    Component: "Map",
    id: "map",
  },
  {
    key: "Change Over Time",
    Component: "Timeseries",
    id: "timeseries",
  },
]

const ReportSections: React.FC<{
  component: string
  id: string
  divId: string
  data: any
  stats: any
  raceData: any
  unit: string
}> = ({ component, id, data, stats, raceData, unit, divId }) => {
  switch (component) {
    case "Key Statistics":
      return (
        <div id={divId}>
          <h3 className="pb-2 text-2xl">Community Information</h3>
          <StatList stats={stats} data={data} />
        </div>
      )
    case "Pie Chart":
      return (
        <div id={divId}>
          <h3 className="pb-2 text-2xl">Race / Ethnicity</h3>
          <PieChart data={raceData} dataKey="value" labelKey="raceEthnicity" />
        </div>
      )
    case "Map":
      return (
        <div id={divId}>
          <h3 className="pb-2 text-2xl">Area Map</h3>
          <div className="relative h-[50vh] overflow-hidden">
            <Map initialFilter={id} />
          </div>
        </div>
      )
    case "Timeseries":
      return (
        <div className="w-full" id={divId}>
          <TimeseriesChart id={id} placeName={data.name} />
        </div>
      )
    case "Store List":
      return (
        <div id={divId}>
          <StoreList
            id={id}
            columns={unit === "tract" ? undefined : ["PARENT COMPANY", `PCT OF ${data.UNIT.toUpperCase()} SALES`]}
            formatters={
              unit === "tract"
                ? undefined
                : {
                    [`PCT OF ${data.UNIT.toUpperCase()} SALES`]: {
                      label: "Estimated Percent of Grocery Sales in " + data.name,
                      formatterPreset: "percent",
                    },
                  }
            }
          />
        </div>
      )
    default:
      return <div>Component not found</div>
  }
}

export const ReportLayout: React.FC<ReportLayoutProps> = async ({ id }) => {
  const unit = units[id.length as keyof typeof units]

  const [_data, statText] = await Promise.all([
    getSummaryStats<any>(unit, id),
    getMdxContent("statistics", "primary.mdx"),
  ])

  if (!_data.ok) {
    return <div>Sorry, we couldn&apos;t find data for that place.</div>
  }

  const { stats, name, data, foodAccess, marketPower, segregation, economicAdvantage, descriptionText, raceData } =
    renderReportText(_data.result!, statText, id)

  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="col-span-1">
          <a href={`/${data.UNIT}`} className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to {data.UNIT_PLURAL}
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light uppercase">{data.UNIT} REPORT</h2>
            <h1 className="mb-0">{name}</h1>
            <p className="text-sm">
              <TinaMarkdown content={descriptionText} />
            </p>
          </div>
        </div>
        <div className="col-start-2 col-end-6 py-8">
          <div className="relative grid gap-8 lg:grid-cols-4">
            <DataLockup
              title={foodAccess.title}
              tooltip={foodAccess.tooltip}
              value={+foodAccess.value}
              description={foodAccess.text}
              border
            />
            <DataLockup
              title={marketPower.title}
              tooltip={marketPower.tooltip}
              value={+marketPower.value}
              description={marketPower.text}
              border
              inverted
            />
            <DataLockup
              title={economicAdvantage.title}
              tooltip={economicAdvantage.tooltip}
              value={economicAdvantage.value}
              description={economicAdvantage.text}
              border
              inverted
            />
            <DataLockup
              title={segregation.title}
              tooltip={segregation.tooltip}
              value={segregation.value}
              description={segregation.text}
              inverted
            />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* first grid col */}
        <div className="prose sticky top-0 col-span-1 h-min bg-white/50 p-4 shadow-xl">
          <h3>Report Sections</h3>
          <ul className="list-disc pl-6">
            <SectionScroll sections={Sections} />
          </ul>
        </div>
        <div className="col-span-3 mr-4 flex flex-col bg-white/50 p-4 shadow-xl" style={{ gap: "12rem" }}>
          {Sections.map((section) => (
            <ReportSections
              divId={section.id}
              key={section.key}
              component={section.Component}
              id={id}
              data={data}
              stats={stats}
              raceData={raceData}
              unit={unit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
