"use client"
import React, { useEffect } from "react"
import { StoreData } from "app/api/stores/[geoid]/types"
import { StoreListProps } from "./types"
import { globals } from "utils/state/globals"

export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

const formatterPresets = {
  "percent": percentFormatter.format,
} as const

export const StoreList: React.FC<StoreListProps<string[]>> = ({
  id,
  columns = ["COMPANY", "PARENT COMPANY", "ADDRESS LINE 1", "CITY", "STATE", "ZIPCODE", "PCT OF TRACT SALES"],
  formatters = {
    "PCT OF TRACT SALES": {
      label: "Estimated Percent of Sales",
      formatter: percentFormatter.format,
    },
    "ADDRESS LINE 1": {
      label: "Address"
    }
  },
  title,
}) => {
  const [data, setData] = React.useState<StoreData | null | "error">(null)
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/stores/${id}`)
        if (response.ok) {
          const data = (await response.json()) as StoreData
          globals.globalDs.storeListResults[id] = data
          setData(data)
        } else {
          setData("error")
        }
      } catch (e) {
        setData("error")
      }
    }
    getData()
  }, [])

  if (data === null) {
    return <div>Loading...</div>
  }
  if (data === "error") {
    return <div>Error loading store data.</div>
  }

  return (
    <div className="prose w-full max-w-full">
      <h3>
        Store{data?.length > 1 ? "s" : ""} in {title || "service area"}
      </h3>
      <div className="max-h-[50vh] w-full overflow-y-auto">
        
      <table className="max-h-full w-full table-auto">
        <thead>
          <tr className="max-w-[30%]">
            {columns.map((_col, i) => {
              // @ts-ignore
              const col = formatters[_col]?.label || _col
              return <th key={i}>{col}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j: number) => {
                const _val = row[col as keyof typeof row]
                // @ts-ignore
                const val = formatters[col]?.formatter?.(_val) || 
                // @ts-ignore
                  formatterPresets?.[formatters[col]?.formatterPreset]?.(_val) ||
                  _val
                return <td key={j}>{val === '0%' ? '<0.1%' : val}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
