import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import { env } from "./env.mjs"
import NodePolyFillPlugin from "node-polyfill-webpack-plugin"

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[new NodePolyFillPlugin(), withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, { webpack, isServer }) {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: isServer ? /(alasql|react-native-fs)/ : /react-native-fs/,
      })
    )
    return config
  }
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
