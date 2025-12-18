import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

type CountyRouteParams = {
  params: Promise<{
    county: string
  }>
}

const CountyPage: React.FC<CountyRouteParams> = async ({ params }) => {
  getContentDirs()
  const { county } = await params
  return <ReportLayout id={county} />
}

export default CountyPage
