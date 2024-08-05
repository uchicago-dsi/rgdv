"use client"
import React from "react"
import { StateConcentrationDataTable } from "components/EnhancedMarkdown/StateConcentrationData"

const PostWidget: React.FC<{ widget: string }> = ({ widget }) => {
  switch (widget) {
    case "SortableMarketTable":
      return <StateConcentrationDataTable />
    case "test":
      return <code className="bg-gray-200 p-2">Test widget</code>
    default:
      return null
  }
}

export default PostWidget
