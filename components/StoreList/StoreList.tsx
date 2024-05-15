"use client"
import React, { useEffect } from "react"
import { StoreData } from "app/api/stores/[geoid]/types"
import { StoreListProps } from "./types"
const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
})

export const StoreList: React.FC<StoreListProps<string[]>> = ({
  id,
  columns = ["COMPANY", "PARENT COMPANY", "ADDRESS LINE 1", "CITY", "STATE", "ZIPCODE", "PCT OF TRACT SALES"],
  formatters = {
    "PCT OF TRACT SALES": {
      label: "Estimated Percent of Sales",
      formatter: percentFormatter.format,
    },
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
    <div className="prose max-w-full overflow-y-auto">
      <h3>
        Store{data?.length > 1 ? "s" : ""} in {title || "service area"}
      </h3>
      <table className="max-h-full w-full table-auto overflow-y-auto">
        <thead>
          <tr>
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
                const val = formatters.hasOwnProperty(col) ? formatters[col].formatter(_val) : _val
                return <td key={j}>{val}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
