"use client"
import React from "react"
import { useTina } from "tinacms/dist/react"
import { Renderer } from "./Renderer"
import { HomeProps } from "./types"

export const HomeClient: React.FC<HomeProps> = ({ pageInfo }) => {
  const z = useTina({
      // @ts-ignore
      query: pageInfo.query,
      // @ts-ignore
      variables: pageInfo.variables,
      data: pageInfo.data
    })

  return (
    <Renderer pageInfo={z} />
  )
}