import type { OpenNextConfig } from "@opennextjs/cloudflare";
import type { IncrementalCache } from "@opennextjs/aws/types/overrides.js";
import customIncrementalCache from "./src/lib/custom-incremental-cache";

/**
 * open-next.config.ts — Required configuration for @opennextjs/cloudflare.
 *
 * Uses a custom incremental cache that stores files under `_next_cache/` instead
 * of the default `cdn-cgi/_next_cache/`. This is necessary because Cloudflare
 * intercepts all `cdn-cgi/` paths at the CDN layer, preventing ASSETS.fetch()
 * from retrieving those files inside the Worker.
 */
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: () => customIncrementalCache as unknown as IncrementalCache,
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
      incrementalCache: () => customIncrementalCache as unknown as IncrementalCache,
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
