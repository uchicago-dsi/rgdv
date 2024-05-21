import React from "react"
import { getContentDirs } from "utils/contentDirs"
import ReportLayout from "components/ReportLayout"

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