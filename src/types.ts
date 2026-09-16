/**
 * One navigable page in a sequence.
 */
export interface StoryNavigationItem {
  /** Story id to navigate to (e.g. the `--docs` id from a page's Meta title). */
  id: string
  /** Short label shown after the back / next arrows. */
  label: string
}

/**
 * An ordered navigable sequence. The bar finds the current page within a
 * sequence and renders back/next controls to its neighbours; a page in no
 * sequence renders no back/next. Consumers supply these — the ids are their own
 * story ids — via the `storyNavigation` parameter (see {@link PARAM_KEY}), so
 * the addon carries no project-specific content.
 */
export type StoryNavigationSequence = StoryNavigationItem[]

/**
 * Actions the settings menu dispatches across the channel; the manager maps
 * each to the matching Storybook `api` call.
 */
export type NavAction =
  | "about"
  | "shortcuts"
  | "toggle-toolbar"
  | "toggle-panel"
  | "prev-component"
  | "next-component"
  | "prev-story"
  | "next-story"
  | "collapse-all"
