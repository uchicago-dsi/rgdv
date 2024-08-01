import { client } from "tina/__generated__/client"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { getContentDirs } from "utils/contentDirs"
import { collections } from "tina/collections/collections"
import IS_DEV from "utils/isDev"
import parseRich from "utils/mdx/parseRich"
import parseRichRecursive from "utils/mdx/parseRichRecursive"

const parseCache: any = {}

export const getMdxContent = async <T extends any>(contentType: keyof typeof client.queries, relativePath: string) => {
  try {
    if (IS_DEV) {
      const r = await client.queries[contentType]({ relativePath })
      return r
    } else {
      getContentDirs()
      const filepath = path.join(process.cwd(), "public", "content", contentType, relativePath)
      if (!parseCache[filepath]) {
        // @ts-ignore
        const schema = collections[contentType]
        const mdxContent = fs.readFileSync(filepath, "utf-8")
        const frontMatter = matter(mdxContent)
        const fmData = frontMatter.data
        parseCache[filepath] = {
          [contentType]: {
            id: `public/content/${contentType}/${relativePath}`,
            __typename: contentType,
            body: parseRich(frontMatter.content),
            ...fmData,
          },
        }
        // @ts-ignore
        parseRichRecursive(parseCache[filepath][contentType], schema)
      }
      return {
        data: parseCache[filepath] as T,
      } as {
        data: T
      }
    }
  } catch (e: any) {
    return new Error(`Error getting content: ${e.message}`)
  }
}

export const getMdxDir = async <T extends any>(contentType: keyof typeof client.queries) => {
  if (IS_DEV) {
    const contentKey = `${contentType}Connection` as keyof typeof client.queries
    // @ts-ignore
    const r = await client.queries[contentKey]()
    // @ts-ignore
    return r.data[contentKey].edges.map((f: any) => ({
      ...f.node,
      _sys: undefined,
      body: undefined,
      slug: f.node.id.split("/").pop().replace(".mdx", ""),
    }))
  } else {
    getContentDirs()
    const filepath = path.join(process.cwd(), "public", "content", contentType)
    const files = fs.readdirSync(filepath + "/")
    return files
      .map((file) => {
        const mdxContent = fs.readFileSync(path.join(filepath, file), "utf-8")
        const frontMatter = matter(mdxContent)
        return frontMatter.data
      })
      .map((f: any, i: number) => ({
        ...f,
        // @ts-ignore
        slug: files[i].replace(".mdx", ""),
      }))
  }
}
