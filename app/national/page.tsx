import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

const NationalPage = async () => {
  getContentDirs()
  return <ReportLayout id={'1'} showHeader={false} />
}

export default NationalPage