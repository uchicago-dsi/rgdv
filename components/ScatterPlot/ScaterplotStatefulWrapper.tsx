"use client"
// ScatterPlotWrapper.tsx
import React, { useEffect, useState } from "react"
import ScatterPlot from "./ScatterPlot"
import { ScatterPlotWrapperProps } from "./types"
import * as Select from "@radix-ui/react-select"
import { globals } from "utils/state/globals"
import { columnsDict, type DataColumns } from "utils/data/config"
import { store, useAppSelector } from "utils/state/store"
import { Provider } from "react-redux"
import { SelectMenu } from "components/Select/Select"
import { useParentSize } from "@visx/responsive"
// import HeatmapComponent from "components/Heatmap/Heatmap"

const ScatterPlotWrapper: React.FC<ScatterPlotWrapperProps> = ({
  id,
  options = Object.keys(columnsDict),
  initialXVar,
  initialYVar,
}) => {
  const { width, height, parentRef } = useParentSize()
  const [xVar, setXVar] = useState<DataColumns>(initialXVar! || options?.[0]! || Object.keys(columnsDict)[0])
  const [yVar, setYVar] = useState<DataColumns>(initialYVar! || options?.[1]! || Object.keys(columnsDict)[1])
  const [data, setData] = useState<Record<string, any>[]>([])
  // const [heatmapData, setHeatmapData] = useState<any>(null)
  const handleXChange = (value: DataColumns) => setXVar(value)
  const handleYChange = (value: DataColumns) => setYVar(value)
  const dbStatus = useAppSelector((state) => state.map.dbStatus)
  useEffect(() => {
    const main = async () => {
      if (dbStatus !== "ready" || !id) return
      // @ts-ignore
      const data = await globals.ds.getScatterPlotData(id, xVar, yVar, xVar, yVar, true)
      // const heatmapData = await globals.ds.getHeatMapData({
      //   variableX: xVar,
      //   variableY: yVar,
      // })
      // setHeatmapData(heatmapData)
      setData(data)
    }
    main()
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbStatus, id, xVar, yVar])

  if (!data.length) return null

  return (
    <>
    <div className="pb-12 w-full" ref={parentRef}>
      <div className="select-menus flex flex-col md:flex-row items-center gap-4" >
      <h3 className="text-2xl">Scatterplot</h3>
        <div className="flex flex-row items-center gap-4 border-2  border-r-0 pl-4">
          <p>X Variable</p>
          <SelectMenu title="Choose X Variable" value={xVar} onValueChange={handleXChange}>
            {options.map((key, i) => (
              <Select.Item key={i} value={key}>
                <Select.ItemText>{key}</Select.ItemText>
              </Select.Item>
            ))}
          </SelectMenu>
        </div>
        <div className="flex flex-row items-center gap-4 border-2 pl-4">
          <p>Y Variable</p>
          <SelectMenu title="Choose Y Variable" value={yVar} onValueChange={handleYChange}>
            {options.map((key, i) => (
              <Select.Item key={i} value={key}>
                <Select.ItemText>{key}</Select.ItemText>
              </Select.Item>
            ))}
          </SelectMenu>
        </div>
      </div>

      <div className="relative h-[50vh] w-full">
        <ScatterPlot data={data} xVar={xVar} yVar={yVar} showRegressionLine={true} />
      </div>
    </div>

    {/* <div className="relative h-[50vh] w-full">
      heatmap here...
        {heatmapData?.data && <HeatmapComponent 
          data={heatmapData.data} 
          // width={width}
          // height={height}
          // showRegressionLine={true} 
          colorMax={heatmapData.countMax}
          bucketSizeMax={heatmapData.bucketSizeMax}
          />}
      </div> */}
            </>
  )
}

const ScatterPlotWrapperOuter: React.FC<ScatterPlotWrapperProps> = ({
  id,
  options = Object.keys(columnsDict),
  initialXVar,
  initialYVar,
}) => {
  return (
    <Provider store={store}>
      {/* @ts-ignore */}
      <ScatterPlotWrapper id={id} options={options} initialXVar={initialXVar} initialYVar={initialYVar} />
    </Provider>
  )
}
export default ScatterPlotWrapperOuter
