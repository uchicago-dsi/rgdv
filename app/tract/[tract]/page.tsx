import { ArrowLeftIcon } from "@radix-ui/react-icons"
import dynamic from "next/dynamic"
import React from "react"
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text"
import PercentileLineChart from "components/PercentileLineChart"
import TimeseriesChart from "components/TimeseriesChart"
import Tooltip from "components/Tooltip"
import { getMdxContent } from "hooks/useMdxContent"
import { getContentDirs } from "utils/contentDirs"
import { getThresholdValue } from "utils/data/formatDataTemplate"
import { getSummaryStats } from "utils/data/summaryStats"
import StoreList from "components/StoreList"
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

type TractRouteProps = {
  params: {
    tract: string
  }
}

type TractData = {
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

type TractDemogData = {
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

const summaryTractArrayCols = [
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

const summaryDemogCols = [
  "GEOID",
  "NAME",
  "TOTAL_POPULATION",
  "NH WHITE ALONE",
  "NH BLACK ALONE",
  "NH AMERICAN INDIAN ALONE",
  "NH ASIAN ALONE",
  "NH PACIFIC ISLANDER ALONE",
  "NH SOME OTHER RACE",
  "NH TWO OR MORE",
  "NH TWO OR MORE INCLUDING SOME OTHER",
  "NH TWO OR MORE EXCLUDING SOME OTHER",
  "HISPANIC OR LATINO",
  "PCT NH WHITE",
  "PCT NH BLACK",
  "PCT NH AMERICAN INDIAN",
  "PCT NH ASIAN",
  "PCT NH PACIFIC ISLANDER",
  "PCT NH SOME OTHER",
  "PCT NH TWO OR MORE",
  "PCT NH TWO OR MORE INCLUDING SOME OTHER",
  "PCT NH TWO OR MORE EXCLUDING SOME OTHER",
  "PCT HISPANIC OR LATINO",
  "MEDIAN_AGE",
  "POVERTY_RATE",
  "MEDIAN_HOUSEHOLD_INCOME",
  "NO HEALTHCARE TOTAL",
  "PCT_NO_HEALTHCARE",
]

const TractPage: React.FC<TractRouteProps> = async ({ params }) => {
  // dynamic routes to use mdx content
  getContentDirs()
  const tract = params.tract
  const [tractData, generalStatText] = await Promise.all([
    getSummaryStats<TractData>('tract', tract),
    getMdxContent("statistics", "tract.mdx"),
  ])

  if (!tractData.ok) {
    return <div>Sorry, we couldn&apos;t find data for that tract.</div>
  }
  const data = tractData.result!
  // @ts-ignore
  const stats = generalStatText?.data?.statistics?.stat
  // @ts-ignore
  const foodAccesstemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "gravity")
  // @ts-ignore
  const marketPowerTemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "hhi")
  // @ts-ignore
  const segregationTemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "segregation")
  // @ts-ignore
  const economicAdvantageTemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "adi")

  // @ts-ignore
  const tractName = data.NAME.toLowerCase().includes("tract") ? data.NAME : `${data.NAME} tract`

  // @ts-ignore
  const [foodAccess, marketPower, segregation, economicAdvantage] = [
    +data[foodAccesstemplate.column as keyof typeof data],
    100 - +data[marketPowerTemplate.column as keyof typeof data],
    100 - +data[segregationTemplate.column as keyof typeof data],
    +data[economicAdvantageTemplate.column as keyof typeof data]
  ]

  const foodAccessText = getThresholdValue(foodAccess, data, foodAccesstemplate)
  const marketPowerText = getThresholdValue(marketPower, data, marketPowerTemplate)
  const segregationText = getThresholdValue(segregation, data, segregationTemplate)
  const economicAdvantageText = getThresholdValue(economicAdvantage, data, economicAdvantageTemplate)

  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      {/* grid two equal columns
        collapse on mobile */}
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="col-span-1">
          <a href="/tract" className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to counties
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light">TRACT REPORT</h2>
            <h1>{tractName}</h1>
            <p>
              {/* @ts-ignore */}
              <TinaMarkdown content={generalStatText.data.statistics.body} />
            </p>
          </div>
        </div>
        <div className="col-start-2 col-end-6 py-8">
          <div className="relative grid gap-8 lg:grid-cols-4">
            <DataLockup
              title={foodAccesstemplate.title}
              tooltip={foodAccesstemplate.tooltip}
              value={+foodAccess}
              description={foodAccessText}
              border
            />
            <DataLockup
              title={marketPowerTemplate.title}
              tooltip={marketPowerTemplate.tooltip}
              value={marketPower}
              description={marketPowerText}
              border
            />
            <DataLockup
              title={economicAdvantageTemplate.title}
              tooltip={economicAdvantageTemplate.tooltip}
              value={economicAdvantage}
              description={economicAdvantageText}
              border
            />
            <DataLockup
              title={segregationTemplate.title}
              tooltip={segregationTemplate.tooltip}
              value={segregation}
              description={segregationText}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="relative h-[50vh] overflow-hidden rounded-md shadow-xl">
          <Map initialFilter={tract} />
        </div>
        <div className="prose max-w-full rounded-md bg-white p-4 shadow-xl">
          <ul className="list-disc">
            {stats.map(
              (
                stat: { column: keyof typeof data; templates: any[]; title: string; tooltip: TinaMarkdownContent },
                i: number
              ) => {
                const value = data[stat.column]
                if (value === undefined) {
                  return null
                }
                const parsed = getThresholdValue(value, data, stat)
                if (!parsed) {
                  return null
                }
                return (
                  <li className="mb-4 ml-4" key={i}>
                    <p>
                      <b>
                        {stat.title}
                        <Tooltip explainer={<TinaMarkdown content={stat.tooltip} />} side="right" size="sm" withArrow />
                      </b>
                    </p>
                    <div className="inline">
                      <TinaMarkdown content={parsed} />
                    </div>
                  </li>
                )
              }
            )}
          </ul>
        </div>
      </div>
      <div className="my-8 w-full p-8 shadow-xl bg-white">
        <TimeseriesChart id={tract} placeName={tractName}/>
      </div>
      <div className="my-8 w-full bg-white p-8 shadow-xl">
        <StoreList id={tract} />
      </div>
    </div>
  )
}

export default TractPage

const DataLockup: React.FC<{
  title: string
  tooltip: TinaMarkdownContent
  value: number
  description: TinaMarkdownContent[] | null
  border?: boolean
}> = ({ title, tooltip, value, description, border }) => {
  return (
    <div className={`${border ? "border-solid border-r-neutral-500 lg:border-r-2" : ""} lg:pr-8`}>
      {/* flex row div */}
      <div className="flex items-center">
        <h3 className="font-weight-900 font-sans text-xl">{title}</h3>
        <Tooltip explainer={<TinaMarkdown content={tooltip} />} side="bottom" size="sm" withArrow />
      </div>
      <h4 className="font-serif text-6xl">{value}</h4>
      <PercentileLineChart value={value} />
      {description ? <TinaMarkdown content={description} /> : null}
    </div>
  )
}
