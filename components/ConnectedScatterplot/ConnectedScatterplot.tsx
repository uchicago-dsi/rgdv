import { useParentSize } from "@cutting/use-get-parent-size"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Group } from "@visx/group"
import { scaleLinear } from "@visx/scale"
import { LinePath } from "@visx/shape"
import { Circle } from "@visx/shape"
// @ts-ignore
import { extent } from "d3-array"
import React from "react"
import { ConnectedScatterplotProps } from "./types"

const ConnectedScatterplot: React.FC<ConnectedScatterplotProps<Record<string, number>>> = ({
  parentRef,
  pointsData,
  linesData,
  xKey,
  yKey,
  width,
  height,
  margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50,
  },
}) => {
  const [activeId, setActiveId] = React.useState<number | null>(null)
  const { width: _w, height: _h } = useParentSize(parentRef!)
  const parentWidth = _w || width || 800
  const parentHeight = _h || height || 500
  const xMax = parentWidth - margin.left - margin.right
  const yMax = parentHeight - margin.top - margin.bottom
  const xMin = margin.left
  const yMin = margin.top

  type DataType = (typeof pointsData)[number]
  // Accessors
  const xAccessor = (d: DataType) => d[xKey]!
  const yAccessor = (d: DataType) => d[yKey]!

  // Scales
  const xScale = scaleLinear({
    range: [xMin, xMax],
    // @ts-ignore
    domain: [15, 40],
    // domain: extent(pointsData, xAccessor),
  })

  const yScale = scaleLinear({
    range: [yMax, yMin],
    // @ts-ignore
    domain: extent(pointsData, yAccessor),
  })
  const activeLine = linesData?.find((line) => line?.[0]?.GEOID === activeId)
  // @ts-ignore
  const point2000 = activeLine?.find((d) => d.year === "2000")
  // @ts-ignore
  const point2010 = activeLine?.find((d) => d.year === "2010")
  return (
    <svg className="size-full">
      <Group>
        {!!linesData &&
          linesData.map((lineData, i) => (
            <>
              <LinePath
                key={`line-${i}`}
                data={lineData}
                x={(d) => xScale(xAccessor(d))}
                y={(d) => yScale(yAccessor(d))}
                stroke="black"
                // curve={curveStep}
                strokeWidth={1}
                opacity={activeId && activeId === lineData[0]?.GEOID ? 1 : 0.05}
              />
              {point2000 && (
                <>
                  <Circle cx={xScale(xAccessor(point2000))} cy={yScale(yAccessor(point2000))} r={5} fill="blue" />
                  <text x={xScale(xAccessor(point2000))} y={yScale(yAccessor(point2000))} dx={5} dy={-5} fontSize={10}>
                    2000
                  </text>
                </>
              )}
              {point2010 && (
                <>
                  <Circle cx={xScale(xAccessor(point2010))} cy={yScale(yAccessor(point2010))} r={5} fill="blue" />
                  <text x={xScale(xAccessor(point2010))} y={yScale(yAccessor(point2010))} dx={5} dy={-5} fontSize={10}>
                    2010
                  </text>
                </>
              )}
            </>
          ))}
        {pointsData.map((d, i) => (
          <Circle
            key={`point-${i}`}
            cx={xScale(xAccessor(d))}
            cy={yScale(yAccessor(d))}
            r={4}
            fill="red"
            opacity={!activeId ? 1 : d.GEOID === activeId ? 1 : 0.2}
            // @ts-ignore
            onMouseEnter={() => setActiveId(d.GEOID)}
            onMouseLeave={() => setActiveId(null)}
          />
        ))}

        <AxisLeft scale={yScale} top={margin.top} left={margin.left} />
        <AxisBottom scale={xScale} top={parentHeight - margin.bottom} />
      </Group>
    </svg>
  )
}

export default ConnectedScatterplot
