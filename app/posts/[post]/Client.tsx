"use client"
import { useTina } from "tinacms/dist/react"
import { PostRenderer } from "./Renderer"

export const PostClient: React.FC<{content: any}> = ({content}) => {
      const data = useTina({
      // @ts-ignore
      query: content.query,
      // @ts-ignore
      variables: content.variables,
      data: content.data
    })
    return <PostRenderer content={data} />
  }