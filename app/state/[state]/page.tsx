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

type StateRouteParams = {
  params: {
    state: string
  }
}

const StatePage: React.FC<StateRouteParams> = async ({ params }) => {
  // dynamic routes to use mdx content
  getContentDirs()
  const state = params.state

  const [stateData, generalStatText] = await Promise.all([
    getSummaryStats<any>('state', state),
    getMdxContent("statistics", "state.mdx"),
  ])

  if (!stateData.ok) {
    return <div>Sorry, we couldn&apos;t find data for that state.</div>
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
    stateData.result!,
    generalStatText
  )

  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="col-span-1">
          <a href="/state" className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to counties
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light">STATE REPORT</h2>
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
          <Map initialFilter={state} />
        </div>
        <div className="prose max-w-full rounded-md bg-white p-4 shadow-xl">
          <StatList stats={stats} data={data} />
        </div>
      </div>
      <div className="my-8 w-full p-8 shadow-xl bg-white">
        <TimeseriesChart id={state} placeName={name}/>
      </div>
      <div className="my-8 w-full bg-white p-8 shadow-xl">
        <StoreList id={state} />
      </div>
    </div>
  )
}

export default StatePage