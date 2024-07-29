import { parseMDX } from "@tinacms/mdx"

const parseRich = (mdxContent: string) => {
  return parseMDX(
    mdxContent,
    {
      name: "body", // This is the key in your data for the rich text content
      label: "Body", // This is the label that will be displayed in the TinaCMS sidebar
      // @ts-ignore
      component: "rich-text", // This tells TinaCMS to use the rich text editor component
      description: "Enter the main content of the page here", // Optional: Provides a description for this field in the sidebar
    },
    (f: any) => f
  )
}

export default parseRich