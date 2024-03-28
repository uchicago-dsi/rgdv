"use client"
import React from "react"
import { NavRenderer } from "./Renderer"
import { NavProps } from "./types"
import { useTina } from "tinacms/dist/react"

export const NavClient: React.FC<NavProps> = ({ navInfo }) => {
  const z = useTina({
      query: navInfo.query,
      variables: navInfo.variables,
      data: navInfo.data
    })
    
    return (
    // @ts-ignore
    <NavRenderer navInfo={z} />
  )
}