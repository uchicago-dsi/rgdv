export const RichText = {
  name: "body",
  type: "rich-text",
  isBody: true,
  templates: [
    {
      name: "Tooltip",
      label: "Tooltip",
      fields: [
        {
          type: "string",
          label: "Tooltip Title",
          name: "title",
        },
        {
          type: "string",
          label: "Tooltip Key",
          name: "key",
        },
        {
          name: "body",
          label: "Tooltip Body",
          isBody: true,
          type: "rich-text",
        },
      ],
    },
  ],
}

export const PostText = {
  ...RichText,
  label: "Post Body",
  templates: [
    ...RichText.templates,
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
              label: "Sortable Market Dominance Table",
              value: "SortableMarketTable",
            },
            {
              label: "CR4 Table",
              value: "CR4Table",
            },
            {
              label: "ACP Table",
              value: "AcpTable",
            },
            {
              label: "Map",
              value: "Map",
            },
          ],
        },
        {
          name: "props",
          label: "Extra Props (advanced)",
          type: "string",
          component: "textarea",
        },
      ],
    },
  ],
}
