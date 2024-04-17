import { ArrowLeftIcon } from "@radix-ui/react-icons"
import dynamic from "next/dynamic"
import React from "react"
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text"
import path from "path"
import PercentileLineChart from "components/PercentileLineChart"
import { getMdxContent } from "hooks/useMdxContent"
import { getContentDirs } from "utils/contentDirs"
import { getSummaryStats } from "utils/data/summaryStats"
import TimeseriesChart from "components/TimeseriesChart"
import Tooltip from "components/Tooltip"
import { formatMarkdownTemplate } from "utils/data/formatDataTemplate"
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

type CountyRouteProps = {
  params: {
    county: string
  }
}

type CountyData = {
  county: string
  gravity_2021: number
  gravity_2021_percentile: number
  gravity_2021_state_percentile: number
  hhi_2021: number
  hhi_2021_percentile: number
  hhi_2021_state_percentile: number
  segregation_2021: number
  segregation_2021_percentile: number
  segregation_2021_state_percentile: number
}

type CountyDemogData = {
  GEOID: string
  NAME: string
  TOTAL_POPULATION: number
  "NH WHITE ALONE": number
  "NH BLACK ALONE": number
  "NH AMERICAN INDIAN ALONE": number
  "NH ASIAN ALONE": number
  "NH PACIFIC ISLANDER ALONE": number
  "NH SOME OTHER RACE": number
  "NH TWO OR MORE": number
  "NH TWO OR MORE INCLUDING SOME OTHER": number
  "NH TWO OR MORE EXCLUDING SOME OTHER": number
  "HISPANIC OR LATINO": number
  "PCT NH WHITE": number
  "PCT NH BLACK": number
  "PCT NH AMERICAN INDIAN": number
  "PCT NH ASIAN": number
  "PCT NH PACIFIC ISLANDER": number
  "PCT NH SOME OTHER": number
  "PCT NH TWO OR MORE": number
  "PCT NH TWO OR MORE INCLUDING SOME OTHER": number
  "PCT NH TWO OR MORE EXCLUDING SOME OTHER": number
  "PCT HISPANIC OR LATINO": number
  MEDIAN_AGE: number
  POVERTY_RATE: number
  MEDIAN_HOUSEHOLD_INCOME: number
  "NO HEALTHCARE TOTAL": number
  PCT_NO_HEALTHCARE: number
}

const CountyPage: React.FC<CountyRouteProps> = async ({ params }) => {
  // dynamic routes to use mdx content
  getContentDirs()
  const county = params.county
  const countyDataPath = path.join(process.cwd(), "public", "data", `county_summary_stats.msgpack`)
  const countyDemoPath = path.join(process.cwd(), "public", "data", `demography_county.msgpack`)
  const [countyStats, countyDemography, generalStatText] = await Promise.all([
    getSummaryStats<CountyData>(countyDataPath, county),
    getSummaryStats<CountyDemogData>(countyDemoPath, county),
    getMdxContent("statistics", "county.mdx"),
  ])
  if (!countyStats.ok || !countyDemography.ok) {
    return <div>Sorry, we couldn't find data for that county.</div>
  }
  // @ts-ignore
  const stats = generalStatText?.data?.statistics?.stat
  const data = {
    ...countyStats.result,
    ...countyDemography.result,
  } as CountyData & CountyDemogData

  const countyName = data.NAME.toLowerCase().includes("county") ? data.NAME : `${data.NAME} County`
  // @ts-ignore
  const [foodAccess, marketPower, racialEquity] = [
    data["gravity_2021_percentile"],
    100 - data["hhi_2021_percentile"],
    100 - data["segregation_2021_percentile"],
  ]
  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      {/* grid two equal columns
        collapse on mobile */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <a href="/county" className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to counties
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light">COUNTY REPORT</h2>
            <h1>{countyName}</h1>
            <p>
              <TinaMarkdown content={generalStatText.data.statistics.body} />
            </p>
          </div>
        </div>
        <div>
          <div className="relative grid gap-8 lg:grid-cols-3">
            <div className="border-solid border-r-neutral-500 lg:border-r-2 lg:pr-8">
              {/* flex row div */}
              <div className="flex items-center">
                <h3 className="font-weight-900 font-sans text-xl">FOOD ACCESS</h3>
                <Tooltip
                  explainer={<p>Food access reflects the amount of grocery supply available relative to people living in a given area. A</p>}
                  side="bottom"
                  size="sm"
                  withArrow
                />
              </div>
              <h4 className="font-serif text-6xl">{foodAccess}</h4>
              <PercentileLineChart value={foodAccess} />
              <p className="font-serif">This county has food access better than {foodAccess}% of all counties.</p>
            </div>
            <div className="border-solid border-r-neutral-500 lg:border-r-2 lg:pr-8">
              <h3 className="font-weight-900 font-sans text-xl">MARKET POWER</h3>
              <h4 className="font-serif text-6xl">{marketPower}</h4>
              <PercentileLineChart value={marketPower} />
              <p className="font-serif">This county has market power better than {marketPower}% of all counties.</p>
            </div>
            <div className="lg:mr-8">
              <h3 className="font-weight-900 font-sans text-xl">RACIAL EQUITY</h3>
              <h4 className="font-serif text-6xl">{racialEquity}</h4>
              <PercentileLineChart value={racialEquity} />
              <p className="font-serif">
                Black and White residents are more segregated than {100 - racialEquity}% of counties.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="relative h-[50vh] overflow-hidden rounded-md shadow-xl">
          <Map initialFilter={county} />
        </div>
        <div className="rounded-md bg-white p-4 shadow-xl">
          <ul className="list-disc">
            {stats.map((stat: { column: keyof typeof data; templates: any[] }, i: number) => {
              let content = null
              const value = data[stat.column]
              if (!value) return null
              stat.templates.forEach((template: any) => {
                if (!template.threshold || value >= template.threshold) {
                  const parsed = formatMarkdownTemplate(template.body, data)
                  content = (
                    <li className="mb-4 ml-4" key={i}>
                      <TinaMarkdown content={parsed} />
                    </li>
                  )
                }
              })
              return content
            })}
          </ul>
        </div>
      </div>
      <div className="my-8 h-[100vh] w-full bg-white p-8 shadow-xl">
        <TimeseriesChart id={county} />
      </div>
    </div>
  )
}

export default CountyPage
