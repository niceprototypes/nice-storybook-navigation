# nice-storybook-navigation

A Storybook addon for the Nice design system. Two coordinated pieces:

- **Sidebar tree** — a token-styled manager sidebar: folder + branch-connector
  glyphs, depth/selection-aware tree lines, and a hidden search. Driven by a
  `tagSidebarPaths` engine that stamps derived `data-*` attributes on the tree.
- **Navigation bar** — a fixed preview-side bar: back/next story navigation,
  sidebar (nav) toggle, dark-mode toggle, open-in-editor, and a settings menu.
  The two halves talk over Storybook's addons channel.

## Install

```bash
npm install -D nice-storybook-navigation
```

Requires (peers): `storybook` ≥ 10, `storybook-dark-mode`, `@storybook/addon-links`,
`react`, `react-dom`, `styled-components`, and the Nice packages it renders with.

## Wire it up

`.storybook/main.ts`:

```ts
const config = {
  addons: [
    "@storybook/addon-links",
    "storybook-dark-mode",
    "nice-storybook-navigation", // loads its manager + preview entries
  ],
}
export default config
```

Supply your own navigable sequences (their ids are your story ids) via the
`storyNavigation` parameter in `.storybook/preview.ts(x)`:

```ts
export const parameters = {
  storyNavigation: {
    sequences: [
      [
        { id: "basics-welcome--docs", label: "Welcome" },
        { id: "basics-tokens--docs", label: "Tokens" },
      ],
    ],
  },
}
```

## Caveat

The sidebar styling depends on Storybook's **private** sidebar DOM
(`.sidebar-item`, `data-nodetype`, `[tabindex] > div:first-child > svg`, …),
verified against **Storybook 10**. A Storybook internal change can require
updating the selectors in `src/styles/managerSidebarCss.ts` and
`src/manager/glyphs.ts`.

## License

MIT
