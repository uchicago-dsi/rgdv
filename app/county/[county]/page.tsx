import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

type CountyRouteParams = {
  params: {
    county: string
  }
}

const CountyPage: React.FC<CountyRouteParams> = async ({ params }) => {
  getContentDirs()
  return <ReportLayout id={params.county} />
}

export default CountyPage
