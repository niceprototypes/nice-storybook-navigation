import { addons } from "storybook/manager-api"
import {
  ADDON_ID,
  TOGGLE_NAV_EVENT,
  NAV_STATE_EVENT,
  REQUEST_NAV_STATE_EVENT,
  OPEN_IN_EDITOR_EVENT,
  NAV_ACTION_EVENT,
  REQUEST_INDEX_SEQUENCES_EVENT,
  INDEX_SEQUENCES_EVENT,
} from "./constants"
import { buildIndexSequence } from "./services/buildIndexSequence"
import type {
  NavAction,
  StoryNavigationIndexEntry,
  StoryNavigationIndexSequence,
} from "./types"

/** Payload of {@link REQUEST_INDEX_SEQUENCES_EVENT}. */
interface IndexSequencesRequest {
  /** Echoed back so the bar can match the reply to its current request. */
  key: string
  requests: StoryNavigationIndexSequence[]
}

/** Retry cadence while the manager has not loaded its index yet. */
const INDEX_RETRY_MS = 100
const INDEX_RETRY_LIMIT = 50

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

  // Index-derived sequences. Built here rather than in the preview because the
  // manager owns the index the sidebar is built from, exposed through the public
  // `api.getIndex()`: its entries are already in storySort order (Storybook
  // sorts the index when it builds it), so the chain matches the sidebar by
  // construction. Early requests can land before the manager has loaded its
  // index, so retry briefly until it is there.
  const replyIndexSequences = (request: IndexSequencesRequest, attempt = 0) => {
    const index = api.getIndex()
    if (!index) {
      if (attempt < INDEX_RETRY_LIMIT)
        setTimeout(() => replyIndexSequences(request, attempt + 1), INDEX_RETRY_MS)
      return
    }
    const entries: StoryNavigationIndexEntry[] = Object.values(index.entries)
    channel.emit(INDEX_SEQUENCES_EVENT, {
      key: request.key,
      sequences: request.requests.map(({ titlePrefix }) =>
        buildIndexSequence(entries, titlePrefix)
      ),
    })
  }
  channel.on(REQUEST_INDEX_SEQUENCES_EVENT, (request: IndexSequencesRequest) =>
    replyIndexSequences(request)
  )

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
    // Storybook exposes no api for the mobile menu — its state lives in the
    // mobile layout context — so click the bar's own button. Keyed on
    // aria-controls rather than the label, which is prose and localizable, and a
    // no-op above the mobile layout where the button is not rendered.
    "toggle-mobile-menu": () =>
      document
        .querySelector<HTMLElement>('[aria-controls="storybook-mobile-menu"]')
        ?.click(),
  }
  channel.on(NAV_ACTION_EVENT, (action: NavAction) => ACTIONS[action]?.())
})
