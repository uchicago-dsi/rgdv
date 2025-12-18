import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

type StateRouteParams = {
  params: Promise<{
    state: string
  }>
}

const StatePage: React.FC<StateRouteParams> = async ({ params }) => {
  getContentDirs()
  const { state } = await params
  return <ReportLayout id={state} />
}

export default StatePage
