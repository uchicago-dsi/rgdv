/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Navigation",
  name: "nav",
  path: "content/nav",
  format: "mdx",
  create: true,
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string",
    },
    {
      name: "links",
      label: "Links",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title }
        },
        router: ({ document }) => {
          if (document._sys.filename === "home") {
            return `/`
          }
          return undefined
        },
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
        },
        {
          name: "path",
          label: "path",
          type: "string",
        },
        // subitems
        {
          name: "sublinks",
          label: "Sublinks",
          type: "object",
          list: true,
          ui: {
            itemProps: (item) => {
              // Field values are accessed by item?.<Field name>
              return { label: item?.title }
            },
            router: ({ document }) => {
              if (document._sys.filename === "home") {
                return `/`
              }
              return undefined
            },
          },
          fields: [
            {
              name: "title",
              label: "Title",
              type: "string",
            },
            {
              name: "path",
              label: "path",
              type: "string",
            },
          ],
        },
      ],
    },
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
