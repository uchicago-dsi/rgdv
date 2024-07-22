"use client"
import { Group } from "@visx/group"
import { useParentSize } from "@visx/responsive"
import { scaleLinear } from "@visx/scale"
import { Line, Polygon } from "@visx/shape"
import { interpolateRgb } from "d3-interpolate"
import React from "react"

export type GradientLineProps = {
  value: number
  inverted?: boolean
}
export const getColorScale = (inverted?: boolean) => {
  // Color interpolator for three colors
  return scaleLinear({
    domain: [0, 50, 100],
    range: inverted ? ["#5bb81a", "#FFB44E", "#f50000"] : ["#f50000", "#FFB44E", "#5bb81a"],
    // @ts-ignore
    output: interpolateRgb,
  })
}

const GradientLine: React.FC<GradientLineProps> = ({ value, inverted }) => {
  // Ensure value is within bounds
  const valueIsNull = Number.isNaN(+value) || value === null
  const clampedValue = Math.min(100, Math.max(0, value))
  const { parentRef, width } = useParentSize({ debounceTime: 150 })
  // Define the size of the canvas and the circle
  const height = 50
  const circleRadius = 10
  const triangleSize = 6
  const triangleHeight = (triangleSize * Math.sqrt(3)) / 2 // Height of an equilateral triangle

  // Scale for positioning the circle along the line
  const positionScale = scaleLinear({
    domain: [0, 100],
    range: [circleRadius, width - circleRadius],
  })

  const colorScale = getColorScale(inverted)

  // Get the x position and color from the scales
  const circleX = positionScale(clampedValue)
  const circleColor = colorScale(clampedValue)

  // Triangle size and coordinates for arrowheads
  const triangleLeft: [number, number][] = [
    [0, -triangleHeight],
    [0 + triangleSize, 0],
    [0, triangleHeight],
  ]
  const triangleRight: [number, number][] = [
    [width, -triangleHeight],
    [width - triangleSize, 0],
    [width, triangleHeight],
  ]
  // const triangleRight = `${width - circleRadius - triangleSize / 2},0 ${width - circleRadius + triangleSize / 2},0 ${width - circleRadius},${triangleSize}`;
  // console.log(triangleLeft)
  return (
    <div ref={parentRef} className="h-auto w-full">
      <svg width={width} height={height}>
        <Group top={height / 2} left={0}>
          <Line from={{ x: 0, y: 0 }} to={{ x: width, y: 0 }} stroke="black" strokeWidth={1.5} />
          {new Array(10).fill(null).map((_, i) => {
            const x = (width / 10) * i
            return (
              <circle
                key={i}
                stroke="black"
                cx={x}
                cy={-0.5}
                r={1}
                fill="white"
                strokeWidth={1.5} // Black border for the circle
              />
            )
          })}
          {/* Triangles as arrowheads */}
          <Polygon points={triangleLeft} fill="black" />
          <Polygon points={triangleRight} fill="black" />
          {!valueIsNull && (
            <circle
              cx={circleX}
              cy={0}
              r={circleRadius}
              fill={circleColor}
              stroke="black"
              strokeWidth={1.5} // Black border for the circle
              // transition cx and fill
              style={{
                transition: "cx 1s, fill 1s",
              }}
            />
          )}
        </Group>
      </svg>
    </div>
  )
}

export default GradientLine
