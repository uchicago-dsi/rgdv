import { globals } from "utils/state/globals"
import { useAppSelector } from "utils/state/store"
import { MapState, TooltipData } from "utils/state/types"
import { MapTooltipProps } from "./types"
import './Spinner.css';
import React from "react";
import { getColorScale } from "components/PercentileLineChart";

const TooltipDot: React.FC<{value:number, inverted?:boolean}> = ({value, inverted}) => {
  const colorScale = getColorScale(inverted)
  const clampedValue = Math.min(100, Math.max(0, value))
  const color = colorScale(clampedValue)
  return (
    <div className="h-4 w-4 rounded-full" style={{backgroundColor: color}}></div>
  )
}

export const TooltipSectionsRenderer: React.FC<{ sections: any[] }> = ({ sections }) => {
  const leadSections = sections.filter((section) => section.lead)
  const nonLeadSections = sections.filter((section) => !section.lead)
  return (
    <>
    {/* flex lead sections in each row label as small text */}
    <div className="flex flex-row justify-between align-middle gap-2">
      {leadSections.map((section, i) => (
        <div key={i} className="text-sm flex flex-col w-24">
          {/* vert middle */}
          <div className="flex flex-row items-center gap-2">
          <p className="text-3xl">{(section.formatter ? 
            section.formatter(section.value) : section.value) || '--'}</p>
          {section.value !== undefined && <TooltipDot value={section.value} inverted={section.inverted} />}
          </div>
          <b className="text-xs">{section.label}</b>
        </div>
      ))}
      </div>
      {/* flex non lead sections in each row */}
      <p className="text-xs pt-4">
        <i>Click for more info</i>
      </p>
    </>
  )
}
export const MapTooltipInner: React.FC<
  MapTooltipProps & { tooltipStatus: MapState["tooltipStatus"]; tooltip: MapState["tooltip"] }
> = ({ simpleMap, tooltipStatus, tooltip }) => {
  const { id, data: tooltipData } = tooltip || { id: "", data: [] }
  const data = globals?.ds?.tooltipResults?.[id]

  if (!data) {
    return (
      <svg className="spinner" width="4rem" height="4rem" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
    )
  }
  if (simpleMap) {
    return <p className="pb-2">{id}</p>
  }

  if (tooltipData) {
    return <TooltipSectionsRenderer sections={tooltipData} />
  }
  if (tooltipStatus === "ready") {
    return (
      <p className="pb-2">
        <b>{data.name ? data.name : `Tract# ${id}`}</b>
        <TooltipSectionsRenderer sections={data.sections} />
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

export const adjustTooltipToMousePosition = (x:number, y:number, tooltipWidth: number): {left?:number, top?:number, right?:number, bottom?:number} => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  // if in bottom right quadrant of screen
  // move tooltip to the left
  const quadrantX = x > screenWidth / 2 ? "right" : "left"
  const quadrantY = y > screenHeight / 2 ? "bottom" : "top"
  let cssProps: {left?:number, top?:number, right?:number, bottom?:number} = {

  }
  if (quadrantX === "right") {
    cssProps['right'] = screenWidth - x + 10
  } else {
    cssProps = {left: x + 10}
  }
  if (quadrantY === "bottom") {
    cssProps['bottom'] = screenHeight - y + 10
  } else {
    cssProps['top'] = y + 10
  }

  return cssProps
}

export const MapTooltip: React.FC<MapTooltipProps> = ({ simpleMap }) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null)
  const tooltip = useAppSelector((state) => state.map.tooltip)
  const tooltipStatus = useAppSelector((state) => state.map.tooltipStatus)
  const tooltipWidth = tooltipRef.current?.clientWidth || 0
  const { x, y } = tooltip || {}
  const cssProps = adjustTooltipToMousePosition(x, y, tooltipWidth)
  if (!x || !y) {
    return null
  }

  return (
    <div
      ref={tooltipRef}
      className="padding-4 pointer-events-none fixed z-[1001] rounded-md border border-gray-200 bg-white/90 p-2 shadow-md"
      style={{
        ...cssProps
      }}
    >
      <MapTooltipInner simpleMap={simpleMap} tooltipStatus={tooltipStatus} tooltip={tooltip} />
    </div>
  )
}
