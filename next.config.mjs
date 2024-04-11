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
