// tina/config.js
import { defineConfig } from "tinacms";

// tina/utils.js
var RichText = {
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
          name: "title"
        },
        {
          type: "string",
          label: "Tooltip Key",
          name: "key"
        },
        {
          name: "body",
          label: "Tooltip Body",
          isBody: true,
          type: "rich-text"
        }
      ]
    }
  ]
};
var PostText = {
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
              value: "SortableMarketTable"
            },
            {
              label: "CR4 Table",
              value: "CR4Table"
            },
            {
              label: "ACP Table",
              value: "AcpTable"
            },
            {
              label: "Map",
              value: "Map"
            }
          ]
        },
        {
          name: "props",
          label: "Extra Props (advanced)",
          type: "string",
          component: "textarea"
        }
      ]
    }
  ]
};

// tina/collections/page.js
var page_default = {
  label: "Page Content",
  name: "page",
  path: "public/content/page",
  format: "mdx",
  fields: [
    {
      ...RichText,
      label: "Main Content"
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
          return { label: item?.title };
        },
        router: ({ document }) => {
          if (document._sys.filename === "home") {
            return `/`;
          }
          return void 0;
        }
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string"
        },
        RichText
      ]
    }
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return void 0;
    }
  }
};

// tina/collections/post.js
var post_default = {
  label: "Posts / Case Studies",
  name: "post",
  path: "public/content/post",
  format: "mdx",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Author",
      name: "author"
    },
    {
      type: "datetime",
      label: "Date",
      name: "date"
    },
    {
      type: "image",
      lable: "Main Image",
      name: "mainImage"
    },
    {
      type: "string",
      label: "Short Description / text",
      name: "shortText"
    },
    PostText
  ],
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.filename}`;
    }
  }
};

// tina/collections/nav.js
var nav_default = {
  label: "Navigation",
  name: "nav",
  path: "public/content/nav",
  format: "mdx",
  create: true,
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string"
    },
    {
      name: "links",
      label: "Links",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.title };
        },
        router: ({ document }) => {
          if (document._sys.filename === "home") {
            return `/`;
          }
          return void 0;
        }
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string"
        },
        {
          name: "path",
          label: "path",
          type: "string"
        },
        // subitems
        {
          name: "sublinks",
          label: "Sublinks",
          type: "object",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.title };
            },
            router: ({ document }) => {
              if (document._sys.filename === "home") {
                return `/`;
              }
              return void 0;
            }
          },
          fields: [
            {
              name: "title",
              label: "Title",
              type: "string"
            },
            {
              name: "path",
              label: "path",
              type: "string"
            }
          ]
        }
      ]
    }
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return void 0;
    }
  }
};

// tina/collections/stats.js
var thresholdStatList = {
  name: "thresholdStat",
  label: "Tthreshold Stat",
  type: "object",
  list: true,
  ui: {
    itemProps: (item) => {
      return { label: item?.title };
    },
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return void 0;
    }
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string"
    },
    {
      name: "column",
      label: "Data Column",
      type: "string"
    },
    {
      name: "tooltip",
      label: "Tooltip",
      type: "rich-text"
    },
    {
      name: "templates",
      label: "Templates",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.threshold };
        },
        router: ({ document }) => {
          if (document._sys.filename === "home") {
            return `/`;
          }
          return void 0;
        }
      },
      fields: [
        {
          name: "body",
          label: "Body",
          type: "rich-text",
          description: "Use double percent signs to denote a column (eg. My stat is %%column%%)."
        },
        {
          name: "threshold",
          label: "Threshold",
          type: "number",
          max: 100,
          min: 0,
          description: "The threshold of the statistic as a percentile. Reports will check each threshold in order, and if the value"
        }
      ]
    }
  ]
};
var stats_default = {
  label: "Reports",
  name: "statistics",
  path: "public/content/statistics",
  descrption: "asdf",
  format: "mdx",
  fields: [
    {
      name: "body",
      label: "Report Main Text (Optional)",
      type: "rich-text",
      isBody: true
    },
    {
      ...thresholdStatList,
      label: "Overview",
      name: "overview",
      fields: [
        thresholdStatList.fields.find((f) => f.name === "title"),
        {
          label: "Measure (Don't edit this unless you are also updating the React components.)",
          name: "measure",
          type: "string"
        },
        {
          name: "column_national",
          label: "National Comparability Data Column (Neighborhood, County, State)",
          type: "string"
        },
        {
          name: "column_state",
          label: "State Comparability Data Column (Neighborhood, County)",
          type: "string"
        },
        {
          name: "column_county",
          label: "County Comparability Data Column (Neighborhood only)",
          type: "string"
        },
        thresholdStatList.fields.find((f) => f.name === "tooltip"),
        thresholdStatList.fields.find((f) => f.name === "templates")
      ]
    },
    // list of "sections"
    // with section title
    // and rich-text body
    {
      ...thresholdStatList,
      label: "Stat Block",
      name: "stat"
    },
    {
      name: "dataDescription",
      label: "[META] Report Data Description (not rendered on page)",
      type: "rich-text",
      isBody: true,
      readOnly: true
    }
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return void 0;
    }
  }
};

// tina/collections/tooltips.js
var tooltips_default = {
  label: "Tooltips",
  name: "tooltips",
  path: "public/content/tooltips",
  format: "mdx",
  create: true,
  fields: [
    {
      name: "title",
      label: "Title",
      type: "string"
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
        return `/`;
      }
      return void 0;
    }
  }
};

// tina/config.js
var config = defineConfig({
  clientId: "",
  //process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch: "main",
  token: "",
  //process.env.TINA_TOKEN,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads"
    }
  },
  build: {
    publicFolder: "public",
    // The public asset folder for your framework
    outputFolder: "admin"
    // within the public folder
  },
  schema: {
    collections: [page_default, post_default, nav_default, stats_default, tooltips_default]
  }
});
var config_default = config;
export {
  config,
  config_default as default
};
