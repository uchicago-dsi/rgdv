"use client"
import { createColumnHelper } from "@tanstack/react-table"
import Papa from "papaparse"
import React, { useEffect, useState } from "react"
import SortableTable from "components/SortableTable"
import { percentFormatter } from "utils/display/formatValue"

type AcpData = {
  "Community Type": string
  "Total US Count": number
  "Tracts of Most Concern Count": number
  "Percent of Tracts of Most Concern": number
  "Percent of Type": number
  "Community Tracts as % of Total Tracts": number
  "% Non-white": number
  "% Black/AA": number
  "% Latine": number
  "% Native American": number
  "Avg Neighborhood Disadvantage Percentile": number
}

const cols = [
  "Community Type",
  "Total US Count",
  "Tracts of Most Concern Count",
  "Percent of Tracts of Most Concern",
  "Percent of Type",
  "Community Tracts as % of Total Tracts",
  "% Non-white",
  "% Black/AA",
  "% Latine",
  "% Native American",
  "Avg Neighborhood Disadvantage Percentile",
]

const columnHelper = createColumnHelper<AcpData>()

const getColumns = () => {
  return [
    ...cols.map((col, _i) => {
      const isPct = col.indexOf("%") > -1 || col.indexOf("Percent") > -1
      // @ts-ignore
      return columnHelper.accessor(isPct ? (row: AcpData) => row[col] * 100 : col, {
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

export const AcpTable: React.FC = () => {
  const [data, setData] = useState<{
    ready: boolean
    acp: AcpData[]
  }>({
    ready: false,
    acp: [],
  })

  useEffect(() => {
    const getData = async () => {
      const [acpData] = await Promise.all([fetch("/data/acp-data.csv").then((res) => res.text())])
      const [acpParsed] = [Papa.parse<AcpData>(acpData, { header: true, dynamicTyping: true })]

      setData({
        ready: true,
        acp: acpParsed.data,
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
        <h3 className="pr-4 text-2xl">American Community Project (ACP) Typologies</h3>
      </div>
      <SortableTable columns={columns as any} data={data.acp} />
    </div>
  )
}
