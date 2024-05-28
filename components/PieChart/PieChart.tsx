"use client"
import { Group } from "@visx/group"
import { LegendOrdinal } from "@visx/legend"
import { useParentSize } from "@visx/responsive"
import { scaleOrdinal } from "@visx/scale"
import { Pie } from "@visx/shape"
import { TooltipWithBounds, useTooltip } from "@visx/tooltip"
import { schemeCategory10 } from "d3"
import React, { useMemo } from "react"
import { formatValue, percentFormatter } from "utils/display/formatValue"
import { toCase } from "utils/display/toCase"
import { PieChartProps } from "./types"

const PieChart: React.FC<PieChartProps<Record<string, any>>> = ({
  data,
  minThreshold,
  dataKey,
  labelKey,
  tooltipFields = [],
  tooltipFormatters = {},
}) => {
  const { parentRef, width: _width } = useParentSize({ debounceTime: 150 })
  const vw = (document?.documentElement?.clientWidth) / 100
  const [maxWidth, maxHeight] = [50*vw, 400]
  const width = Math.min(_width/2, maxWidth)
  const height = Math.min(_width/2, maxHeight)
  const minDimension = Math.min(width, height)

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<Record<typeof labelKey | typeof dataKey, string | number>>()
  const cleanResults = useMemo(() => {
    const cleanData: Array<Record<string, any>> = []
    const sums: Record<string, number> = {
      Other: 0,
    }
    let sumTotal = 0

    if (!data || data.length === 0) {
      return {
        cleanData,
        sums,
        sumTotal,
      }
    } else if (minThreshold === undefined) {
      data.forEach((d) => {
        sumTotal += d[dataKey]
        sums[d[labelKey]] = (sums[d[labelKey]] || 0) + d[dataKey]
      })
      Object.keys(sums).forEach((key) => {
        sums[key] = sums[key]! / sumTotal
      })
      return {
        cleanData: data,
        sums,
        sumTotal,
      }
    }
    data.forEach((d) => {
      sumTotal += d[dataKey]
      if (d[dataKey] && d[dataKey] > minThreshold) {
        cleanData.push(d)
        sums[d[labelKey]] = (sums[d[labelKey]] || 0) + d[dataKey]
      } else {
        sums["Other"] = (sums["Other"] || 0) + d[dataKey]
      }
    })

    for (const key in sums) {
      sums[key] = sums[key]! / sumTotal
    }

    if (sums["Other"] !== undefined && sums["Other"] > 0) {
      cleanData.push({ [labelKey]: "Other", [dataKey]: sums["Other"] })
    }
    return {
      cleanData,
      sums,
      sumTotal,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataKey])
  const cleanData = cleanResults.cleanData || []
  const sums = cleanResults.sums || {}
  const sumTotal = Math.round(cleanResults.sumTotal || 0)
  const colorScale = scaleOrdinal({
    domain: cleanData.map((d) => d[labelKey]),
    range: schemeCategory10 as string[],
  })

  return (
    <div className="flex items-center justify-center content-center flex-col lg:flex-row w-full lg:max-h-[40vh]" ref={parentRef}>
      <svg width={width} height={height}>
        <Group top={height/2} left={width/2}>
          <Pie
            data={cleanData}
            pieValue={(d) => d[dataKey]}
            outerRadius={minDimension/2.2}
            innerRadius={minDimension/6}
            padAngle={0.01}
            cornerRadius={3}
          >
            {(pie) => {
              return pie.arcs.map((arc, i) => {
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const { startAngle, endAngle } = arc
                const hasSpaceForLabel = endAngle - startAngle >= 0.1
                return (
                  <g key={`arc-${arc.data.label}`}>
                    <path
                      key={i}
                      d={pie.path(arc)!}
                      fill={colorScale(arc.data[labelKey])}
                      onMouseOver={(event) => {
                        const rect = (event.target as any).getBoundingClientRect()

                        showTooltip({
                          tooltipData: arc.data,
                          tooltipLeft: rect.left + rect.width / 2,
                          tooltipTop: rect.top + window.scrollY,
                        })
                      }}
                      onMouseOut={hideTooltip}
                    />
                    {hasSpaceForLabel && (
                      <text x={centroidX} y={centroidY} dy=".33em" fill="white" fontSize={12} textAnchor="middle">
                        {arc.data.label}
                      </text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
        </Group>
      </svg>
      <LegendOrdinal
        scale={colorScale}
        className="lg:max-w-[50%] max-h-[100%] overflow-y-auto "
        labelFormat={(label) => {
          const sum = sums[label] ? ` (${percentFormatter.format(sums[label]!)})` : ``
          return `${toCase(label, "title")}${sum}`
        }}
        direction="column"
        itemDirection="row"
        labelMargin="0 1rem 0 0"
        shapeMargin="0.125rem 1rem 0"
      />
      {tooltipData && (
        <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
          {tooltipFields.map((field) => {
            const val = tooltipData[field]
            if (val === undefined) return null
            return (
              <div key={field}>
                {toCase(field, "title")}:{" "}
                {formatValue({
                  key: field,
                  row: tooltipData,
                  value: Number.isNaN(+val) ? val : (+val) / sumTotal,
                  formatters: tooltipFormatters,
                })}
              </div>
            )
          })}
        </TooltipWithBounds>
      )}
    </div>
  )
}

export default PieChart
