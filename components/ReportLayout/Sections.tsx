import dynamic from "next/dynamic"
import React from "react"
import StatList from "components/StatList"
import TimeseriesChart from "components/TimeseriesChart"
import { columnsDict, type DataColumns, raceEthnicityLabels } from "utils/data/config"
import Tooltip from "components/Tooltip"

const Map = dynamic(() => import("components/Map/Map"), { ssr: false })
const StoreList = dynamic(() => import("components/StoreList"), { ssr: false })
// const ComparisonOverTimeChart = dynamic(() => import("components/ComparisonOverTime"), { ssr: false })
const PieChart = dynamic(() => import("components/PieChart/PieChart"), { ssr: false })
const ScatterplotStatefulWrapper = dynamic(() => import("components/ScatterPlot/ScaterplotStatefulWrapper"), {
  ssr: false,
})

export const Sections = [
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
  {
    key: "Scatterplot",
    Component: "Scatterplot",
    id: "scatterplot",
  },
]

export const ReportSections: React.FC<{
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
          <h3 className="pb-2 text-2xl">{data.NAME} Community Information</h3>
          <StatList stats={stats} data={data} />
        </div>
      )
    case "Pie Chart":
      return (
        <div id={divId}>
          <h3 className="pb-2 text-2xl">Race / Ethnicity

          <Tooltip
          explainer="Data for Race/Ethnicity comes from US Census American Community Survey (ACS) 2021 5-year estimates (2016 to 2021 data)."
          className="ml-2"
        />

          </h3>
          <PieChart data={raceData} dataKey="value" labelKey="raceEthnicity" labelMapping={raceEthnicityLabels} />
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
          <TimeseriesChart id={id} placeName={data.NAME} />
        </div>
      )
    case "Store List":
      let dataColumns: string[] | undefined = ["PARENT COMPANY", `PCT OF ${data?.UNIT?.toUpperCase() || ""} SALES`]
      if (unit === "tract") {
        dataColumns = undefined
      }
      if (unit === "national") {
        dataColumns = ["PARENT COMPANY", "PCT OF NATIONAL SALES"]
      }

      return (
        <div id={divId}>
          <StoreList
            id={id}
            columns={dataColumns}
            formatters={
              unit === "tract"
                ? undefined
                : {
                    [`PCT OF ${data?.UNIT?.toUpperCase() || ""} SALES`]: {
                      label: "Estimated Percent of Grocery Sales in " + data.NAME,
                      formatterPreset: "percent",
                    },
                  }
            }
          />
        </div>
      )
    case "Scatterplot":
      if (unit === "tract") {
        return null
      }
      return (
        <div id={divId} className="h-auto w-full">
          <ScatterplotStatefulWrapper
            options={Object.keys(columnsDict) as DataColumns[]}
            id={id}
            initialXVar="Market Concentration - 2023 (Most Recent)"
            initialYVar="Food Access Supply - 2020"
          />
        </div>
      )
    default:
      return <div>Component not found</div>
  }
}
