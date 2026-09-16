import { addons } from "storybook/manager-api"
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode"
import { applyTheme } from "nice-styles"
import {
  ADDON_ID,
  TOGGLE_NAV_EVENT,
  NAV_STATE_EVENT,
  REQUEST_NAV_STATE_EVENT,
  OPEN_IN_EDITOR_EVENT,
  NAV_ACTION_EVENT,
} from "./constants"
import type { NavAction } from "./types"
import { injectSidebarGlyphs } from "./manager/glyphs"
import { startSidebarTagging } from "./manager/tagSidebarPaths"
import { managerSidebarCss } from "./styles/managerSidebarCss"

/**
 * Manager entry. Loaded by Storybook from `nice-storybook-navigation/manager`.
 * Runs on import: restyles the sidebar tree, wires theming so its tokens flip,
 * and bridges the preview-side navigation bar to the manager `api`. Only the
 * sidebar is configured here — the consumer keeps ownership of the manager theme
 * and branding via their own `addons.setConfig`.
 */

// Collapsible top-level sections (Storybook expands only the selected story's
// ancestors), so the tree reads as folders rather than always-open roots.
addons.setConfig({ sidebar: { showRoots: false } })

// Inject the sidebar stylesheet + glyph masks, then start tagging the tree so
// the CSS/glyphs have their data attributes to read.
const sidebarStyle = document.createElement("style")
sidebarStyle.textContent = managerSidebarCss
document.head.appendChild(sidebarStyle)
injectSidebarGlyphs()
startSidebarTagging()

// Mirror storybook-dark-mode into <html data-theme="night|day"> so the sidebar's
// nice tokens flip on toggle (nice-styles keys theming on [data-theme]).
const syncTheme = (isDark: boolean) => applyTheme(isDark ? "night" : "day")
addons.register(`${ADDON_ID}/theme-sync`, () => {
  addons.getChannel().on(DARK_MODE_EVENT_NAME, syncTheme)
})

// Unbind the sidebar search shortcut. The field is hidden in the stylesheet;
// cmd/ctrl-K would otherwise still leave fullscreen and force-show the sidebar
// before focusing a hidden input. An empty key list never matches.
addons.register(`${ADDON_ID}/disable-search`, (api) => {
  api.setShortcut("search", [])
})

// Bridge the preview-side navigation bar (it runs in the preview iframe and
// can't touch the manager-owned sidebar) to the manager over the channel.
addons.register(ADDON_ID, (api) => {
  const channel = addons.getChannel()
  const emitState = () => channel.emit(NAV_STATE_EVENT, api.getIsNavShown())

  channel.on(TOGGLE_NAV_EVENT, () => {
    // Emit the intended next state (getIsNavShown may not reflect the toggle
    // synchronously) so the bar's icon flips deterministically.
    const next = !api.getIsNavShown()
    api.toggleNav()
    channel.emit(NAV_STATE_EVENT, next)
  })
  channel.on(REQUEST_NAV_STATE_EVENT, emitState)

  // Open the current story's source in the local editor. Only the manager knows
  // the file (importPath); a no-op in a static (built) Storybook.
  channel.on(OPEN_IN_EDITOR_EVENT, () => {
    const file = api.getCurrentStoryData()?.importPath
    if (file) api.openInEditor({ file })
  })

  // Settings menu — map each preview-side action to the manager api.
  const ACTIONS: Record<NavAction, () => void> = {
    "about": () => api.changeSettingsTab("about"),
    "shortcuts": () => api.changeSettingsTab("shortcuts"),
    "toggle-toolbar": () => api.toggleToolbar(),
    "toggle-panel": () => api.togglePanel(),
    "prev-component": () => api.jumpToComponent(-1),
    "next-component": () => api.jumpToComponent(1),
    "prev-story": () => api.jumpToStory(-1),
    "next-story": () => api.jumpToStory(1),
    "collapse-all": () => api.collapseAll(),
  }
  channel.on(NAV_ACTION_EVENT, (action: NavAction) => ACTIONS[action]?.())
})
