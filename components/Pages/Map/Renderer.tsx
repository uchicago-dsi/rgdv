"use client"
import dynamic from "next/dynamic"
import React from "react"
// lazy load the map
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

export const Renderer: React.FC<{ contentSections: any }> = ({ contentSections }) => {
  return (
    <>
      <Map contentSections={contentSections} />
    </>
  )
}
