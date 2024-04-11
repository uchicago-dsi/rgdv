import React from "react"
import path from "path"
import { getSummaryStats } from "utils/data/summaryStats"
import fs from "fs"

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
  "segregation_2021_state_percentile"
]
type CountyDataValues = [
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]
type CountyDataMap = Map<CountyDataKeys, CountyDataValues>


const CountyPage: React.FC<CountyRouteProps> = async ({ params }) => {
  const county = params.county
  const countyDataPath = path.join(process.cwd(), "public", "data", `county_summary_stats.msgpack`)
  const contentPath = path.join(process.cwd(), "content", `page`)
  console.log(contentPath)
  // fs read files in contentPath
  const files = fs.readdirSync(contentPath)
  console.log(files)
  const countyStats = await getSummaryStats<CountyDataMap>(countyDataPath, county)

  return (
    <div>
      <h1>{county}</h1>
      <code>
      {/* @ts-ignore */}

      {JSON.stringify(Object.fromEntries(countyStats), null, 2)}
      </code>
    </div>
  )
}

export default CountyPage