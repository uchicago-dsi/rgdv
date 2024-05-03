"use client"
import React, { useEffect, useState } from "react"
import LineChart from "components/LineChart"
import { ds } from "utils/data/service"
import { getTimeseriesChartProps } from "./types"
import { timeSeriesConfig } from "utils/data/config"
import { TimeseriesColumns } from "components/LineChart/types"

const TimeseriesChart: React.FC<getTimeseriesChartProps> = ({ id }) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading")
  const [dataset, setDataset] = useState<keyof typeof timeSeriesConfig>("hhi")
  const [variable, setVariable] = useState<TimeseriesColumns>("average")
  const data = ds.timeseriesResults[id]?.[dataset]

  useEffect(() => {
    const fetchData = async () => {
      await ds.initDb()
      await ds.initData()
      await ds.getTimeseries(id, dataset)
      if (ds.timeseriesResults[id][dataset]) {
        setStatus("loaded")
      } else {
        setStatus("error")
      }
    }
    fetchData()
  }, [id, variable])

  return (
    <div>
      TimeseriesChart {id}
      <div className="h-[50vh] w-full">
        {status === "loaded" ? (
          <LineChart data={data} timeseriesConfigKey={dataset} dataKey={variable} />
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
