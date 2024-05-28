import { globals } from "utils/state/globals"
import { useAppSelector } from "utils/state/store"
import { MapState, TooltipData } from "utils/state/types"
import { MapTooltipProps } from "./types"

export const TooltipSectionsRenderer: React.FC<{ sections: TooltipData }> = ({ sections }) => {
  return (
    <ul>
      {sections.map((section, i) => (
        <li key={i}>
          <b>{section.section}</b>
          <ul>
            {section.columns.map((col, j) => (
              <li key={`${i},${j}`}>
                {col.label || col.col}: {col.data}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export const MapTooltipInner: React.FC<
  MapTooltipProps & { tooltipStatus: MapState["tooltipStatus"]; tooltip: MapState["tooltip"] }
> = ({ simpleMap, tooltipStatus, tooltip }) => {
  const { id, data: tooltipData } = tooltip || { id: "", data: [] }
  const data = globals.ds.tooltipResults[id]

  if (simpleMap) {
    return <p className="pb-2">{id}</p>
  }

  if (tooltipData) {
    return <TooltipSectionsRenderer sections={tooltipData} />
  }

  if (tooltipStatus === "ready") {
    return (
      <p className="pb-2">
        <b>{id}</b>
        <TooltipSectionsRenderer sections={data} />
      </p>
    )
  }

  return (
    <div className="m-2 flex flex-row justify-center align-middle">
      <svg
        width="24pt"
        height="24pt"
        version="1.1"
        viewBox="0 0 1200 1200"
        className="mr-2 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m750.3 1047.7c79.703-26.676 120.28 94.527 40.562 121.2-72.605 24.395-149.79 34.559-226.24 30.055-330.65-19.531-583.1-303.66-563.57-634.31 19.531-330.65 303.66-583.11 634.31-563.58 330.65 19.531 583.1 303.66 563.57 634.31-1.5625 26.723-5.082 54.793-10.258 81.047-16.137 82.676-141.86 58.156-125.72-24.535 4.2852-21.656 6.9727-41.984 8.2734-64.02 15.355-259.92-183.43-483.74-443.36-499.08-259.92-15.355-483.74 183.43-499.08 443.36-15.355 259.92 183.41 483.74 443.35 499.08 60.641 3.582 120.56-4.1914 178.17-23.535z" />
      </svg>
      <p>Loading...</p>
    </div>
  )
}

export const MapTooltip: React.FC<MapTooltipProps> = ({ simpleMap }) => {
  const tooltip = useAppSelector((state) => state.map.tooltip)
  const tooltipStatus = useAppSelector((state) => state.map.tooltipStatus)
  const { x, y } = tooltip || {}

  if (!x || !y) {
    return null
  }

  return (
    <div
      className="padding-4 pointer-events-none fixed z-[1001] rounded-md border border-gray-200 bg-white/90 p-2 shadow-md"
      style={{
        left: x + 10,
        top: y + 10,
      }}
    >
      <MapTooltipInner simpleMap={simpleMap} tooltipStatus={tooltipStatus} tooltip={tooltip} />
    </div>
  )
}
