/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Posts / Case Studies",
  name: "post",
  path: "content/post",
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
    {
      label: "Post Body",
      name: "body",
      type: "rich-text",
      isBody: true,
      templates: [
        {
          name: "PostWidget",
          label: "Widget",
          fields: [
            {
              name: "widget",
              label: "Interactive Widget",
              type: "string",
              options: [
                {
                  label: "Sortable Market Table",
                  value: "sortableTable",
                },
                {
                  label: "Test",
                  value: "test",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.filename}`
    },
  },
}
