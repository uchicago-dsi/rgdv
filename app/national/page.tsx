import React from "react"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

const NationalPage = async () => {
  getContentDirs()
  return (
    <>
      <h1 className="prose w-full max-w-none p-8 text-center text-4xl">National Report</h1>
      <ReportLayout id={"1"} showHeader={false} />
    </>
  )
}

export default NationalPage
