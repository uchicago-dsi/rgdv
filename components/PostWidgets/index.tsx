"use client"
import React from "react"
import { StateConcentrationDataTable } from "components/EnhancedMarkdown/StateConcentrationData"
import MapPageInner from "components/Pages/Map"

const PostWidget: React.FC<{ widget: string; props?: string }> = ({ widget, props }) => {
  switch (widget) {
    case "SortableMarketTable":
      return <span className="not-prose">
        <StateConcentrationDataTable />
        </span>
    case "test":
      return <code className="bg-gray-200 p-2">Test widget</code>
    case "Map":
      let extraProps: any = {}
      try {
        // parse html codes in props eg  &#x22; -> "
        if (typeof props === "string") {
          const parsed = props?.replace(/&#x([0-9a-fA-F]+);/g, (_, g) => String.fromCharCode(parseInt(g, 16)))
          extraProps = JSON.parse(parsed)
        }
      } catch (e) {
        console.error("Error parsing props", e, props)
      }
      return (
        <div className="relative h-[50vh] w-full not-prose">
          <MapPageInner pageInfo={{}} stats={{}} {...extraProps} />
        </div>
      )
    default:
      return null
  }
}

export default PostWidget
