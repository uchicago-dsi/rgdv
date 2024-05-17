"use client"
import { scaleLinear, scaleTime } from "@visx/scale"
import { Axis, Tooltip } from "@visx/xychart"
import React, { useCallback, useRef } from "react"
import { LineChartProps } from "./types"
import { timeSeriesConfig } from "utils/data/config"
import { Threshold } from "@visx/threshold"
import { LinePath } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { localPoint } from "@visx/event"
import { bisector } from "@visx/vendor/d3-array"
import { useParentSize } from "@cutting/use-get-parent-size"
import { curveLinear, curveMonotoneX, curveStep } from "@visx/curve"
import { useTooltip, useTooltipInPortal } from "@visx/tooltip"

const bisectDate = bisector<any, Date>((d: any) => new Date(d.date)).left

const getMinMax = <T extends Record<string, any>>(data: Array<T>, keys: Array<keyof T>) => {
  const minMax: Record<keyof T, { min: number; max: number }> = {} as any
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
const niceNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  // compact
  notation: "compact",
})

const LineChart = <T extends Record<string, any>>({
  data,
  dataKey,
  yearKey,
  parentRef,
  children,
  aggregates,
}: LineChartProps<T>) => {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  })
  console.log(tooltipData, tooltipLeft)
  const { width, height } = useParentSize(parentRef)
  const parentWidth = width ?? 100
  const parentHeight = height ?? 100
  // Define the margin for the chart
  const margin = { top: 20, right: 30, bottom: 50, left: 40 }
  const xMax = parentWidth
  const yMax = parentHeight - margin.top - margin.bottom
  const minMaxToFind = aggregates ? [yearKey, ...aggregates.map((f) => f.role)] : [dataKey!, yearKey]
  const minMax = getMinMax(data, minMaxToFind)

  const modifiedChildren = React.Children.map(children || [], (child) =>
    React.cloneElement(child, { xMax, yMax, yMin: margin.bottom, xMin: margin.left })
  )
  // Scales for the chart
  const dateScale = scaleTime({
    domain: [minMax[yearKey].min, minMax[yearKey].max],
    range: [margin.left, xMax],
  })
  const valueRange = aggregates
    ? // @ts-ignore
      [minMax["q05"]?.min, minMax["q95"]?.max]
    : // @ts-ignore
      [minMax[dataKey].min, minMax[dataKey].max]

  const valueScale = scaleLinear({
    // @ts-ignore
    domain: valueRange,
    range: [yMax, margin.bottom],
    nice: true,
  })

  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x,y } = localPoint(event) || { x: 0 }
      const x0 = dateScale.invert(x)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      let d = d0
      if (d1 && d1.year) {
        // @ts-ignore
        d = x0.valueOf() - d0.year.valueOf() > d1.year.valueOf() - x0.valueOf() ? d1 : d0
      }
      showTooltip({
        // @ts-ignore
        tooltipLeft: x,
        // @ts-ignore
        tooltipTop: y,
        tooltipData: d
      });
    },
    [
      showTooltip,
      valueScale,
      dateScale,
    ]
  )

  return (
    <>
      <svg
        ref={containerRef}
        width={parentWidth}
        height={Math.max(parentHeight, 300)} // Ensure the chart has a minimum height
      >
        {modifiedChildren}
        {!!dataKey && (
          <LinePath
            stroke={"black"}
            strokeWidth={2}
            data={data}
            x={(d) => dateScale(d[yearKey]) ?? 0}
            y={(d) => valueScale(d[dataKey]) ?? 0}
            curve={curveMonotoneX}
            shapeRendering="geometricPrecision"
          />
        )}
        {!!aggregates && (
          <>
            <LinePath
              stroke={"black"}
              strokeWidth={2}
              data={data}
              x={(d) => dateScale(d[yearKey]) ?? 0}
              y={(d) => valueScale(d["median"]) ?? 0}
              curve={curveMonotoneX}
              shapeRendering="geometricPrecision"
            />
            {/* threshold of q75 and q25 */}
            <Threshold
              id="Q25-Q75 Range"
              data={data}
              x={(d) => dateScale(d[yearKey]) ?? 0}
              y0={(d) => valueScale(d["q75"]) ?? 0}
              y1={(d) => valueScale(d["q25"]) ?? 0}
              clipAboveTo={(d) => valueScale(d["q75"]) ?? 0}
              clipBelowTo={(d) => valueScale(d["q25"]) ?? 0}
              curve={curveMonotoneX}
              belowAreaProps={{
                fill: "violet",
                fillOpacity: 0,
              }}
              aboveAreaProps={{
                fill: "gray",
                stroke: "black",
                strokeDasharray: "2,2",
                strokeOpacity: 0.5,
                strokeWidth: 1,
                fillOpacity: 0.35,
              }}
            />
            {/* threshold of q05  and q95 */}
            <Threshold
              id="Q05-Q95 Range"
              data={data}
              x={(d) => dateScale(d[yearKey]) ?? 0}
              y0={(d) => valueScale(d["q95"]) ?? 0}
              y1={(d) => valueScale(d["q05"]) ?? 0}
              clipAboveTo={(d) => valueScale(d["q95"]) ?? 0}
              clipBelowTo={(d) => valueScale(d["q05"]) ?? 0}
              belowAreaProps={{
                fill: "violet",
                fillOpacity: 0,
              }}
              aboveAreaProps={{
                fill: "gray",
                stroke: "black",
                strokeDasharray: "1,4",
                strokeOpacity: 0.5,
                strokeWidth: 1,
                fillOpacity: 0.15,
              }}
            />
          </>
        )}
        {/* @ts-ignore */}
        {/* <Threshold
          id="Q25-Q75 Range"
          data={parsedData}
          x={(d) => dateScale(d[yearKey])}
          // y0={d => valueScale(0.2)}
          // y1={d => valueScale(0.4)}
          y0={(d) => valueScale(d["q75"])}
          y1={(d) => valueScale(d["q25"])}
          clipAboveTo={0}
          // clipBelowTo={yMax}
          // curve={curveBasis}
          belowAreaProps={{
            fill: "violet",
            fillOpacity: 0,
          }}
          aboveAreaProps={{
            fill: "gray",
            fillOpacity: 0.1,
          }}
        /> */}
        <Axis orientation="bottom" tickFormat={(d) => d.getFullYear()} />
        <AxisBottom top={yMax} scale={dateScale} numTicks={parentWidth > 520 ? 10 : 5} />
        <AxisLeft scale={valueScale} left={margin.left} tickFormat={(num: any) => niceNumberFormatter.format(num)} />
        <rect
          x={margin.left}
          y={margin.top}
          width={xMax - margin.left}
          height={yMax}
          fill="transparent"
          onMouseMove={handleTooltip}
          onMouseLeave={() => {
            hideTooltip();
          }}
        />
        <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            Data value <strong>{JSON.stringify(tooltipData)}</strong>
          </TooltipInPortal>
      </svg>

      <div id="legend" className="absolute right-0 top-0 flex flex-row space-x-8 p-1">
        <div className="flex flex-row items-center space-x-2">
          <span className="h-4 border-l-2 border-black"></span>
          <p>Median Tract</p>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <span className="h-4 w-4 border-2 border-dashed border-black bg-gray-900 bg-opacity-35"></span>
          <p>50% of tracts (Quantile 25 to 75)</p>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <span className="h-4 w-4 border-2 border-dashed border-black bg-gray-900 bg-opacity-15"></span>
          <p>90% of tracts (Quantile 5 to 95)</p>
        </div>
      </div>
    </>
  )
}

// const AggregateLegend: React.FC<{
//   xMin: number
//   xMax: number
//   yMin: number
//   yMax: number
// }> = ({xMin,
//   xMax,
//   yMin,
//   yMax
// }) => {
//   // an svg legend noting the following
//   // black line for median
//   // gray for 50% of tracts
//   // light gray for 90% of tracts
//   return (
//     <>
//       <text x={xMin + 10} y={yMax - 10} fontSize={12} textAnchor="start">
//         Median
//       </text>
//       <text x={xMin + 10} y={yMin + 10} fontSize={12} textAnchor="start">
//         50% of tracts
//       </text>
//       <text x={xMin + 10} y={yMin + 30} fontSize={12} textAnchor="start">
//         90% of tracts
//       </text>
//     </>
//   )
// }
export default LineChart
