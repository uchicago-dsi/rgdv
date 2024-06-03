import React from "react"
import dynamic from "next/dynamic"
import StatList from "components/StatList"
import TimeseriesChart from "components/TimeseriesChart"

const Map = dynamic(() => import("components/Map/Map"), { ssr: false })
const StoreList = dynamic(() => import("components/StoreList"), { ssr: false })
// const ComparisonOverTimeChart = dynamic(() => import("components/ComparisonOverTime"), { ssr: false })
const PieChart = dynamic(() => import("components/PieChart/PieChart"), { ssr: false })

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
