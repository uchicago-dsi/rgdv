"use client"
import React, { useEffect } from "react"
import { StoreData } from "app/api/stores/[geoid]/types"
import { StoreListProps } from "./types"

export const StoreList: React.FC<StoreListProps> = ({
  id,
  columns = ["COMPANY", "PARENT COMPANY", "CITY", "STATE", "ZIPCODE"],
  title,
}) => {
  const [data, setData] = React.useState<StoreData | null | "error">(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/stores/${id}`)
        if (response.ok) {
          const data = (await response.json()) as StoreData
          console.log(data)
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
    <div className="prose max-h-full overflow-y-auto">
      <h3>
        Store{data?.length > 1 ? "s" : ""} in {title || "service area"}
      </h3>
      <table className="table-auto">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j}>{row[col as keyof typeof row]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
