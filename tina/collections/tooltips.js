/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Tooltips",
  name: "tooltips",
  path: "public/content/tooltips",
  format: "mdx",
  create: true,
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      label: "Post Body",
      name: "body",
      type: "rich-text",
      isBody: true
    }
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`
      }
      return undefined
    },
  },
}
