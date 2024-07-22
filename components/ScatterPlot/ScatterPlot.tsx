// ScatterPlot.tsx
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Group } from "@visx/group"
import { useParentSize } from "@visx/responsive"
import { scaleLinear } from "@visx/scale"
import { AreaClosed, Circle, Line } from "@visx/shape"
import React, { useMemo } from "react"
import * as ss from "simple-statistics"
import { ScatterPlotProps } from "./types"

const ScatterPlot: React.FC<ScatterPlotProps<Record<string, any>>> = ({
  data,
  xVar,
  yVar,
  showRegressionLine = false,
}) => {
  const { width, height, parentRef } = useParentSize()
  const margin = { top: 20, right: 20, bottom: 50, left: 60 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom
  const opacity = data.length <= 100 ? 1 : 1 / (Math.log10(data.length) * 2)
  // Calculate regression line and confidence band if needed

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { regressionLine, confidenceBand, xValues } = useMemo(() => {
    if (!data || !data.length) {
      return {}
    }
    if (showRegressionLine) {
      let xMin = Math.pow(10, 12)
      let xMax = -Math.pow(10, 12)
      let xValues = []
      const yValues = []
      const linearRegressionData = []

      for (let i = 0; i < data.length; i++) {
        const x = data[i]?.[xVar]
        const y = data[i]?.[yVar]
        if (x === undefined || y === undefined) continue
        xValues.push(x)
        yValues.push(y)
        linearRegressionData.push([x, y])
        xMin = Math.min(xMin, x)
        xMax = Math.max(xMax, x)
      }
      const regression = ss.linearRegression(linearRegressionData)
      const regressionLineFn = ss.linearRegressionLine(regression)
      xValues = xValues.sort((a, b) => a - b)
      const regressionLine = [xMin, xMax].map((x) => [x, regressionLineFn(x)] as [number, number])
      // Calculate confidence intervals
      const yPredicted = xValues.map(regressionLineFn)
      // @ts-ignore
      const residuals = yValues.map((y, i) => y - yPredicted[i])
      const sse = ss.sum(residuals.map((r) => r ** 2))
      const se = Math.sqrt(sse / (data.length - 2))
      const tValue = ss.probit(0.975)
      const meanX = ss.mean(xValues)
      const sx = ss.sum(xValues.map((x) => (x - meanX) ** 2))

      const confidenceBand = {
        lower: xValues.map(
          (x) => regressionLineFn(x) - tValue * se * Math.sqrt(1 / data.length + (x - meanX) ** 2 / sx)
        ),
        upper: xValues.map(
          (x) => regressionLineFn(x) + tValue * se * Math.sqrt(1 / data.length + (x - meanX) ** 2 / sx)
        ),
      }
      return {
        regressionLine,
        confidenceBand,
        xValues,
      }
    } else {
      return {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, showRegressionLine])

  if (!data) return null

  // Define scales
  const xScale = scaleLinear({
    domain: [Math.min(...data.map((d) => d[xVar])), Math.max(...data.map((d) => d[xVar]))],
    range: [0, xMax],
  })

  const yScale = scaleLinear({
    domain: [Math.min(...data.map((d) => d[yVar])), Math.max(...data.map((d) => d[yVar]))],
    range: [yMax, 0],
  })

  return (
    <div ref={parentRef} className="size-full">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Axes */}
          <AxisBottom scale={xScale} top={yMax} label={xVar} />
          <AxisLeft scale={yScale} label={yVar} />

          {/* Scatterplot */}
          {data.map((d, i) => (
            <Circle key={i} opacity={opacity} cx={xScale(d[xVar])} cy={yScale(d[yVar])} r={5} fill="blue" />
          ))}
          {/* Regression line and confidence band */}
          {!!(showRegressionLine && regressionLine) && (
            <>
              <Line
                // @ts-ignore
                from={{ x: xScale(regressionLine[0][0]), y: yScale(regressionLine[0][1]) }}
                to={{
                  // @ts-ignore
                  x: xScale(regressionLine[regressionLine.length - 1][0]),
                  // @ts-ignore
                  y: yScale(regressionLine[regressionLine.length - 1][1]),
                }}
                stroke="red"
                strokeWidth={2}
              />
              <AreaClosed
                // @ts-ignore
                data={xValues}
                // @ts-ignore
                x={(x) => xScale(x)}
                // @ts-ignore
                y0={(x) => yScale(confidenceBand.lower[xValues.indexOf(x)])}
                // @ts-ignore
                y1={(x) => yScale(confidenceBand.upper[xValues.indexOf(x)])}
                fill="rgba(255,0,0,0.2)"
                yScale={yScale}
              />
            </>
          )}
        </Group>
      </svg>
    </div>
  )
}

export default ScatterPlot
