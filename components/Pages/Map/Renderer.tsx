"use client"
import dynamic from "next/dynamic"
import React from "react"
// lazy load the map
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

export const Renderer: React.FC<{ pageInfo: any }> = ({ pageInfo }) => {
  const contentSections = pageInfo.data.page.sections

  return (
    <>
      <Map contentSections={contentSections} />
    </>
  )
}
