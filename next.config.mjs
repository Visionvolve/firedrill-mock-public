import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Pin tracing root to this directory so the standalone bundle lives directly
  // under .next/standalone/ instead of nesting under the workspace ancestor
  // (the workshop/microsite tree contains another lockfile).
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
