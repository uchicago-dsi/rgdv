"use client"
import { scaleLinear, scaleTime } from "@visx/scale"
import { Axis, Tooltip } from "@visx/xychart"
import React, { useCallback } from "react"
import { LineChartProps } from "./types"
import { timeSeriesConfig } from "utils/data/config"
import { Threshold } from "@visx/threshold"
import { LinePath } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { localPoint } from "@visx/event"
import { bisector } from "@visx/vendor/d3-array"
import { useParentSize } from "@cutting/use-get-parent-size"
import { curveLinear } from "@visx/curve"

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

const LineChart = <T extends Record<string, any>>({ data, dataKey, yearKey, parentRef, children }: LineChartProps<T>) => {
  const { width, height } = useParentSize(parentRef)
  const parentWidth = width ?? 100
  const parentHeight = height ?? 100
  // Define the margin for the chart
  const margin = { top: 20, right: 30, bottom: 50, left: 40 }
  const xMax = parentWidth
  const yMax = parentHeight - margin.top - margin.bottom
  const minMax = getMinMax(data, [dataKey, yearKey])

  const modifiedChildren = React.Children.map(children||[], child =>
    React.cloneElement(child, { xMax, yMax, yMin: margin.bottom, xMin: margin.left })
  );
  // Scales for the chart
  const dateScale = scaleTime({
    // @ts-ignore
    domain: [minMax[yearKey].min, minMax[yearKey].max],
    range: [margin.left, xMax],
  })
  const valueScale = scaleLinear({
    // @ts-ignore
    domain: [minMax[dataKey].min, minMax[dataKey].max],
    range: [yMax, margin.bottom],
    nice: true,
  })

  // const handleTooltip = useCallback(
  //   (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
  //     const { x } = localPoint(event) || { x: 0 }
  //     const x0 = dateScale.invert(x)
  //     const index = bisectDate(parsedData, x0, 1)
  //     const d0 = parsedData[index - 1]
  //     const d1 = parsedData[index]
  //     let d = d0
  //     if (d1 && d1.year) {
  //       // @ts-ignore
  //       d = x0.valueOf() - d0.year.valueOf() > d1.year.valueOf() - x0.valueOf() ? d1 : d0
  //     }
  //     console.log(d, x)
  //     // showTooltip({
  //     //   tooltipData: d,
  //     //   tooltipLeft: x,
  //     //   tooltipTop: stockValueScale(getStockValue(d)),
  //     // });
  //   },
  //   [
  //     // showTooltip, stockValueScale,
  //     dateScale,
  //   ]
  // )

  return (
    <svg
      width={parentWidth}
      height={Math.max(parentHeight, 300)} // Ensure the chart has a minimum height
    >
      {modifiedChildren}
      <LinePath
        stroke={"black"}
        strokeWidth={2}
        data={data}
        x={(d) => dateScale(d[yearKey]) ?? 0}
        y={(d) => valueScale(d[dataKey]) ?? 0}
        curve={curveLinear}
        shapeRendering="geometricPrecision"
      />
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
      <AxisLeft scale={valueScale} left={margin.left} tickFormat={(num:any) => niceNumberFormatter.format(num)}/>
      <Tooltip
        showVerticalCrosshair
        showSeriesGlyphs
        snapTooltipToDatumX
        snapTooltipToDatumY
        renderTooltip={({ tooltipData }) => (
          <div>
            {JSON.stringify(tooltipData?.nearestDatum)}
            {/* <div>{`Date: ${tooltipData?.nearestDatum?.datum?.[yearKey]?.getFullYear() + 1}`}</div>
              <div>{`${"average"}: ${tooltipData?.nearestDatum?.datum?.["average"]}`}</div>
              <div>{`${"q25"}: ${tooltipData?.nearestDatum?.datum?.["q25"]}`}</div>
              <div>{`${"q75"}: ${tooltipData?.nearestDatum?.datum?.["q75"]}`}</div> */}
          </div>
        )}
      />
    </svg>
  )
}

export default LineChart
