import { PostText } from "../utils"

/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Posts / Case Studies",
  name: "post",
  path: "public/content/post",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Author",
      name: "author",
    },
    {
      type: "datetime",
      label: "Date",
      name: "date",
    },
    {
      type: "image",
      lable: "Main Image",
      name: "mainImage",
    },
    {
      type: "string",
      label: "Short Description / text",
      name: "shortText",
    },
    PostText,
  ],
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.filename}`
    },
  },
}
