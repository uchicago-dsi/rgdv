import { ArrowLeftIcon } from "@radix-ui/react-icons"
import dynamic from "next/dynamic"
import React from "react"
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text"
import path from "path"
import PercentileLineChart from "components/PercentileLineChart"
import { getMdxContent } from "hooks/useMdxContent"
import { getContentDirs } from "utils/contentDirs"
import { getSummaryStats } from "utils/data/summaryStats"
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

const operators = [
  '-', '+', '*', '/'
] as const

const handleOperator = (operator: typeof operators[number], value: number, value2: number) => {
  switch (operator) {
    case '-':
      return value - value2
    case '+':
      return value + value2
    case '*':
      return value * value2
    case '/':
      return value / value2
  }
}

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
  const [countyStats, generalStatText] = await Promise.all([
    getSummaryStats<CountyDataMap>(countyDataPath, county),
    getMdxContent("statistics", "county.mdx"),
  ])
  // @ts-ignore
  const stats = generalStatText?.data?.statistics?.stat

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
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      {countyStats.ok === false ? (
        <div>County not found</div>
      ) : (
        <>
          {/* grid two equal columns
        collapse on mobile */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <a href="/county" className="align-center flex items-center pb-2 text-sm text-gray-600">
                <ArrowLeftIcon className="mr-2 inline size-4" />
                Back to counties
              </a>
              <div className="prose max-w-none">
                <h2 className="font-light">COUNTY REPORT</h2>
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
                {stats.map((stat: any, i: number) => {
                  let content = null
                  const value = data.get(stat.column)
                  if (!value) return null
                  stat.templates.forEach((template: any) => {
                    if (!template.threshold || value >= template.threshold) {
                      let stringified = JSON.stringify(template.body)
                      // find all %%string%%
                      const matches = stringified.match(/%%(.*?)%%/g)
                      if (matches) {
                        matches.forEach((match) => {
                          const key = match.replace(/%/g, "")
                          if (key.includes("|")){
                            const parts = key.split("|").map((part) => {
                              if (!isNaN(+part)) {
                                return +part
                              }
                              if (operators.includes(part)) {
                                return part
                              }
                              const value = data.get(part as any)
                              return value || null
                            })
                            const [value1, operator, value2] = parts
                            if (!value1 || !value2 || !operator) return
                            // @ts-ignore
                            const result = handleOperator(operator, value1, value2)
                            stringified = stringified.replace(match, `${result}`)
                          } else {
                            const value = data.get(key as any)
                            value && (stringified = stringified.replace(match, `${value}`))
                          }
                        })
                      }
                      const parsed = JSON.parse(stringified) as TinaMarkdownContent[]
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
        </>
      )}
    </div>
  )
}

export default CountyPage
