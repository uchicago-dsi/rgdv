/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Reports",
  name: "statistics",
  path: "content/stats",
  format: "mdx",
  fields: [
    {
      name: "body",
      label: "Description",
      type: "rich-text",
      isBody: true,
    },
    // list of "sections"
    // with section title
    // and rich-text body
    {
      name: "stat",
      label: "Stat",
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
          name: "column",
          label: "Data Column",
          type: "string"
        },
        {
          name: "templates",
          label: "Templates",
          type: "object",
          list: true,
          ui: {
            itemProps: (item) => {
              // Field values are accessed by item?.<Field name>
              return { label: item?.threshold }
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
              name: "body",
              label: "Body",
              type: "rich-text",
              description: "Use double percent signs to denote a column (eg. My stat is %%column%%).",
            },
            {
              name: "threshold",
              label: "Threshold",
              type: "number",
              max: 100,
              min: 0,
              description: "The threshold of the statistic as a percentile. Reports will check each threshold in order, and if the value",
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