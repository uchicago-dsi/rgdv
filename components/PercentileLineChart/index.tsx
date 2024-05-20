"use client"
import { Group } from "@visx/group"
import { useParentSize } from "@visx/responsive"
import { scaleLinear } from "@visx/scale"
import { Line, Polygon } from "@visx/shape"
import { interpolateRgb } from "d3-interpolate"
import React from "react"

export type GradientLineProps = {
  value: number,
  inverted?: boolean,
}

const GradientLine: React.FC<GradientLineProps> = ({ value, inverted }) => {
  // Ensure value is within bounds
  const clampedValue = Math.min(100, Math.max(0, value))
  const { parentRef, width } = useParentSize({ debounceTime: 150 })
  // Define the size of the canvas and the circle
  const height = 50
  const circleRadius = 6
  const triangleSize = 4
  const triangleHeight = (triangleSize * Math.sqrt(3)) / 2 // Height of an equilateral triangle

  // Scale for positioning the circle along the line
  const positionScale = scaleLinear({
    domain: [0, 100],
    range: [circleRadius, width - circleRadius],
  })

  // Color interpolator for three colors
  const colorScale = scaleLinear({
    domain: [0, 50, 100],
    range: inverted ? ["#2E9FA4", "#FFB44E", "#9B415D"] :  ["#9B415D", "#FFB44E", "#2E9FA4"],
    // @ts-ignore
    output: interpolateRgb,
  })

  // Get the x position and color from the scales
  const circleX = positionScale(clampedValue)
  const circleColor = colorScale(clampedValue)

  // Triangle size and coordinates for arrowheads
  const triangleLeft: [number, number][] = [
    [circleRadius, -triangleHeight],
    [circleRadius + triangleSize, 0],
    [circleRadius, triangleHeight],
  ]
  const triangleRight: [number, number][] = [
    [width - circleRadius, -triangleHeight],
    [width - circleRadius - triangleSize, 0],
    [width - circleRadius, triangleHeight],
  ]
  // const triangleRight = `${width - circleRadius - triangleSize / 2},0 ${width - circleRadius + triangleSize / 2},0 ${width - circleRadius},${triangleSize}`;
  // console.log(triangleLeft)
  return (
    <div ref={parentRef} className="h-auto w-full">
      <svg width={width} height={height}>
        <Group top={height / 2} left={0}>
          <Line
            from={{ x: circleRadius, y: 0 }}
            to={{ x: width - circleRadius, y: 0 }}
            stroke="black"
            strokeWidth={1.5}
          />
          {/* Triangles as arrowheads */}
          <Polygon points={triangleLeft} fill="black" />
          <Polygon points={triangleRight} fill="black" />
          <circle
            cx={circleX}
            cy={0}
            r={circleRadius}
            fill={circleColor}
            stroke="black"
            strokeWidth={1.5} // Black border for the circle
          />
        </Group>
      </svg>
    </div>
  )
}

export default GradientLine
