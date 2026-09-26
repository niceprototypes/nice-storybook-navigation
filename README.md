# nice-storybook-navigation

A Storybook addon for the Nice design system: a fixed **preview-side navigation
bar** with

- back / next story navigation across consumer-defined sequences,
- a sidebar (nav) toggle, a dark-mode toggle, and an open-in-editor action,
- a settings menu mirroring Storybook's gear menu.

The bar renders in the preview iframe; a small manager entry bridges its actions
to the Storybook `api` over the addons channel. (The manager **sidebar tree**
styling is a separate addon, `nice-storybook-theme`.)

## Screens

At desktop width every control carries its label, and the current page sits
between the back / next links.

<img src="docs/desktop.png" alt="The navigation bar at desktop width: back and next links either side of the current page name, and labelled controls for collapse menu, open in editor, switch to night mode, and settings." width="100%">

Below tablet the bar sheds what does not fit. The sidebar toggle and
open-in-editor drop away — the sidebar lives behind Storybook's mobile menu
there, and there is no editor to open — and so does the centre label. The back /
next links keep their arrows without labels, the remaining controls become square
and size their glyphs from the icon scale, and a menu control opens Storybook's
own mobile menu.

<img src="docs/mobile.png" alt="The navigation bar at phone width: unlabelled back and next arrows, and three icon-only controls for theme, settings, and the mobile menu." width="320">

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

### Groups

An item may carry an optional `group`. Within a group the back / next controls
show the neighbour's `label`; when the neighbour is in a different group they
show the neighbour's **group name** instead, so the control names the folder it
crosses into. Items without a `group` always show their `label`.

```ts
[
  { id: "components-forms-button-status--docs", label: "status", group: "Button" },
  // On Button/status, Next reads "Calendar"; on Calendar/Docs, Back reads "Button".
  { id: "components-forms-calendar--docs", label: "Docs", group: "Calendar" },
]
```

### Sequences from the story index

Instead of listing ids by hand, a section can be derived from Storybook's own
index with `indexSequences`. Every docs / story entry whose title starts with
`titlePrefix` joins one continuous sequence in sidebar order, so new pages join
automatically:

```ts
export const parameters = {
  storyNavigation: {
    sequences: [/* hand-written sequences */],
    indexSequences: [{ titlePrefix: "Components/" }],
  },
}
```

The same option is a prop on `StoryNavigation` for a bar rendered directly (e.g.
inside a custom `DocsContainer`):
`<StoryNavigation sequences={…} indexSequences={[{ titlePrefix: "Components/" }]} />`.

- **Order.** The sequence is built in the manager from `api.getIndex()`, the
  index the sidebar is built from, whose entries Storybook has already sorted
  by `storySort` — so it follows the sidebar order. The bar requests it over
  the addons channel (`REQUEST_INDEX_SEQUENCES_EVENT` → `INDEX_SEQUENCES_EVENT`).
  Sidebar tag filters chosen in the UI do not change the sequence.
- **Groups.** Each entry's group is its folder: the shortest title under the
  prefix, from the entry's own title upwards, that owns a page. With
  `Components/Forms/Button`, `Components/Forms/Button/Tokens` and
  `Components/Forms/Button/as`, all three group under `"Button"`
  (`Components/Forms` owns no page).
- **Labels.** A page on the folder's own title is labelled by its entry name
  (`Docs`, a story name); a docs page in a sub-title by the last title segment
  (`Tokens`, `as`).
- **Prefix.** Matched as a plain string prefix; the trailing `/` in
  `"Components/"` excludes the section's own landing page (title `Components`).
- Hand-written `sequences` are searched first, so a page listed in both uses its
  hand-written neighbours.

The builder is exported as `buildIndexSequence(entries, titlePrefix)` for use
with any list of index entries (`{ id, title, name, type }`, e.g.
`Object.values(indexJson.entries)`).

## License

MIT
