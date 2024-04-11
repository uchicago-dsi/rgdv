import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import { env } from "./env.mjs"
import NodePolyFillPlugin from "node-polyfill-webpack-plugin"
import path from "path"
/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[new NodePolyFillPlugin(), withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals.map((external) => {
        if (typeof external !== "function") return external
        return ({ context, request }, callback) => {
          // Check if the request starts with the path to your assets
          if (request.startsWith("/content")) {
            // Do not externalize if the request is for server-assets, thus including it in the bundle
            return callback()
          }
          // Use the external function as default for other requests
          return external({ context, request }, callback)
        }
      })
    }
    return config
  },
  // const _config = {
  //   ...config,
  //   experiments: {
  //     ...config.experiments,
  //     asyncWebAssembly: true,
  //   },
  //   resolve: {
  //     ...config.resolve,
  //     fallback: {
  //       ...config.resolve.fallback,
  //       modules: ['node_modules'],
  //         util: path.resolve("node_modules/util/")
  //     }
  //   }
  // }
  // return config
  // },
  experimental: {
    instrumentationHook: true,
  },
  // rewrites() {
  //   return [
  //     { source: "/healthz", destination: "/api/health" },
  //     { source: "/api/healthz", destination: "/api/health" },
  //     { source: "/health", destination: "/api/health" },
  //     { source: "/ping", destination: "/api/health" },
  //   ]
  // },
})

export default config
