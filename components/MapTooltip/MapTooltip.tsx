import React from "react"
import { columnsDict } from "utils/data/config"
import { globals } from "utils/state/globals"
import { useAppSelector } from "utils/state/store"
import { MapState } from "utils/state/types"
import { TooltipSectionsRenderer } from "./MapTooltipSections"
import { MapTooltipProps } from "./types"
import { adjustTooltipToMousePosition } from "./utils"
import "./Spinner.css"

export const MapTooltipInner: React.FC<
  MapTooltipProps & { tooltipStatus: MapState["tooltipStatus"]; tooltip: MapState["tooltip"] }
> = ({ simpleMap, tooltipStatus, tooltip }) => {
  const { id, data: tooltipData } = tooltip || { id: "", data: [] }
  const data = globals?.ds?.tooltipResults?.[id]
  const _rawData = globals?.ds?._rawData?.[id]

  const currentColumn = useAppSelector((state) => {
    const colName = state.map.currentColumn
    const colConfig = columnsDict[colName]
    return {
      colName,
      colConfig,
    }
  })

  if (!data) {
    return (
      <svg className="spinner" width="2rem" height="2rem" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
    )
  }
  if (simpleMap) {
    return <p className="pb-2">{id}</p>
  }

  if (tooltipData) {
    return (
      <TooltipSectionsRenderer sections={tooltipData}>
        <div>
          {tooltipData.map((section, i) => (
            <>
              <h3 key={i}>{section.section}</h3>
              <ul className="list-none">
                {section.columns.map((column, j) => (
                  <li key={`store-ttooltip-${i}-${j}`} className="my-1 p-0 text-xs">
                    <b>{column.label}</b>: {column.data}
                  </li>
                ))}
              </ul>
            </>
          ))}
        </div>
      </TooltipSectionsRenderer>
    )
  }
  if (tooltipStatus === "ready") {
    return (
      <p className="pb-2">
        <b>{data.name ? data.name : `Tract# ${id}`}</b>
        <TooltipSectionsRenderer sections={data.sections}>
          {!currentColumn.colConfig.bivariate && (
            <>
              <p className="mt-2 border-t-2 border-neutral-500 pt-2 text-xs">
                <span className="pr-2 font-bold">{currentColumn.colName}:</span>
                {/* @ts-ignore */}
                {_rawData[currentColumn.colConfig.column]}
              </p>
            </>
          )}
        </TooltipSectionsRenderer>
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
  const tooltipRef = React.useRef<HTMLDivElement>(null)
  const tooltip = useAppSelector((state) => state.map.tooltip)
  const tooltipStatus = useAppSelector((state) => state.map.tooltipStatus)
  // const tooltipWidth = tooltipRef.current?.clientWidth || 0
  const { x, y } = tooltip || {}
  const cssProps = adjustTooltipToMousePosition(x || 0, y || 0)
  if (!x || !y) {
    return null
  }

  return (
    <div
      ref={tooltipRef}
      className="padding-4 pointer-events-none fixed z-[1001] rounded-md border border-gray-200 bg-white/90 p-2 shadow-md"
      style={{
        ...cssProps,
      }}
    >
      <MapTooltipInner simpleMap={simpleMap} tooltipStatus={tooltipStatus} tooltip={tooltip} />
    </div>
  )
}
