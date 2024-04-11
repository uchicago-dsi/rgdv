/**
 * @type {import('tinacms').Collection}
 */
export default {
  label: "Page Content",
  name: "page",
  path: "public/content/page",
  format: "mdx",
  fields: [
    {
      name: "body",
      label: "Main Content",
      type: "rich-text",
      isBody: true,
    },
    // list of "sections"
    // with section title
    // and rich-text body
    {
      name: "sections",
      label: "Sections",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          // Field values are accessed by item?.<Field name>
          return { label: item?.title };
        },
        router: ({ document }) => {
          if (document._sys.filename === "home") {
            return `/`;
          }
          return undefined;
        },
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
        },
        {
          name: "body",
          label: "Body",
          type: "rich-text",
        },
      ],
    },
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return undefined;
    },
  },
};
