import type { OpenNextConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * open-next.config.ts — Required configuration for @opennextjs/cloudflare.
 */
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: () => staticAssetsIncrementalCache,
      tagCache: "dummy",
      queue: "dummy",
    },
  },

  // Required: exposes node:crypto to edge middleware
  edgeExternals: ["node:crypto"],

  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: () => staticAssetsIncrementalCache,
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;

