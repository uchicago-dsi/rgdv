"use client"
import { createColumnHelper } from "@tanstack/react-table"
import Papa from "papaparse"
import React, { useEffect, useState } from "react"
// import { SortableTableProps } from "components/SortableTable/SortableTable"
import SortableTable from "components/SortableTable"
import Tooltip from "components/Tooltip"
import { percentFormatter } from "utils/display/formatValue"

type CR4Data = {
  Geography: string
  "Pre-Merger HHI": number
  "Pre-Merger CR4": number
  "Initial Merged HHI": number
  "Initial Merged CR4": number
  "Merged HHI with Divestment, 100% Survival": number
  "Merged CR4 with Divestment, 100% Survival": number
  "Merged HHI with Divestment, 50% Survival": number
  "Merged CR4 with Divestment, 50% Survival": number
}

const cols = [
  "Pre-Merger HHI",
  "Pre-Merger CR4",
  "Initial Merged HHI",
  "Initial Merged CR4",
  "Merged HHI with Divestment, 100% Survival",
  "Merged CR4 with Divestment, 100% Survival",
  "Merged HHI with Divestment, 50% Survival",
  "Merged CR4 with Divestment, 50% Survival",
]

const columnHelper = createColumnHelper<CR4Data>()

const getColumns = () => {
  return [
    columnHelper.accessor("Geography", {
      header: "Geography",
      cell: (info) => info.getValue(),
    }),
    ...cols.map((col, _i) => {
      const isPct = col.indexOf("CR4") > -1
      // @ts-ignore
      return columnHelper.accessor(isPct ? (row: CR4Data) => row[col] * 100 : col, {
        header: col,
        // @ts-ignore
        cell: (info) => (isPct ? percentFormatter.format(info.getValue() / 100) : info.getValue()),
        meta: {
          filterVariant: isPct ? "range" : undefined,
        },
      })
    }),
  ]
}

export const Cr4ScenarioTable: React.FC = () => {
  const [data, setData] = useState<{
    ready: boolean
    divest: CR4Data[]
  }>({
    ready: false,
    divest: [],
  })

  useEffect(() => {
    const getData = async () => {
      const [divestData] = await Promise.all([fetch("/data/divest-scenarios.csv").then((res) => res.text())])
      const [divestParsed] = [Papa.parse<CR4Data>(divestData, { header: true, dynamicTyping: true })]

      setData({
        ready: true,
        divest: divestParsed.data,
      })
    }
    getData()
  }, [])

  if (!data.ready) {
    return <div>Loading...</div>
  }

  const columns = getColumns()

  return (
    <div>
      <div className="flex w-full flex-row items-center justify-center justify-items-center py-4">
        <h3 className="pr-4 text-2xl">
          Kroger/Albertsons Merger Scenarios
          <Tooltip
            explainer="Data for estimated store sales via DataAxle / Infogroup ReferenceUSA. Data is based on modeled estimates, not actual sales data."
            className="ml-2"
          />
        </h3>
      </div>
      <SortableTable columns={columns as any} data={data.divest} />
    </div>
  )
}
