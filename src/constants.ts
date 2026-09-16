/**
 * Channel events bridging the preview-side navigation bar and the manager-side
 * register. The bar renders inside the preview iframe, but Storybook's sidebar
 * (nav) and story metadata are owned by the manager — so control crosses the
 * addons channel:
 *  - preview emits {@link TOGGLE_NAV_EVENT}        → manager calls `api.toggleNav()`
 *  - preview emits {@link REQUEST_NAV_STATE_EVENT} → manager replies with {@link NAV_STATE_EVENT}
 *  - manager emits {@link NAV_STATE_EVENT}         → bar updates the toggle icon
 *  - preview emits {@link OPEN_IN_EDITOR_EVENT}    → manager opens the current story's source
 *  - preview emits {@link NAV_ACTION_EVENT}        → manager maps the action to an `api` call
 */

/** Namespace for the addon's registered manager entries and channel events. */
export const ADDON_ID = "nice/story-navigation"

export const TOGGLE_NAV_EVENT = `${ADDON_ID}/toggle-nav`
export const NAV_STATE_EVENT = `${ADDON_ID}/nav-state`
export const REQUEST_NAV_STATE_EVENT = `${ADDON_ID}/request-nav-state`
export const OPEN_IN_EDITOR_EVENT = `${ADDON_ID}/open-in-editor`
export const NAV_ACTION_EVENT = `${ADDON_ID}/action`

/** Storybook `parameters` key a consumer sets to supply navigation sequences. */
export const PARAM_KEY = "storyNavigation"
