"use client"
import React, { useEffect, useState } from "react"
import LineChart from "components/LineChart"
import { getTimeseriesChartProps } from "./types"
import { timeSeriesConfig } from "utils/data/config"
import { TimeseriesColumns } from "components/LineChart/types"

const TimeseriesChart: React.FC<getTimeseriesChartProps> = ({ id }) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading")
  const [dataset, setDataset] = useState<keyof typeof timeSeriesConfig>("hhi")
  const [variable, setVariable] = useState<TimeseriesColumns>("average")

  return (
    <div>
      TimeseriesChart {id}
      <div className="h-[50vh] w-full">
        {status === "loaded" ? (
          null
          // <LineChart data={[] as any} timeseriesConfigKey={dataset} dataKey={variable} />
        ) : status === "loading" ? (
          <p>Loading data please wait</p>
        ) : (
          <p>Failed to load data</p>
        )}
      </div>
    </div>
  )
}

export default TimeseriesChart
