"use client"
import { useEffect, useState } from "react"
import LegendBreakText from "components/LegendBreakText"
import { deepCompare2d1d } from "utils/data/compareArrayElements"
import { upcertColorFilter } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { LegendProps } from "./types"
import CountyList from "../CountyFilterSelector/county_list.json"

const findName = (id: string) => {
  const state = CountyList.find((state) => state.statefp === id.slice(0, 2))
  const county = id.length > 2 ? state?.counties?.find((county: any) => county.fips === id) : undefined

  switch (id.length) {
    case 2:
      return state?.state || "Unknown"
    case 5:
      return `${county?.name || "Unknown County"}, ${state?.state || "Unknown State"}`
    default:
      const tractNum = id.slice(5)
      return `Tract ${tractNum} in ${county?.name || "Unknown County"}`
  }
}

export const Legend: React.FC<LegendProps> = ({ column, isBivariate, colors, breaks }) => {
  const colorFilter = useAppSelector((state) => state.map.colorFilter)
  const highlight = useAppSelector((state) => state.map.highlight)
  const higlightValue = useAppSelector((state) => state.map.highlightValue)
  const highlightColor = useAppSelector((state) => state.map.highlightColor)
  const idFilter = useAppSelector((state) => state.map.idFilter)
  const filterInfo = idFilter?.length
    ? typeof idFilter === "string"
      ? `* Data for ${findName(idFilter)}`
      : `* Data for ${idFilter.map((f) => findName(f)).join(", ")}`
    : "National Data"

  const dispatch = useAppDispatch()

  const [legendtooltip, setLegendTooltip] = useState<number[]>([])
  // const [legendClicked, setLegendClicked] = useState(false)
  const [clearLegendTimeout, setClearLegendTimeout] = useState<null | ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (legendtooltip.length) {
      setClearLegendTimeout(setTimeout(() => setLegendTooltip([]), 5000))
    } else {
      clearLegendTimeout && clearTimeout(clearLegendTimeout)
    }
    return () => {
      clearLegendTimeout && clearTimeout(clearLegendTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legendtooltip])

  if (isBivariate && Array.isArray(colors?.[0]?.[0])) {
    return (
      <div className="ColorLegend">
        <h3 className="mb-4">{column.name}</h3>
        <div className="relative mb-8 size-full">
          <div
            className="arrow-border relative mx-auto my-0 mb-8 flex size-24 translate-x-4 translate-y-4 flex-row"
            style={{
              transform: "translate(0,1rem) rotate(-135deg)",
              borderWidth: "2px 0px 0px 2px",
              borderColor: "black",
            }}
          >
            {colors.map((crow: number[][], i) => (
              <div key={i} className="flex flex-col">
                {crow.map((c: number[], j: number) => {
                  return (
                    <button
                      onClick={() => dispatch(upcertColorFilter(c))}
                      onMouseEnter={() => setLegendTooltip([i, j])}
                      onMouseLeave={() => setLegendTooltip([])}
                      className={`size-8 ${
                        legendtooltip[0] === i && legendtooltip[1] === j
                          ? "opacity-100 shadow-sm"
                          : legendtooltip?.length > 0 || (colorFilter?.length && !deepCompare2d1d(colorFilter, c))
                          ? "opacity-10"
                          : "opacity-100"
                      }`}
                      style={{ background: `rgb(${c.join(",")})` }}
                      key={`${i}-${j}`}
                    ></button>
                  )
                })}
              </div>
            ))}
            <span className="absolute bottom-[-1rem] left-[-0.375rem] font-black">&darr;</span>
            <span className="absolute right-[-.875rem] top-[-1rem] font-black">&rarr;</span>
          </div>
          <p
            className="absolute bottom-0 left-[50%] whitespace-nowrap text-xs"
            style={{ transform: "translate(0, 50%) rotate(-45deg)" }}
          >
            {/* @ts-ignore */}
            {column.columnLabels?.[1]}
          </p>
          <p
            className="absolute bottom-0 right-[50%] whitespace-nowrap text-xs"
            style={{ transform: "translate(0, 0) rotate(45deg)" }}
          >
            {/* @ts-ignore */}
            {column.columnLabels?.[0]}
          </p>
          {legendtooltip?.length > 0 && (
            <div className="absolute bottom-[125%] left-[50%] translate-x-[-50%] bg-neutral-200 p-1 text-xs shadow-xl shadow-gray-500">
              <p>
                {/* @ts-ignore */}
                Tercile {legendtooltip[0] + 1} - {column?.columnLabels[0]} <br />
                {/* @ts-ignore */}
                Tercile {legendtooltip[1] + 1} - {column?.columnLabels[1]}
              </p>
            </div>
          )}
        </div>
        <HighlightLegend highlight={highlight} value={higlightValue} color={highlightColor} />
        <p className="pt-4 text-right text-xs max-w-36 lg:max-w-[17.5vw]">{filterInfo}</p>
      </div>
    )
  } else {
    return (
      <div className="ColorLegend">
        <h3>{column.name}</h3>
        {!!(colors?.length && breaks?.length) &&
          colors.map((_, i) => (
            <LegendBreakText
              key={i}
              colors={colors as any}
              breaks={breaks as any}
              index={i}
              colorFilter={colorFilter}
              onClick={(color, _i) => dispatch(upcertColorFilter(color))}
            />
          ))}
        <p style={{ maxWidth: "35ch", fontSize: "0.75rem" }}>{/* <i>{currentDataSpec?.attribution}</i> */}</p>
        <HighlightLegend highlight={highlight} value={higlightValue} color={highlightColor} />
        <p className="pt-4 text-right text-xs">{filterInfo}</p>
      </div>
    )
  }
}

const HighlightLegend: React.FC<{ highlight?: string; value?: readonly any[]; color: any }> = ({
  highlight,
  value,
  color,
}) => {
  if (!highlight || !value) return null
  return (
    <p
      className="font-xs prose max-w-64 pl-2 pt-4"
      style={{
        fontSize: "0.75rem",
      }}
    >
      <span
        className="mr-2 inline-block size-[0.75rem] border-2 border-black"
        style={{
          background: `rgb(${color.join(",")}`,
        }}
      ></span>
      {highlight}{" "}
      {!!(Array.isArray(value) && value.every((n) => !isNaN(n as number))) ? (
        <>
          {/* @ts-ignore */}
          {+value[0] * 100}% - {+value[1] * 100}%{" "}
        </>
      ) : (
        <>( &gt;{value}%) </>
      )}
    </p>
  )
}
