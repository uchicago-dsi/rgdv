import { withParentSize } from "@visx/responsive"
import { scaleLinear, scaleTime } from "@visx/scale"
import { Axis, LineSeries, Tooltip, XYChart } from "@visx/xychart"
import React from "react"
import { DataRecord, ResponsiveXYChartProps } from "./types"
const getMinMax = (data: DataRecord[], keys: string[]) => {
  const minMax: Record<string, { min: number; max: number }> = {}

  keys.forEach((key) => {
    minMax[key] = {
      min: Math.pow(10, 12),
      max: Math.pow(10, 12) * -1,
    }
  })
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    if (!row) {
      continue
    }
    for (const key of keys) {
      if (!row[key]) {
        continue
      }
      const currKey = minMax[key]!

      if (!currKey) {
        minMax[key] = {
          min: row[key],
          max: row[key],
        }
      }
      if (row[key] < currKey.min) {
        currKey.min = row[key]
      }
      if (row[key] > currKey.max) {
        currKey.max = row[key]
      }
    }
  }
  return minMax
}

const ResponsiveXYChart = withParentSize<ResponsiveXYChartProps>(
  ({ parentWidth, parentHeight, data, dataKey, yearKey }) => {
    // Define the margin for the chart
    const margin = { top: 20, right: 30, bottom: 50, left: 40 }
    const parsedData = data.map((d: DataRecord) => {
      return {
        ...d,
        [yearKey]: new Date(`${d[yearKey]}`),
      }
    })
    const minMax = getMinMax(parsedData, [yearKey, dataKey])
    // Scales for the chart
    const dateScale = scaleTime({
      // @ts-ignore
      domain: [minMax[yearKey].min, minMax[yearKey].max],
    })
    const valueScale = scaleLinear({
      // @ts-ignore
      domain: [minMax[dataKey].min, minMax[dataKey].max],
      nice: true,
    })

    return (
      <XYChart
        xScale={{ type: "time", scale: dateScale }}
        yScale={{ type: "linear", scale: valueScale}}
        width={parentWidth}
        height={Math.max(parentHeight, 300)} // Ensure the chart has a minimum height
        margin={margin}
      >
        <LineSeries
          dataKey="Line Data"
          data={parsedData}
          xAccessor={(d) => d[yearKey]}
          yAccessor={(d) => +d[dataKey]} // Ensure conversion to number
        />
        <Axis
          orientation="bottom"
          tickFormat={(d) => d.getFullYear()}
        />
        <Axis orientation="left" 
          numTicks={5}
          tickFormat={(d) => {
            return d
          }}
        />
        <Tooltip
          showVerticalCrosshair
          showSeriesGlyphs
          snapTooltipToDatumX
          snapTooltipToDatumY
          renderTooltip={({ tooltipData }) => (
            <div>
              {/* @ts-ignore */}
              <div>{`Date: ${tooltipData?.nearestDatum?.datum?.[yearKey]?.getFullYear() + 1}`}</div>
              {/* @ts-ignore */}
              <div>{`${dataKey}: ${tooltipData?.nearestDatum?.datum?.[dataKey]}`}</div>
            </div>
          )}
        />
      </XYChart>
    )
  }
)

const LineChart: React.FC<Omit<ResponsiveXYChartProps, "parentWidth" | "parentHeight">> = ({
  data,
  dataKey,
  yearKey,
}) => {
  return <ResponsiveXYChart data={data} dataKey={dataKey} yearKey={yearKey} />
}

export default LineChart
