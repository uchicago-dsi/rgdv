"use client"
import React from "react"
import { AcpTable } from "components/EnhancedMarkdown/AcpTable"
import { Cr4ScenarioTable } from "components/EnhancedMarkdown/Cr4ScenarioData"
import { StateConcentrationDataTable } from "components/EnhancedMarkdown/StateConcentrationData"
import MapPageInner from "components/Pages/Map"

const PostWidget: React.FC<{ widget: string; props?: string }> = ({ widget, props }) => {
  switch (widget) {
    case "SortableMarketTable":
      return (
        <span className="not-prose">
          <StateConcentrationDataTable />
        </span>
      )
    case "CR4Table":
      return (
        <span className="not-prose">
          <Cr4ScenarioTable />
        </span>
      )
    case "AcpTable":
      return (
        <span className="not-prose">
          <AcpTable />
        </span>
      )
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
        <div className="not-prose relative h-[50vh] w-full">
          <MapPageInner pageInfo={{}} stats={{}} {...extraProps} />
        </div>
      )
    default:
      return null
  }
}

export default PostWidget
