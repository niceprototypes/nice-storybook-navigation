import { defineConfig } from "tsup"

/**
 * Three entry points, matching the Storybook addon contract:
 * - `index`   — the public API (the `StoryNavigation` component, types, the
 *   channel event constants) consumers import directly.
 * - `manager` — the manager-side register: sidebar tree restyle + the
 *   `tagSidebarPaths` engine + the preview↔manager channel bridge. Loaded by
 *   Storybook from `nice-storybook-navigation/manager`.
 * - `preview` — the preview-side global decorator that renders the navigation
 *   bar. Loaded from `nice-storybook-navigation/preview`.
 *
 * Everything the host Storybook already provides — React, styled-components,
 * the storybook runtime, and the Nice packages (kept as singletons by the
 * consumer) — is externalized so the addon never bundles a second copy.
 */
export default defineConfig({
  entry: ["src/index.ts", "src/manager.tsx", "src/preview.tsx"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "styled-components",
    "storybook",
    "storybook-dark-mode",
    /^@storybook\//,
    /^nice-/,
  ],
})
