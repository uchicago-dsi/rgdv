import React from "react"
import { getContentDirs } from "utils/contentDirs"
import ReportLayout from "components/ReportLayout"

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