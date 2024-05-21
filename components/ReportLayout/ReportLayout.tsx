"use server"
import React from "react"
import { ReportLayoutProps } from "./types"
import { getSummaryStats } from "utils/data/summaryStats"
import { getMdxContent } from "hooks/useMdxContent"
import { renderReportText } from "utils/data/renderReportText"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import DataLockup from "components/DataLockup"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import TimeseriesChart from "components/TimeseriesChart"
import StatList from "components/StatList"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("components/Map/Map"), { ssr: false })
const StoreList = dynamic(() => import("components/StoreList"), { ssr: false })
const ComparisonOverTimeChart = dynamic(() => import("components/ComparisonOverTime"), { ssr: false })

const units = {
  2: 'state',
  5: 'county',
  11: 'tract',
} as const 

export const ReportLayout: React.FC<ReportLayoutProps> = async ({
  id
}) => {
  const unit = units[id.length as keyof typeof units]

  const [_data, statText] = await Promise.all([
    getSummaryStats<any>(unit, id),
    getMdxContent("statistics", "primary.mdx"),
  ])

  if (!_data.ok) {
    return <div>Sorry, we couldn&apos;t find data for that place.</div>
  }
  
  const {
    stats,
    name,
    data,
    foodAccess,
    marketPower,
    segregation,
    economicAdvantage,
    descriptionText
  } = renderReportText(
    _data.result!,
    statText,
    id
  )
  
  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      <div className="lg:grid lg:gap-8 lg:grid-cols-4">
        <div className="col-span-1">
          <a href={`/${data.UNIT}`} className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to {data.UNIT_PLURAL}
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light uppercase">{data.UNIT} REPORT</h2>
            <h1 className="mb-0">{name}</h1>
            <p className="text-sm">
              {/* @ts-ignore */}
              <TinaMarkdown content={descriptionText} />
            </p>
          </div>
        </div>
        <div className="col-start-2 col-end-6 py-8">
          <div>

            
          </div>
          <div className="relative grid gap-8 lg:grid-cols-4">
            <DataLockup
              title={foodAccess.title}
              tooltip={foodAccess.tooltip}
              value={+foodAccess.value}
              description={foodAccess.text}
              border
            />
            <DataLockup
              title={marketPower.title}
              tooltip={marketPower.tooltip}
              value={+marketPower.value}
              description={marketPower.text}
              border
              inverted
            />
            <DataLockup
              title={economicAdvantage.title}
              tooltip={economicAdvantage.tooltip}
              value={economicAdvantage.value}
              description={economicAdvantage.text}
              border
              inverted
            />
            <DataLockup
              title={segregation.title}
              tooltip={segregation.tooltip}
              value={segregation.value}
              description={segregation.text}
              inverted
            />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="relative h-[50vh] overflow-hidden rounded-md shadow-xl">
          <Map initialFilter={id} />
        </div>
        <div className="prose max-w-full rounded-md bg-white p-4 shadow-xl">
          <h3>Additional Data for {name}</h3>
          <StatList stats={stats} data={data} />
        </div>
      </div>
      <div className="my-8 w-full p-8 shadow-xl bg-white">
        <TimeseriesChart id={id} placeName={name}/>
        {/* <ComparisonOverTimeChart id={id}  placeName="asdf"/> */}
      </div>
      <div className="my-8 w-full bg-white p-8 shadow-xl">
        <StoreList id={id} 
          columns={unit === 'tract' ? undefined : [
            'PARENT COMPANY',
            `PCT OF ${data.UNIT.toUpperCase()} SALES`
          ]}
          formatters={unit === 'tract' ? undefined : {
            [`PCT OF ${data.UNIT.toUpperCase()} SALES`]: {
              label: "Estimated Percent of Grocery Sales in " + name,
              formatterPreset: 'percent'
            },
          }}
        />
      </div>
    </div>
  )

}