"use client"
import React, { useEffect, useState } from "react"
import { requestTimeseries } from "utils/state/map"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { globals } from "utils/state/globals"
import { initializeDb, loadTimeseriesData } from "utils/state/thunks"
import { Provider } from "react-redux"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import { columnsDict, timeSeriesConfig } from "utils/data/config"
import ConnectedScatterplot from "components/ConnectedScatterplot"

const configs: Record<string, {
  label: string,
  timeseriesConfig: keyof typeof timeSeriesConfig,
  scatterConfig: keyof typeof columnsDict
}> = {
  "HHI": {
    timeseriesConfig: "hhi",
    label: "Market Concentration",
    scatterConfig: "Market Concentration - 2020"
  },
  "HHI DS": {
    timeseriesConfig: "hhiDs",
    label: "Market Concentration (Dollar Stores)",
    scatterConfig: "Market Concentration - 2020 (With Dollar Stores)"
  },
  "Gravity": {
    timeseriesConfig: "gravity",
    label: "Food Access",
    scatterConfig: "Food Access Supply - 2020"
  },
  "Gravity DS": {
    timeseriesConfig: "gravityDs",
    label: "Food Access (Dollar Stores)",
    scatterConfig: "Food Access Supply - 2020 (With Dollar Stores)"
  }
} as const 

const ComparisonOverTimeChart: React.FC<any> = ({ id, placeName }) => {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const [_snap, setSnapshot] = useState<number>(0)
  const [variableSet1, setVariableSet1] = useState<keyof typeof configs>("Gravity")
  const [variableSet2, setVariableSet2] = useState<keyof typeof configs>("HHI")
  const [config1, config2] = [configs[variableSet1]!, configs[variableSet2]!]
  const hash = `${config1?.scatterConfig}-${config2?.scatterConfig}-${config1?.timeseriesConfig}-${config2?.timeseriesConfig}-${id}`
  const data = globals.ds.connectedScatterplotResults?.[hash]
  const ready = Boolean(data)
  const dispatch = useAppDispatch()
  const timeseriesLoaded = useAppSelector((state) => state.map.timeseriesDatasets)
  const dbStatus = useAppSelector((state) => state.map.dbStatus)

  useEffect(() => {
    dispatch(requestTimeseries(true))
    return () => {}
  }, [dispatch])

  useEffect(() => {
    if (timeseriesLoaded.includes(config1.timeseriesConfig) && timeseriesLoaded.includes(config2.timeseriesConfig)) {
      const main = async () => {
        globals.ds.getConnectedScatterplotData(
          id, 
          config1.scatterConfig,
          config2.scatterConfig,
          config1.timeseriesConfig,
          config2.timeseriesConfig
        ).then(() => {
          setSnapshot(performance.now())
        })
      }
      main()
    } else if (dbStatus === "uninitialized") {
      dispatch(initializeDb())
    } else if (dbStatus === "ready") {
      dispatch(loadTimeseriesData(config1.timeseriesConfig))
      dispatch(loadTimeseriesData(config2.timeseriesConfig))
    }
    return () => {}
  }, [dispatch, config1, config2, timeseriesLoaded, dbStatus])

  // const toggleGroupItemClasses =
  //   "px-4 hover:bg-violet3 color-mauve11 data-[state=on]:bg-violet6 data-[state=on]:text-violet12 flex h-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"

  return (
    <div>
      <h3 className="pb-2 font-sans font-bold">{placeName} over time</h3>
      connected scatterplot
      {/* <div className="relative w-full mb-4">
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
      </div> */}
      <div className="relative h-[50vh] w-full" ref={parentRef}>
        {!ready && <p>Loading data please wait</p>}
        {ready && (
          <ConnectedScatterplot
            parentRef={parentRef}
            pointsData={data.scatterData}
            linesData={data.linesData}
            xKey={config1.timeseriesConfig}
            yKey={config2.timeseriesConfig}
          >
          </ConnectedScatterplot>
        )}
      </div>
    </div>
  )
}

const ComparisonOverTimeChartOuter: React.FC<any> = ({ id, placeName }) => {
  return (
    <Provider store={store}>
      <ComparisonOverTimeChart id={id} placeName={placeName} />
    </Provider>
  )
}
export default ComparisonOverTimeChartOuter
