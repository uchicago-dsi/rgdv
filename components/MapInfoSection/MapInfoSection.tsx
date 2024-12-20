import React, { useEffect, useState } from "react"
import { LeadSectionsRenderer } from "components/MapTooltip/MapTooltipSections"
import PieChart from "components/PieChart/PieChart"
// import TimeseriesChart from "components/TimeseriesChart"
import { ReportSections } from "components/ReportLayout/Sections"
import { useMarkdownContext } from "hooks/useMarkdownContext"
import { cleanRaceData } from "utils/data/cleaning/cleanRaceData"
import { idColumn, parentCompanyHighlightConfig, raceEthnicityLabels } from "utils/data/config"
import { renderReportText } from "utils/data/renderReportText"
import { dataTableName } from "utils/data/service/service"
import { percentFormatter } from "utils/display/formatValue"
import { globals } from "utils/state/globals"
import { setClickInfo } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"

const Table: React.FC<{ data: Record<string, any>; headers: string[] }> = ({ data, headers }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p>No data available</p>
  }

  const entries = Object.entries(data)

  return (
    <div className="flex justify-center px-0 py-1 text-xs">
      <table className="min-w-full max-w-4xl divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, i) => (
              <th key={i} scope="col" className="px-2 py-1 text-left text-xs font-medium text-gray-500">
                {header}{" "}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {entries.map(([key, value], index) => (
            <tr key={key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="overflow-x-auto whitespace-nowrap px-2 py-1 font-medium text-gray-900">{key}</td>
              <td className="overflow-x-auto whitespace-nowrap px-2 py-1 text-gray-500">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const formatParentCompanyData = (data: any) => {
  const temp: any[] = []
  Object.entries(parentCompanyHighlightConfig).forEach(([title, config]) => {
    const value = data[config.column.slice(1, -1)]
    if (value) {
      temp.push({
        label: title,
        value: value,
      })
    }
  })
  const outputDict: Record<string, string> = {}
  temp
    .sort((a, b) => b.value - a.value)
    .forEach((item) => (outputDict[item.label] = percentFormatter.format(item.value)))
  return outputDict
}

export const MapInfoSection: React.FC = () => {
  const dispatch = useAppDispatch()
  const close = () => dispatch(setClickInfo(null))
  const clicked = useAppSelector((state) => state.map.clicked)
  const [data, setData] = useState<any>(null)
  const { stats } = useMarkdownContext()

  useEffect(() => {
    const getData = async () => {
      if (clicked?.id && data?.id !== clicked.id && !!stats) {
        const res = await globals.ds.runQuery(`SELECT * FROM ${dataTableName} WHERE ${idColumn} = ${clicked.id}`)
        const parsedData = JSON.parse(globals.ds.stringifyJsonWithBigInts(res[0])) as Record<string, any>
        const tooltipData = globals.ds.formatTooltipData(res[0])
        const parentCompanyData = formatParentCompanyData(res[0])
        const race = cleanRaceData(res[0])
        const statsRaw = renderReportText(parsedData, stats, clicked.id, "national")

        setData({
          id: clicked.id,
          data: parsedData,
          statText: statsRaw.stats,
          tooltipData,
          parentCompanyData,
          race,
        })
      }
    }
    getData()
  }, [stats, clicked?.id, data?.id])

  if (!clicked?.id) {
    return null
  }
  console.log("sidebar data", data)

  const formatted = data?.tooltipData || []
  const leadSections = formatted?.filter((section: any) => section.category === "lead")

  return (
    <div className="relative min-h-[100vh] w-96 border-r-2 border-neutral-500 pb-8 [&>*]:px-4">
      <div className="sticky top-0 z-10 flex h-auto w-full flex-row bg-white py-2 shadow-sm">
        <div className="relative size-full">
          <h3 className="max-w-[75%] text-2xl">{data?.data?.NAME || clicked.id}</h3>
          <div className="m-x-auto my-2 flex w-full flex-row items-center justify-between gap-4 rounded-xl border-2 border-neutral-200 p-2 text-xs">
            <p>Open the report for this area</p>
            <a
              href={`/tract/${clicked.id}`}
              className="border-b-2 border-black transition-colors hover:border-primary-500 hover:text-primary-500"
            >
              Neighborhood
            </a>
            <a
              href={`/county/${clicked.id.slice(0, 5)}`}
              className="border-b-2 border-black transition-colors hover:border-primary-500 hover:text-primary-500"
            >
              County
            </a>
            <a
              href={`/state/${clicked.id.slice(0, 2)}`}
              className="border-b-2 border-black transition-colors hover:border-primary-500 hover:text-primary-500"
            >
              State
            </a>
          </div>
          <button onClick={close} className="absolute right-0 top-0 p-2">
            &times;
          </button>
        </div>
      </div>
      <LeadSectionsRenderer sections={leadSections} />
      {!!(data?.parentCompanyData && Object.keys(data?.parentCompanyData).length > 0) && (
        <>
          <div className="my-4 w-full border-b-2 border-neutral-200" />
          <p className="text-bold pt-4 text-xs font-bold">Estimated market share of major national brands</p>
          <Table data={data?.parentCompanyData || []} headers={["Parent Company", "Market Share"]} />
        </>
      )}
      {!!data?.race && (
        <>
          <div className="my-4 w-full border-b-2 border-neutral-200" />
          <p className="text-bold pt-4 text-xs font-bold">Demographic Profile</p>
          <div className="h-128 relative w-full">
            <PieChart
              layout="vertical"
              data={data.race}
              dataKey="value"
              labelKey="raceEthnicity"
              labelMapping={raceEthnicityLabels}
            />
          </div>
        </>
      )}

      {!!data?.statText && (
        <>
          <div className="my-4 w-full border-b-2 border-neutral-200" />
          <ReportSections
            component="Key Statistics"
            id={data.data.GEOID}
            divId="sidebar-key-statistics"
            data={data.data}
            stats={data.statText}
            unit="unit"
            raceData={{}}
            showTitle={false}
          />
        </>
      )}
      {/* <Table data={data?.data} /> */}

      {/* <TimeseriesChart id={clicked.id} placeName={clicked.id} /> */}
    </div>
  )
}

export const ClientCensusStats = () => {
  // ReportSections
}
