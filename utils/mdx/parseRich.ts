import { parseMDX } from "@tinacms/mdx"

const cleanHtmlJsx = (elementName: string, htmlChild: any) => {
  let newElement: any = {
    type: "mdxJsxFlowElement",
    name: elementName,
    children: htmlChild.children,
    props: {},
  }

  const propsRegex = /(\w+)=({[^}]+}|".*?")/g
  let match
  let props: any = {}

  while ((match = propsRegex.exec(htmlChild.value)) !== null) {
    const propName = match[1]
    const propValue = match[2]
    if (!propName || !propValue) {
      continue
    }
    // Process the prop value
    if (propValue.startsWith("<>") && propValue.endsWith("</>")) {
      // For JSX elements, parse the content
      const parsed = parseRich(propValue.slice(3, -3))
      props[propName] = parsed
    } else if (propValue.startsWith("{<>") && propValue.endsWith("</>}")) {
      // For JSX elements, parse the content
      const parsed = parseRich(propValue.slice(4, -4))
      props[propName] = parsed
    } else if (propValue.startsWith("{") && propValue.endsWith("}")) {
      // For values enclosed in {}, remove the braces
      props[propName] = propValue.slice(1, -1).trim()
    } else if (propValue.startsWith('"') && propValue.endsWith('"')) {
      // For values enclosed in quotes, remove the quotes
      props[propName] = propValue.slice(1, -1)
    } else if (propValue.startsWith("<>") && propValue.endsWith("</>")) {
      // For JSX elements, parse the content
      const parsed = parseRich(propValue.slice(3, -3))
      props[propName] = parsed
    } else {
      // For other cases, use the raw value
      props[propName] = propValue
    }
  }
  newElement.props = props
  return newElement
}

const parseRich = (mdxContent: string) => {
  let c = parseMDX(
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
  if (c.children.some((f) => f.type === "html")) {
    const htmlChildren = []
    const htmlChildrenIndexes = []

    for (let i = 0; i < c.children.length; i++) {
      if (c?.children?.[i]?.type === "html") {
        htmlChildren.push(c.children[i])
        htmlChildrenIndexes.push(i)
      }
    }

    for (let i = 0; i < htmlChildren.length; i++) {
      const htmlChild = htmlChildren[i] as any
      const htmlChildIndex = htmlChildrenIndexes[i]!
      const elementName = htmlChild.value.split("\n")[0].split(" ")[0].replace("<", "")
      const newElement = cleanHtmlJsx(elementName, htmlChild)
      c.children[htmlChildIndex] = newElement
    }
  }
  return c
}

export default parseRich
