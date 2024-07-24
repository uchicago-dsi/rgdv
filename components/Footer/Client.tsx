"use client"
import React from "react"
import { useTina } from "tinacms/dist/react"
import { FooterRenderer } from "./Renderer"
import { FooterProps } from "./types"

export const FooterClient: React.FC<FooterProps> = ({ nav, content }) => {
  const _nav = useTina({
    query: nav.query,
    variables: nav.variables,
    data: nav.data,
  })
  const _content = useTina({
    query: content.query,
    variables: content.variables,
    data: content.data,
  })

  return (
    // @ts-ignore
    <FooterRenderer nav={_nav} content={_content} />
  )
}
