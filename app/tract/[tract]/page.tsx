import React from "react"
import type { Metadata } from "next"
import ReportLayout from "components/ReportLayout"
import { getContentDirs } from "utils/contentDirs"

type TractRouteParams = {
  params: Promise<{
    tract: string
  }>
}

export async function generateMetadata({ params }: TractRouteParams): Promise<Metadata> {
  return {
    title: "Tract Report",
    openGraph: {
      images: ["/api/og"],
    },
  }
}

const TractPage: React.FC<TractRouteParams> = async ({ params }) => {
  getContentDirs()
  const { tract } = await params
  return <ReportLayout id={tract} />
}

export default TractPage
