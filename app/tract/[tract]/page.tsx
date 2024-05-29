import Head from "next/head"
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
  return <>
  <Head>
    <title>Tract Report</title>
    <meta
      property="og:image"
      content="/api/og"
    />
  </Head>
  <ReportLayout id={params.tract} />
  </>
}

export default TractPage