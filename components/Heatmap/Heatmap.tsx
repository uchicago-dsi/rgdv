import { Group } from "@visx/group"
import { type Bin, type Bins } from "@visx/mock-data/lib/generators/genBins"
import { scaleLinear } from "@visx/scale"
import { HeatmapRect } from "@visx/heatmap"
import { AxisBottom, AxisLeft } from "@visx/axis"

export type HeatmapProps = {
  data: Bins[]
  width?: number
  height?: number
  colorMax?: number
  bucketSizeMax: number
  colors?: string[]
  margin?: { top: number; right: number; bottom: number; left: number }
}

const defaultMargin = { top: 10, left: 20, right: 20, bottom: 110 }
const defaultColors = ['#fff', '#000']

function HeatmapComponent({
  data,
  width = 800,
  height = 800,
  colorMax = 3000,
  bucketSizeMax,
  colors = defaultColors,
  margin = defaultMargin,
}: HeatmapProps) {
  // console.log(data)

  // bounds
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.bottom - margin.top
  // scales
  const xScale = scaleLinear<number>({
    domain: [0, data.length],
    range: [0, xMax]
  })
  const yScale = scaleLinear<number>({
    domain: [0, 8],
    range: [yMax, 0]
  })
  const rectColorScale = scaleLinear<string>({
    range: colors,
    domain: [0, colorMax],
  })
  const opacityScale = scaleLinear<number>({
    range: [1, 1],
    domain: [0, colorMax],
  })

  const binWidth = xMax / data.length

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        <AxisBottom scale={xScale} top={yMax} />
        <AxisLeft scale={yScale} />
        <HeatmapRect
          data={data}
          xScale={(d) => xScale(d) ?? 0}
          yScale={(d) => yScale(d+1) ?? 0}
          colorScale={rectColorScale}
          opacityScale={opacityScale}
          binWidth={binWidth}
          binHeight={binWidth}
          gap={0}
        >
          {(heatmap) =>
            heatmap.map((heatmapBins) =>
              heatmapBins.map((bin) => (
                <rect
                  key={`heatmap-rect-${bin.row}-${bin.column}`}
                  className="visx-heatmap-rect"
                  width={bin.width}
                  height={bin.height}
                  x={bin.x}
                  y={bin.y}
                  fill={bin.color}
                  fillOpacity={bin.opacity}
                  // onClick={() => {
                  //   if (!events) return;
                  //   const { row, column } = bin;
                  //   alert(JSON.stringify({ row, column, bin: bin.bin }));
                  // }}
                />
              ))
            )
          }
        </HeatmapRect>
      </Group>
    </svg>
  )
}

export default HeatmapComponent
