
import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

const NationalPage = async () => {
  getContentDirs()
  return <>
  <h1 className="prose text-4xl p-8 text-center w-full max-w-none">National Report</h1>
  <ReportLayout id={'1'} showHeader={false} />
  </>
}

export default NationalPage