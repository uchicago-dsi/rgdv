import { Axis, LineSeries,  Tooltip, XYChart } from "@visx/xychart"
import { scaleLinear, scaleTime } from "@visx/scale"
import { withParentSize } from "@visx/responsive"
import React from "react"
import { DataRecord, ResponsiveXYChartProps } from "./types"

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
    // Scales for the chart
    const dateScale = scaleTime({
      // @ts-ignore
      domain: [Math.min(...parsedData.map((d) => d[yearKey])), Math.max(...parsedData.map((d) => d[yearKey]))],
    })

    const valueScale = scaleLinear({
      domain: [0, Math.max(...parsedData.map((d) => +d[dataKey]))], // Ensure conversion to number
      nice: true,
    })

    return (
      <XYChart
        xScale={{ type: "time", scale: dateScale }}
        yScale={{ type: "linear", scale: valueScale }}
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
          tickFormat={(d) => {
            console.log(d)
            return d.getFullYear()
          }}
        />
        <Axis orientation="left" />
        <Tooltip
          showVerticalCrosshair
          showSeriesGlyphs
          snapTooltipToDatumX
          snapTooltipToDatumY
          renderTooltip={({ tooltipData }) => (
            <div>
              {/* @ts-ignore */}
              <div>{`Date: ${tooltipData?.nearestDatum?.datum?.[yearKey]?.getFullYear()+1}`}</div>
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
