"use client"
import React, { useEffect, useState } from "react"
import LineChart from "components/LineChart"
import { TimeseriesChartProps } from "./types"
import { timeSeriesAggregates, timeSeriesConfig } from "utils/data/config"
import { requestTimeseries } from "utils/state/map"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { globals } from "utils/state/globals"
import { initializeDb, loadTimeseriesData } from "utils/state/thunks"
import { Provider } from "react-redux"
import { DimensionProps } from "components/LineChart/types"
import * as ToggleGroup from "@radix-ui/react-toggle-group"

const datasetOptions = Object.entries(timeSeriesConfig).map(([key, value]) => ({
  key,
  value,
}))

const TimeseriesChart: React.FC<TimeseriesChartProps> = ({ id, placeName }) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const [_snap, setSnapshot] = useState<number>(0)
  const [tsVariable, setTsVariable] = useState<keyof typeof timeSeriesConfig>("hhi")

  const tsConfig = timeSeriesConfig[tsVariable]
  const tsData = globals.ds.timeseriesResults?.[id]?.[tsVariable]
  const isTract = Boolean(id.length === 11)
  const ready = Boolean(tsData?.length > 0)
  const isReadyTract = Boolean(ready && isTract)
  const isReadyAggregate = Boolean(ready && !isTract)
  const dispatch = useAppDispatch()
  const timeseriesLoaded = useAppSelector((state) => state.map.timeseriesDatasets)
  const dbStatus = useAppSelector((state) => state.map.dbStatus)

  useEffect(() => {
    dispatch(requestTimeseries(true))
    return () => {}
  }, [dispatch])

  useEffect(() => {
    if (timeseriesLoaded.includes(tsVariable)) {
      const main = async () => {
        globals.ds.getTimeseries(id, tsVariable).then(() => {
          setSnapshot(performance.now())
        })
      }
      main()
    } else if (dbStatus === "uninitialized") {
      dispatch(initializeDb())
    } else if (dbStatus === "ready") {
      dispatch(loadTimeseriesData(tsVariable))
    }
    return () => {}
  }, [dispatch, tsVariable, timeseriesLoaded, dbStatus])
  const Labels = labels[tsVariable]
  const toggleGroupItemClasses =
    "px-4 hover:bg-violet3 color-mauve11 data-[state=on]:bg-violet6 data-[state=on]:text-violet12 flex h-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"

  return (
    <div>
      <h3 className="pb-2 font-sans font-bold">{placeName} over time</h3>
      <div className="relative w-full mb-4">
        <ToggleGroup.Root
          className="inline-flex space-x-px rounded bg-mauve6 shadow-[0_2px_10px] shadow-blackA4"
          type="single"
          defaultValue="hhi"
          aria-label="Text alignment"
          onValueChange={(value) => {
            setTsVariable(value as keyof typeof timeSeriesConfig)
          }}
        >
          <ToggleGroup.Item className={toggleGroupItemClasses} value="hhi" aria-label="Left aligned">
            Market Concentration
          </ToggleGroup.Item>
          <ToggleGroup.Item className={toggleGroupItemClasses} value="hhiDs" aria-label="Center aligned">
            Market Concentration (Dollar Stores)
          </ToggleGroup.Item>
          <ToggleGroup.Item className={toggleGroupItemClasses} value="gravity" aria-label="Center aligned">
            Food Access
          </ToggleGroup.Item>
          <ToggleGroup.Item className={toggleGroupItemClasses} value="gravityDs" aria-label="Center aligned">
            Food Access (Dollar Stores)
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div className="relative h-[50vh] w-full" ref={parentRef}>
        {!ready && <p>Loading data please wait</p>}
        {isReadyTract && (
          <LineChart
            data={tsData}
            dataKey={"value"}
            yearKey={"year"}
            parentRef={parentRef}
            // lowerBandKey={tsConfig.lowerBandKey}
            // upperBandKey={tsConfig.upperBandKey}
          >
            <Labels />
          </LineChart>
        )}
        {isReadyAggregate && (
          <LineChart data={tsData} yearKey={"year"} aggregates={timeSeriesAggregates} parentRef={parentRef}>
            <Labels />
          </LineChart>
        )}
      </div>
    </div>
  )
}

const HhiLabels: React.FC<Partial<DimensionProps>> = ({ xMin, xMax, yMin, yMax }) => {
  if (xMin === undefined || xMax === undefined || yMin === undefined || yMax === undefined) {
    return null
  }
  // svg label at top right corner of chart
  return (
    <>
      <text x={xMin + 10} y={yMax - 10} fontSize={12} textAnchor="start">
        Less Concentrated Market
      </text>
      <text x={xMin + 10} y={yMin + 10} fontSize={12} textAnchor="start">
        More Concentrated Market
      </text>
    </>
  )
}

const GravityLabels: React.FC<Partial<DimensionProps>> = ({ xMin, xMax, yMin, yMax }) => {
  if (xMin === undefined || xMax === undefined || yMin === undefined || yMax === undefined) {
    return null
  }
  // svg label at top right corner of chart
  return (
    <>
      <text x={xMin + 10} y={yMax - 10} fontSize={12} textAnchor="start">
        Poorer Food Supply Accessibility
      </text>
      <text x={xMin + 10} y={yMin + 10} fontSize={12} textAnchor="start">
        Better Food Supply Accessibility
      </text>
    </>
  )
}

const labels: Record<keyof typeof timeSeriesConfig, React.FC<Partial<DimensionProps>>> = {
  hhi: HhiLabels,
  hhiDs: HhiLabels,
  gravity: GravityLabels,
  gravityDs: GravityLabels,
}
const TimeseriesChartOuter: React.FC<TimeseriesChartProps> = ({ id, placeName }) => {
  return (
    <Provider store={store}>
      <TimeseriesChart id={id} placeName={placeName} />
    </Provider>
  )
}
export default TimeseriesChartOuter
