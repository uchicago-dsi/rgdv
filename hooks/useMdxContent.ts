import { compile } from '@mdx-js/mdx'
import { client } from 'tina/__generated__/client'
import fs from 'fs'
import path from 'path'

const DEV = process.env.NODE_ENV === 'development'
const convertMdxToRichText = async (mdxContent: any) => {
  const mdxSource = await compile(mdxContent, {
    // You can pass in options for the MDX compiler here
    // e.g., to enable jsx pragma import or other plugins
  })
  console.log('mdxSource', mdxSource)

  // This function takes the compiled MDX and renders it to a JSON structure
  const renderToJson: any = (node: any) => {
    if (node.type === 'text') {
      return node.value
    }

    if (node.type === 'element') {
      const children = node.children.flatMap(renderToJson)
      const props = Object.fromEntries(
        Object.entries(node.properties).map(([key, value]) => [
          key,
          renderToJson(value),
        ])
      )

      return {
        type: node.name,
        props,
        children,
      }
    }

    return null
  }

  // Render the compiled MDX to a JSON structure
  const richTextContent = renderToJson(mdxSource.value)

  return richTextContent
}

export const getMdxContent = async (contentType: keyof typeof client.queries, relativePath: string) => {
  if (DEV || true) {
    return await client.queries[contentType]({ relativePath })
  } else {
    const filepath = path.join(process.cwd(), 'content', contentType, relativePath)
    const mdxContent = fs.readFileSync(filepath, 'utf-8')
    return await convertMdxToRichText(mdxContent)
  }
}