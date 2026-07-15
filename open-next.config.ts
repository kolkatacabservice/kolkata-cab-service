import type { OpenNextConfig } from "@opennextjs/cloudflare";

/**
 * open-next.config.ts — Required configuration for @opennextjs/cloudflare.
 *
 * All fields below are required by the OpenNext Cloudflare validator.
 * Using "dummy" caches means no KV setup needed — Cloudflare's HTTP cache
 * (configured via s-maxage headers + Cache Rules) handles edge caching instead.
 */
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
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
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
