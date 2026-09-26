/**
 * StoryNavigationItemGroupType
 *
 * Name of the group (e.g. a component folder) a navigable page belongs to. When
 * a back / next neighbour sits in a different group from the current page, the
 * control shows the neighbour's group name instead of its label.
 */
export type StoryNavigationItemGroupType = string

/**
 * One navigable page in a sequence.
 */
export interface StoryNavigationItem {
  /** Story id to navigate to (e.g. the `--docs` id from a page's Meta title). */
  id: string
  /** Short label shown after the back / next arrows. */
  label: string
  /**
   * Optional group the page belongs to. Within a group the back / next controls
   * show the neighbour's `label`; across a group boundary they show the
   * neighbour's `group` instead (e.g. "Calendar" on the last Button page).
   * Items without a group always show their `label`.
   */
  group?: StoryNavigationItemGroupType
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
 * A sequence derived from Storybook's story index instead of listed by hand.
 * Every docs / story entry whose title starts with `titlePrefix` joins one
 * continuous sequence in sidebar order, grouped by folder (see
 * `buildIndexSequence`). Supplied via the `indexSequences` option of the
 * `storyNavigation` parameter or the `StoryNavigation` prop of the same name.
 */
export interface StoryNavigationIndexSequence {
  /**
   * Title prefix an entry must start with to be included, e.g. `"Components/"`.
   * Matched as a plain string prefix, so include the trailing `/` to exclude
   * the section's own landing page (title `"Components"`).
   */
  titlePrefix: string
}

/**
 * The fields of a Storybook index entry the index-derived sequences read. Both
 * the manager's index hash leaves and `index.json` entries satisfy it.
 */
export interface StoryNavigationIndexEntry {
  /** Story / docs id. */
  id: string
  /** Full sidebar title, e.g. `"Components/Forms/Button/as"`. */
  title: string
  /** Entry name, e.g. `"Docs"` or a story's export name. */
  name: string
  /** Entry kind. Only `"docs"` and `"story"` entries are navigable pages. */
  type: string
}

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
  | "toggle-mobile-menu"
