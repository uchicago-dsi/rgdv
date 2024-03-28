// tina/config.js
import { defineConfig } from "tinacms";

// tina/collections/page.js
var page_default = {
  label: "Page Content",
  name: "page",
  path: "content/page",
  format: "mdx",
  fields: [
    {
      name: "body",
      label: "Main Content",
      type: "rich-text",
      isBody: true
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
        {
          name: "body",
          label: "Body",
          type: "rich-text"
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

// tina/collections/post.js
var post_default = {
  label: "Blog Posts",
  name: "post",
  path: "content/post",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title"
    },
    {
      type: "string",
      label: "Blog Post Body",
      name: "body",
      isBody: true,
      ui: {
        component: "textarea"
      }
    }
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
  path: "content/nav",
  format: "mdx",
  create: true,
  fields: [
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
    collections: [page_default, post_default, nav_default]
  }
});
var config_default = config;
export {
  config,
  config_default as default
};
