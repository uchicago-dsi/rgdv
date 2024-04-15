import { defineConfig } from "tinacms";
import page from "./collections/page";
import post from "./collections/post";
import nav from "./collections/nav";
import stats from "./collections/stats";

export const config = defineConfig({
  clientId: "", //process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch: "main",
  token: "",//process.env.TINA_TOKEN,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [page, post, nav, stats],
  },
});

export default config;
