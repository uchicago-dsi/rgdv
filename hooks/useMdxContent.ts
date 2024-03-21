import { compile } from '@mdx-js/mdx'
import { client } from 'tina/__generated__/client'
import fs from 'fs'
import path, { parse } from 'path'
import matter from 'gray-matter';
import { parseMDX } from "@tinacms/mdx";

const DEV = process.env.NODE_ENV === 'development'

const parseRich = (mdxContent: string) => {
  return parseMDX(mdxContent, {
    name: 'body', // This is the key in your data for the rich text content
    label: 'Body', // This is the label that will be displayed in the TinaCMS sidebar
    // @ts-ignore
    component: 'rich-text', // This tells TinaCMS to use the rich text editor component
    description: 'Enter the main content of the page here', // Optional: Provides a description for this field in the sidebar
  }, (f: any) => f)
}

export const getMdxContent = async (contentType: keyof typeof client.queries, relativePath: string) => {
  if (DEV) {
    const r = await client.queries[contentType]({ relativePath })
    return r
  } else {
    const filepath = path.join(process.cwd(), 'content', contentType, relativePath)
    const mdxContent = fs.readFileSync(filepath, 'utf-8')
    const frontMatter = matter(mdxContent)
    const data: any = {}
    data[contentType] = {}
    data[contentType].id = `content/${contentType}/${relativePath}`
    data[contentType].__typename = contentType
    data[contentType].body = parseRich(frontMatter.content)
    const fmData = frontMatter.data
    const dataKeys = Object.keys(fmData)
    for (let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i]!
      const value = fmData[key]
      if (Array.isArray(value)) {
        data[contentType][key] = []
        for (let j = 0; j < value.length; j++) {
          const v = value[j] as any
          const content = parseRich(v.body)
          const valueOut = {
            ...v,
            body: content
          }
          data[contentType][key].push(valueOut)
        }
      } else {
        data[contentType][key] = {
          ...value,
          body: parseRich(value.body)
        }
      }
    }
    return {
      data
    }
  }
}