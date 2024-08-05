"use client"
import dynamic from "next/dynamic"
import React from "react"
import { useMarkdownContextProvider } from "hooks/useMarkdownContext"
// lazy load the map
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

export const Renderer: React.FC<{ pageInfo: any; stats: any }> = ({ pageInfo, stats }) => {
  const MarkdownProvider = useMarkdownContextProvider({
    pageInfo,
    stats,
  })

  return (
    <MarkdownProvider>
      <Map />
    </MarkdownProvider>
  )
}
