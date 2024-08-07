"use client"
import dynamic from "next/dynamic"
import React from "react"
import { useMarkdownContextProvider } from "hooks/useMarkdownContext"
import { MapProps } from "components/Map/Map"
// lazy load the map
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

export const Renderer: React.FC<{ pageInfo: any; stats: any; initialFilter?: any, initialViewState?: MapProps['initialViewState'] }> = ({
  pageInfo,
  stats,
  initialFilter,
  initialViewState
}) => {
  const MarkdownProvider = useMarkdownContextProvider({
    pageInfo,
    stats,
  })

  return (
    <MarkdownProvider>
      <Map initialFilter={initialFilter} initialViewState={initialViewState}/>
    </MarkdownProvider>
  )
}
