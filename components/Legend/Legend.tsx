"use client"
import LegendBreakText from "components/LegendBreakText"
import { LegendProps } from "./types"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { upcertColorFilter } from "utils/state/map"
import { deepCompare2d1d, deepCompareArray } from "utils/data/compareArrayElements"

export const Legend: React.FC<LegendProps> = ({ column, isBivariate, colors, breaks }) => {
  const colorFilter = useAppSelector((state) => state.map.colorFilter)
  const dispatch = useAppDispatch()

  const [legendtooltip, setLegendTooltip] = useState<number[]>([])
  const [legendClicked, setLegendClicked] = useState(false)
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
  }, [legendtooltip])

  if (isBivariate && Array.isArray(colors?.[0]?.[0])) {
    return (
      <div className="ColorLegend">
        <h3 className="mb-4">{column.name}</h3>
        <div className="relative mb-8 h-full w-full">
          <div
            className="arrow-border relative mx-auto my-0 mb-8 flex h-24 w-24 translate-x-4 translate-y-4 flex-row"
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
                      className={`h-8 w-8 ${
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
      </div>
    )
  }
}
