import { ArrowLeftIcon } from "@radix-ui/react-icons"
import dynamic from "next/dynamic"
import React from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import TimeseriesChart from "components/TimeseriesChart"
import { getMdxContent } from "hooks/useMdxContent"
import { getContentDirs } from "utils/contentDirs"
import { getSummaryStats } from "utils/data/summaryStats"
import StoreList from "components/StoreList"
import { renderReportText } from "utils/data/renderReportText"
import DataLockup from "components/DataLockup"
import StatList from "components/StatList"

const Map = dynamic(() => import("components/Map/Map"), { ssr: false })
const ComparisonOverTimeChart = dynamic(() => import("components/ComparisonOverTime"), { ssr: false })

type CountyRouteParams = {
  params: {
    county: string
  }
}

const CountyPage: React.FC<CountyRouteParams> = async ({ params }) => {
  // dynamic routes to use mdx content
  getContentDirs()
  const county = params.county

  const [countyData, generalStatText] = await Promise.all([
    getSummaryStats<any>('county', county),
    getMdxContent("statistics", "county.mdx"),
  ])

  if (!countyData.ok) {
    return <div>Sorry, we couldn&apos;t find data for that county.</div>
  }
  
  const {
    stats,
    name,
    data,
    foodAccess,
    marketPower,
    segregation,
    economicAdvantage,
  } = renderReportText(
    countyData.result!,
    generalStatText
  )

  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="col-span-1">
          <a href="/county" className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to counties
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light">COUNTY REPORT</h2>
            <h1>{name}</h1>
            <p>
              {/* @ts-ignore */}
              <TinaMarkdown content={generalStatText.data.statistics.body} />
            </p>
          </div>
        </div>
        <div className="col-start-2 col-end-6 py-8">
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
            />
            <DataLockup
              title={economicAdvantage.title}
              tooltip={economicAdvantage.tooltip}
              value={economicAdvantage.value}
              description={economicAdvantage.text}
              border
            />
            <DataLockup
              title={segregation.title}
              tooltip={segregation.tooltip}
              value={segregation.value}
              description={segregation.text}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="relative h-[50vh] overflow-hidden rounded-md shadow-xl">
          <Map initialFilter={county} />
        </div>
        <div className="prose max-w-full rounded-md bg-white p-4 shadow-xl">
          <StatList stats={stats} data={data} />
        </div>
      </div>
      <div className="my-8 w-full p-8 shadow-xl bg-white">
        <TimeseriesChart id={county} placeName={name}/>
        {/* <ComparisonOverTimeChart id={county}  placeName="asdf"/> */}
      </div>
      <div className="my-8 w-full bg-white p-8 shadow-xl">
        <StoreList id={county} />
      </div>
    </div>
  )
}

export default CountyPage