"use client"
import React from "react"
// lazy load the map
import dynamic from "next/dynamic"
const Map = dynamic(() => import("components/Map/Map"), { ssr: false })

export function Renderer() {
  return (
    <>
      <Map/>
    </>
  )
}
