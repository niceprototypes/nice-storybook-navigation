import { addons } from "storybook/manager-api"
import {
  ADDON_ID,
  TOGGLE_NAV_EVENT,
  NAV_STATE_EVENT,
  REQUEST_NAV_STATE_EVENT,
  OPEN_IN_EDITOR_EVENT,
  NAV_ACTION_EVENT,
} from "./constants"
import type { NavAction } from "./types"

/**
 * Manager entry. Loaded by Storybook from `nice-storybook-navigation/manager`.
 * Bridges the preview-side navigation bar — which runs in the preview iframe and
 * can't touch the manager-owned sidebar or read story metadata — to the manager
 * `api` over the addons channel.
 */
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
