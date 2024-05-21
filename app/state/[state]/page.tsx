import React from "react"
import { getContentDirs } from "utils/contentDirs"
import ReportLayout from "components/ReportLayout"

type StateRouteParams = {
  params: {
    state: string
  }
}

const StatePage: React.FC<StateRouteParams> = async ({ params }) => {
  getContentDirs()
  return <ReportLayout id={params.state} />
}

export default StatePage