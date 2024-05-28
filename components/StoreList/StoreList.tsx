"use client"
import React, { useEffect } from "react"
import { Provider } from "react-redux"
import PieChart from "components/PieChart/PieChart"
import { formatValue, percentFormatter } from "utils/display/formatValue"
import { globals } from "utils/state/globals"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { fetchStoreData, initializeDb } from "utils/state/thunks"
import { StoreListProps } from "./types"

export const StoreList: React.FC<StoreListProps<string[]>> = ({
  id,
  columns = ["COMPANY", "PARENT COMPANY", "ADDRESS LINE 1", "CITY", "STATE", "ZIPCODE", "PCT OF TRACT SALES"],
  formatters = {
    "PCT OF TRACT SALES": {
      label: "Estimated Percent of Sales",
      formatter: percentFormatter.format,
    },
    "ADDRESS LINE 1": {
      label: "Address",
    },
  } as StoreListProps<string[]>["formatters"],
  title,
}) => {
  const storeDataId = useAppSelector((state) => state.map.storeDataId)
  const dbStatus = useAppSelector((state) => state.map.dbStatus)
  const dispatch = useAppDispatch()
  const data = globals.ds.storeListResults?.[id] as any[]
  const salesCol = columns.find((col) => col.includes("SALES"))!
  const labelCol = columns.includes('COMPANY') ? 'COMPANY' : 'PARENT COMPANY'

  useEffect(() => {
    if (dbStatus === "ready" && storeDataId !== id) {
      dispatch(fetchStoreData(id))
    } else if (dbStatus === "uninitialized") {
      dispatch(initializeDb())
    }
  }, [dispatch, dbStatus, id, storeDataId])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="prose flex w-full max-w-full flex-col items-center">
      <h3 className="w-full text-2xl">
        Grocery Store{data?.length > 1 ? "s" : ""} in {title || "service area"}
      </h3>
      {data && (
        <PieChart
          data={data}
          dataKey={salesCol}
          labelKey={labelCol}
          minThreshold={0.01}
          tooltipFields={columns}
          tooltipFormatters={formatters}
        />
      )}
      <div className="max-h-[50vh] w-full overflow-y-auto">
        <table className="max-h-full w-full table-auto">
          <thead>
            <tr className="max-w-[30%]">
              {columns.map((_col, i) => {
                const col = formatters?.[_col]?.label || _col
                return <th key={i}>{col}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((key, j: number) => {
                  const value = formatValue({row, key, formatters})
                  return <td key={j}>{value === "0%" ? "<0.1%" : value}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const StoreListOuter: React.FC<StoreListProps<string[]>> = (props) => {
  return (
    <Provider store={store}>
      <StoreList {...props} />
    </Provider>
  )
}
