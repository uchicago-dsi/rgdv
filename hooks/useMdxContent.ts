import { client } from 'tina/__generated__/client'
import fs from 'fs'
import path, { parse } from 'path'
import matter from 'gray-matter';
import { parseMDX } from "@tinacms/mdx";
import { getContentDirs } from 'utils/contentDirs';
import { collections } from "tina/collections/collections"

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

const parseCache: any = {}

export const getMdxContent = async <T extends any>(contentType: keyof typeof client.queries, relativePath: string)=> {
  if (DEV) {
    const r = await client.queries[contentType]({ relativePath })
    return r
  } else {
    getContentDirs()
    const filepath = path.join(process.cwd(), 'content', contentType, relativePath)
    if (!parseCache[filepath]) {
      // @ts-ignore
      const schema = collections[contentType]
      const mdxContent = fs.readFileSync(filepath, 'utf-8')
      const frontMatter = matter(mdxContent)
      const fmData = frontMatter.data

      parseCache[filepath] = {
        [contentType]: {
          id: `content/${contentType}/${relativePath}`,
          __typename: contentType,
          body: parseRich(frontMatter.content),
          ...fmData
        }
      }
      parseRichRecursive(parseCache[filepath][contentType], schema)
    }
    return {
      data: parseCache[filepath] as T
    } as {
      data: T
    }
  }
}

const parseRichRecursive = (data: any, schema: any) => {
  const keys = Object.keys(data)
  keys.forEach(key => {
    const keySchema = schema.fields.find((f: any) => f.name === key)
    if (!keySchema) return
    if (keySchema.type === 'rich-text') {
      data[key] = parseRich(data[key])
    } else if (keySchema.list && keySchema.type === 'object') {
      data[key].forEach((d: any) => parseRichRecursive(d, keySchema))
    } else if (keySchema.type === 'object') {
      parseRichRecursive(data[key], keySchema)
    }
  })

}