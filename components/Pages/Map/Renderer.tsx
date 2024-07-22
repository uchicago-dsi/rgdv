"use client"
import dynamic from "next/dynamic"
import React from "react"
// lazy load the map
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

export function Renderer() {
  return (
    <>
      <Map />
    </>
  )
}
