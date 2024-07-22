import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

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
