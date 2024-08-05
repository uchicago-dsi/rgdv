"use client"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import { createColumnHelper } from "@tanstack/react-table"
import Papa from "papaparse"
import React, { useEffect, useState } from "react"
// import { SortableTableProps } from "components/SortableTable/SortableTable"
import SortableTable from "components/SortableTable"
import Tooltip from "components/Tooltip"
import { percentFormatter } from "utils/display/formatValue"

type DominanceData = {
  Identifier: string
  "COMPANY 1 2023": string
  "PCT OF TOTAL 1 2023": number
  "COMPANY 2 2023": string
  "PCT OF TOTAL 2 2023": number
  "COMPANY 3 2023": string
  "PCT OF TOTAL 3 2023": number
  "COMPANY 1 2010": string
  "PCT OF TOTAL 1 2010": number
  "COMPANY 2 2010": string
  "PCT OF TOTAL 2 2010": number
  "COMPANY 3 2010": string
  "PCT OF TOTAL 3 2010": number
  "COMPANY 1 2000": string
  "PCT OF TOTAL 1 2000": number
  "COMPANY 2 2000": string
  "PCT OF TOTAL 2 2000": number
  "COMPANY 3 2000": string
  "PCT OF TOTAL 3 2000": number
}

const cols = [
  "COMPANY 1 2023",
  "PCT OF TOTAL 1 2023",
  "COMPANY 2 2023",
  "PCT OF TOTAL 2 2023",
  "COMPANY 3 2023",
  "PCT OF TOTAL 3 2023",
  "COMPANY 1 2010",
  "PCT OF TOTAL 1 2010",
  "COMPANY 2 2010",
  "PCT OF TOTAL 2 2010",
  "COMPANY 3 2010",
  "PCT OF TOTAL 3 2010",
  "COMPANY 1 2000",
  "PCT OF TOTAL 1 2000",
  "COMPANY 2 2000",
  "PCT OF TOTAL 2 2000",
  "COMPANY 3 2000",
  "PCT OF TOTAL 3 2000",
]

const toggleGroupItemClasses =
  "min-w-48 hover:bg-violet3 color-mauve11 data-[state=on]:bg-violet6 data-[state=on]:text-violet12 flex h-[35px] w-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"

const columnHelper = createColumnHelper<DominanceData>()

const getColumns = (identifier: string) => {
  return [
    columnHelper.accessor("Identifier", {
      header: identifier,
      cell: (info) => info.getValue(),
    }),
    ...cols.map((col, _i) => {
      const isPct = col.indexOf("PCT") > -1
      // @ts-ignore
      return columnHelper.accessor(isPct ? (row: DominanceData) => row[col] * 100 : col, {
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

export const StateConcentrationDataTable: React.FC = () => {
  const [view, setView] = useState<"State" | "Community Typology">("State")
  const [data, setData] = useState<{
    ready: boolean
    state: DominanceData[]
    communityTypology: DominanceData[]
  }>({
    ready: false,
    state: [],
    communityTypology: [],
  })

  useEffect(() => {
    const getData = async () => {
      const [stateCsv, acpCsv] = await Promise.all([
        fetch("/data/dominance-by-state.csv").then((res) => res.text()),
        fetch("/data/dominance-by-acp.csv").then((res) => res.text()),
      ])
      const [stateParsed, acpParsed] = [
        Papa.parse<DominanceData>(stateCsv, { header: true, dynamicTyping: true }),
        Papa.parse<DominanceData>(acpCsv, { header: true, dynamicTyping: true }),
      ]
      setData({
        ready: true,
        state: stateParsed.data,
        communityTypology: acpParsed.data,
      })
    }
    getData()
  }, [])

  if (!data.ready) {
    return <div>Loading...</div>
  }
  const columns = getColumns(view)
  const currentData = view === "State" ? data.state : data.communityTypology

  return (
    <div>
      <div className="flex w-full flex-row items-center justify-center justify-items-center py-4">
        <h3 className="pr-4 text-2xl">
          Estimated Market Dominance
          <Tooltip
            explainer="Data for estimated store sales via DataAxle / Infogroup ReferenceUSA. Data is based on modeled estimates, not actual sales data."
            className="ml-2"
          />
        </h3>
        <ToggleGroup.Root
          className="inline-flex space-x-px rounded bg-mauve6 shadow-[0_2px_10px] shadow-blackA4"
          type="single"
          defaultValue="center"
          aria-label="Text alignment"
          value={view}
          onValueChange={(value) => setView(value as any)}
        >
          <ToggleGroup.Item className={toggleGroupItemClasses} value="State" aria-label="View state data table">
            State
          </ToggleGroup.Item>
          <ToggleGroup.Item
            className={toggleGroupItemClasses}
            value="Community Typology"
            aria-label="View community typology data table"
          >
            Community Typology
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <SortableTable columns={columns as any} data={currentData} />
    </div>
  )
}
