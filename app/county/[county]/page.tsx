import React from "react"
import path from "path"
import { getSummaryStats } from "utils/data/summaryStats"
import { getContentDirs } from "utils/contentDirs"
import PercentileLineChart from "components/PercentileLineChart"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
type CountyRouteProps = {
  params: {
    county: string
  }
}

type CountyDataKeys = [
  "county",
  "gravity_2021",
  "gravity_2021_percentile",
  "gravity_2021_state_percentile",
  "hhi_2021",
  "hhi_2021_percentile",
  "hhi_2021_state_percentile",
  "segregation_2021",
  "segregation_2021_percentile",
  "segregation_2021_state_percentile",
]
type CountyDataValues = [string, number, number, number, number, number, number, number, number, number]
type CountyDataMap = Map<CountyDataKeys, CountyDataValues>

const CountyPage: React.FC<CountyRouteProps> = async ({ params }) => {
  // dynamic routes to use mdx content
  getContentDirs()
  const county = params.county
  const countyDataPath = path.join(process.cwd(), "public", "data", `county_summary_stats.msgpack`)
  const countyStats = await getSummaryStats<CountyDataMap>(countyDataPath, county)
  const data = countyStats.result!
  const [foodAccess, marketPower, racialEquity] = [
    // @ts-ignore
    parseInt(data.get("gravity_2021_percentile")),
    // @ts-ignore
    100 - data.get("hhi_2021_percentile"),
    // @ts-ignore
    100 - data.get("segregation_2021_percentile"),
  ]
  return (
    <div className="bg-canvas-500 min-h-[100vh] p-4">
      {countyStats.ok === false ? (
        <div>County not found</div>
      ) : (
        <>
          {/* grid two equal columns
        collapse on mobile */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <a href="/county" className="align-center flex items-center pb-2 text-sm text-gray-600">
                <ArrowLeftIcon className="mr-2 inline h-4 w-4" />
                Back to counties
              </a>
              <div className="prose max-w-none">
                <h2>COUNTY REPORT</h2>
                <h1>{county}</h1>
                <p>
                  Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit
                  amet Lorem ipsum dolor sit amet{" "}
                </p>
              </div>
            </div>
            <div>
              <div className="relative grid gap-8 lg:grid-cols-3">
                <div className="border-solid border-r-neutral-500 lg:border-r-2 lg:pr-8">
                  <h3 className="font-weight-900 font-sans text-xl">FOOD ACCESS</h3>
                  <h4 className="font-serif text-6xl">{foodAccess}</h4>
                  <PercentileLineChart value={foodAccess} />
                </div>
                <div className="border-solid border-r-neutral-500 lg:border-r-2 lg:pr-8">
                  <h3 className="font-weight-900 font-sans text-xl">MARKET POWER</h3>
                  <h4 className="font-serif text-6xl">{marketPower}</h4>
                  <PercentileLineChart value={marketPower} />
                </div>
                <div className="lg:mr-8">
                  <h3 className="font-weight-900 font-sans text-xl">RACIAL EQUITY</h3>
                  <h4 className="font-serif text-6xl">{racialEquity}</h4>
                  <PercentileLineChart value={racialEquity} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CountyPage
