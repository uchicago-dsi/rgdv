"use client"
import matter from "gray-matter"
import { useEffect, useState } from "react"
import { client } from "tina/__generated__/client"
import { collections } from "tina/collections/collections"
import IS_DEV from "utils/isDev"
import parseRich from "utils/mdx/parseRich"
import parseRichRecursive from "utils/mdx/parseRichRecursive"

export const useClientMdxContent = <T extends any>(
  contentType: keyof typeof client.queries,
  relativePath: string,
  body: any = undefined
) => {
  const [ready, setReady] = useState(true)
  const [data, setData] = useState<any>(body ? { data: body } : null)

  const getData = async () => {
    if (!ready) return
    try {
      if (false) {
        const r = await client.queries[contentType]({ relativePath })
        // @ts-ignore
        setData(r?.data?.tooltips?.body)
      } else {
        const filepath = `/content/${contentType}/${relativePath}`
        const content = await fetch(filepath)
        const mdxContent = await content.text()
        const frontMatter = matter(mdxContent)
        const parsed = parseRich(frontMatter.content)
        setData(parsed)
      }
    } catch (e: any) {
      setData(new Error(`Error getting content: ${e.message}`))
    }
  }

  // useEffect(() => {
  //   const initModules = async () => {
  //     // dynamic import _matter
  //     _matter = await import("gray-matter")
  //     console.log('matter', _matter)
  //     // dynamic import parseRich and parseRichRecursive
  //     _parseRich = await import("../utils/mdx/parseRich")
  //     _parseRichRecursive = await import("../utils/mdx/parseRichRecursive") 

  //   }
  //   if (!ready && !_matter && !_parseRich && !_parseRichRecursive) {
  //     initModules().then(() => {
  //       setReady(true)
  //     })
  //   } else {
  //     setReady(true)
  //   }
  // }, [])

  useEffect(() => {
    if (ready && !data) {
      getData()
    }
  }, [ready, body, contentType, relativePath])

  return data
}
