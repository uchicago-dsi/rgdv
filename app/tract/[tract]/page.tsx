import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

type TractRouteParams = {
  params: {
    tract: string
  }
}

const TractPage: React.FC<TractRouteParams> = async ({ params }) => {
  getContentDirs()
  return <ReportLayout id={params.tract} />
}

export default TractPage