/**
 * Public API. The manager and preview entries are loaded by Storybook from the
 * `./manager` and `./preview` subpaths; this entry exposes the component, its
 * types, the `buildIndexSequence` service, the channel event constants, and the
 * parameter key for consumers that want to render or drive the bar directly.
 */
export { StoryNavigation } from "./components"
export type { StoryNavigationProps } from "./components"
export type {
  StoryNavigationItem,
  StoryNavigationItemGroupType,
  StoryNavigationSequence,
  StoryNavigationIndexSequence,
  StoryNavigationIndexEntry,
  NavAction,
} from "./types"
export { buildIndexSequence } from "./services"
export {
  ADDON_ID,
  PARAM_KEY,
  TOGGLE_NAV_EVENT,
  NAV_STATE_EVENT,
  REQUEST_NAV_STATE_EVENT,
  OPEN_IN_EDITOR_EVENT,
  NAV_ACTION_EVENT,
  REQUEST_INDEX_SEQUENCES_EVENT,
  INDEX_SEQUENCES_EVENT,
} from "./constants"
