import { withParentSize } from "@visx/responsive"
import { scaleLinear, scaleTime } from "@visx/scale"
import { Axis, AreaSeries, LineSeries, Tooltip, XYChart } from "@visx/xychart"
import React, { useCallback } from "react"
import { DataRecord, ResponsiveXYChartProps } from "./types"
import { timeSeriesConfig } from "utils/data/config"
import { Threshold } from "@visx/threshold"
import { curveBasis } from "@visx/curve"
import { LinePath } from "@visx/shape"
import { AxisLeft, AxisBottom } from "@visx/axis"
import { localPoint } from '@visx/event';
import { max, extent, bisector } from '@visx/vendor/d3-array';

const bisectDate = bisector<any, Date>((d: any) => new Date(d.date)).left;
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

const yearKey = "year"
const ResponsiveXYChart = withParentSize<ResponsiveXYChartProps>(
  ({ parentWidth, parentHeight, data, timeseriesConfigKey, dataKey }) => {
    // Define the margin for the chart
    const margin = { top: 20, right: 30, bottom: 50, left: 40 }
    const config = timeSeriesConfig[timeseriesConfigKey]
    const xMax = parentWidth - margin.left - margin.right
    const yMax = parentHeight - margin.top - margin.bottom
    const parsedData = config.columns.map((c) => {
      return {
        year: new Date(`${c}-02-01`),
        // @ts-ignore
        average: data[`average_${c}`],
        // @ts-ignore
        median: data[`median_${c}`],
        // @ts-ignore
        q75: data[`q75_${c}`],
        // @ts-ignore
        q25: data[`q25_${c}`],
      }
    })

    const minMax = getMinMax(parsedData, [yearKey, "average", "q25", "q75"])

    // Scales for the chart
    const dateScale = scaleTime({
      // @ts-ignore
      domain: [minMax[yearKey].min, minMax[yearKey].max],
      range: [margin.left, xMax + margin.left],
    })
    const valueScale = scaleLinear({
      // @ts-ignore
      domain: [minMax.q25.min, minMax.q75.max],
      range: [yMax, margin.bottom],
      nice: true,
    })
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(parsedData, x0, 1);
        const d0 = parsedData[index - 1];
        const d1 = parsedData[index];
        let d = d0;
        if (d1 && d1.year) {
          d = x0.valueOf() - (d0.year).valueOf() > (d1.year).valueOf() - x0.valueOf() ? d1 : d0;
        }
        console.log(d, x)
        // showTooltip({
        //   tooltipData: d,
        //   tooltipLeft: x,
        //   tooltipTop: stockValueScale(getStockValue(d)),
        // });
      },
      [
        // showTooltip, stockValueScale, 
        dateScale],
    );


    return (
      <svg
        width={parentWidth}
        height={Math.max(parentHeight, 300)} // Ensure the chart has a minimum height
      >
        <LinePath
          stroke={"black"}
          strokeWidth={2}
          data={parsedData}
          x={(d) => dateScale(d.year) ?? 0}
          y={(d) => valueScale(d.average) ?? 0}
        />
        {/* @ts-ignore */}
        <Threshold
          id="Q25-Q75 Range"
          data={parsedData}
          x={(d) => dateScale(d[yearKey])}
          // y0={d => valueScale(0.2)}
          // y1={d => valueScale(0.4)}
          y0={d => valueScale(d["q75"])}
          y1={d => valueScale(d["q25"])}
          clipAboveTo={0}
            // clipBelowTo={yMax}
            // curve={curveBasis}
            belowAreaProps={{
              fill: 'violet',
              fillOpacity: 0.,
            }}
            aboveAreaProps={{
              fill: 'gray',
              fillOpacity: 0.1,
            }}
        />
        <Axis orientation="bottom" tickFormat={(d) => d.getFullYear()} />
        <AxisBottom top={yMax} scale={dateScale} numTicks={parentWidth > 520 ? 10 : 5} />
        <AxisLeft scale={valueScale} 
          left={margin.left}
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
              <div>{`${"average"}: ${tooltipData?.nearestDatum?.datum?.["average"]}`}</div>
              {/* @ts-ignore */}
              <div>{`${"q25"}: ${tooltipData?.nearestDatum?.datum?.["q25"]}`}</div>
              {/* @ts-ignore */}
              <div>{`${"q75"}: ${tooltipData?.nearestDatum?.datum?.["q75"]}`}</div>
            </div>
          )}
        />
      </svg>
    )
  }
)

const LineChart: React.FC<Omit<ResponsiveXYChartProps, "parentWidth" | "parentHeight">> = ({
  data,
  timeseriesConfigKey,
  dataKey,
}) => {
  return <ResponsiveXYChart data={data} timeseriesConfigKey={timeseriesConfigKey} dataKey={dataKey} />
}

export default LineChart
