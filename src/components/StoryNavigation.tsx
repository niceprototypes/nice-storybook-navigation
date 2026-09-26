import * as React from "react"
import { useEffect, useState } from "react"
import { addons } from "storybook/preview-api"
import {
  DARK_MODE_EVENT_NAME,
  UPDATE_DARK_MODE_EVENT_NAME,
} from "storybook-dark-mode"
import { navigate } from "@storybook/addon-links"
import Flex from "nice-react-flex"
import Ink from "nice-react-ink"
import type { ThemeType } from "nice-styles"
import { MobileOnlyDiv, OuterFlex, SpacerDiv, TabletUpDiv } from "./StoryNavigation.styles"
import {
  TOGGLE_NAV_EVENT,
  NAV_STATE_EVENT,
  REQUEST_NAV_STATE_EVENT,
  OPEN_IN_EDITOR_EVENT,
  NAV_ACTION_EVENT,
  REQUEST_INDEX_SEQUENCES_EVENT,
  INDEX_SEQUENCES_EVENT,
} from "../constants"
import type {
  StoryNavigationIndexSequence,
  StoryNavigationItem,
  StoryNavigationSequence,
} from "../types"
import { getNeighbourLabel } from "../utilities/getNeighbourLabel"
import StoryNavigationLink from "./StoryNavigationLink"
import StoryNavigationSettings from "./StoryNavigationSettings"

export interface StoryNavigationProps {
  /**
   * Ordered navigable sequences. The bar finds the current page in one of these
   * and renders back/next controls to its neighbours; a page in no sequence
   * renders none. Supplied by the consumer (their own story ids) — the addon
   * carries no project-specific content.
   */
  sequences?: StoryNavigationSequence[]
  /**
   * Sequences derived from Storybook's own index instead of listed by hand —
   * e.g. `[{ titlePrefix: "Components/" }]` chains every page under Components
   * in sidebar order, grouped by folder, so new pages join automatically. The
   * bar requests them from the manager, whose index (`api.getIndex()`) is the
   * one the sidebar is built from. Searched after `sequences`, so a hand-written sequence wins for a
   * page listed in both.
   */
  indexSequences?: StoryNavigationIndexSequence[]
  /** Override the current story id; defaults to the `id` URL query param. */
  currentId?: string
  /**
   * Label of the current story, shown between the back and next links. Defaults
   * to the current page's `label` in the matched sequence, so it matches the
   * wording of the back/next links.
   */
  name?: string
  /**
   * Active theme, driving the theme toggle's icon and label. Defaults to the
   * theme reported by storybook-dark-mode over the addons channel.
   */
  theme?: ThemeType
}

/**
 * Resolve the current docs id. In a Storybook docs page the preview iframe URL
 * carries `?id=<docsId>&viewMode=docs`, so reading the `id` param identifies the
 * page. An explicit `currentId` prop overrides it.
 */
function resolveCurrentId(currentId?: string): string | null {
  if (currentId) return currentId
  if (typeof window === "undefined") return null
  return new URLSearchParams(window.location.search).get("id")
}

/**
 * Find `id`'s own entry and its back/next neighbours within whichever sequence
 * contains it.
 */
function neighbours(
  id: string,
  sequences: StoryNavigationSequence[]
): {
  back?: StoryNavigationItem
  current?: StoryNavigationItem
  next?: StoryNavigationItem
} {
  for (const seq of sequences) {
    const i = seq.findIndex(item => item.id === id)
    if (i !== -1) return { back: seq[i - 1], current: seq[i], next: seq[i + 1] }
  }
  return {}
}

/**
 * Fixed top control bar of Storybook actions: a sidebar (nav) toggle that
 * expands/collapses Storybook's menu via the manager (see the channel events in
 * `constants.ts`), the dark-mode toggle, an open-in-editor action, a settings
 * menu, and back/next story navigation (shown only when the current page belongs
 * to a navigable sequence). Rendered globally by the preview decorator.
 */
const StoryNavigation: React.FC<StoryNavigationProps> = ({
  sequences = [],
  indexSequences,
  currentId,
  name,
  theme,
}) => {
  // storybook-dark-mode only knows light/dark; the `data-theme` attribute
  // mirrored onto <html> in the manager is the day/night equivalent.
  const [detectedTheme, setDetectedTheme] = useState<ThemeType>(() =>
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "night"
      ? "night"
      : "day"
  )
  // Reflects Storybook's sidebar (nav) visibility, kept in sync by the manager
  // over the channel. Nav is shown by default; the request-on-mount corrects it.
  const [isNavShown, setIsNavShown] = useState(true)

  useEffect(() => {
    const channel = addons.getChannel()
    const onDarkMode = (isDark: boolean) =>
      setDetectedTheme(isDark ? "night" : "day")
    channel.on(DARK_MODE_EVENT_NAME, onDarkMode)
    channel.on(NAV_STATE_EVENT, setIsNavShown)
    channel.emit(REQUEST_NAV_STATE_EVENT)
    return () => {
      channel.off(DARK_MODE_EVENT_NAME, onDarkMode)
      channel.off(NAV_STATE_EVENT, setIsNavShown)
    }
  }, [])

  const id = resolveCurrentId(currentId)

  // Index-derived sequences arrive from the manager. Keyed by the request so a
  // late reply to a previous request is ignored; re-requested per page so
  // pages added while the server runs join on the next navigation.
  const indexKey = indexSequences?.length ? JSON.stringify(indexSequences) : ""
  const [indexed, setIndexed] = useState<{
    key: string
    sequences: StoryNavigationSequence[]
  }>({ key: "", sequences: [] })

  useEffect(() => {
    if (!indexKey) return
    const channel = addons.getChannel()
    const onIndexSequences = (reply: {
      key: string
      sequences: StoryNavigationSequence[]
    }) => {
      if (reply.key === indexKey) setIndexed(reply)
    }
    channel.on(INDEX_SEQUENCES_EVENT, onIndexSequences)
    channel.emit(REQUEST_INDEX_SEQUENCES_EVENT, {
      key: indexKey,
      requests: JSON.parse(indexKey) as StoryNavigationIndexSequence[],
    })
    return () => {
      channel.off(INDEX_SEQUENCES_EVENT, onIndexSequences)
    }
  }, [indexKey, id])

  const allSequences =
    indexKey && indexed.key === indexKey
      ? [...sequences, ...indexed.sequences]
      : sequences
  const { back, current, next } = id ? neighbours(id, allSequences) : {}
  const currentName = name ?? current?.label
  const activeTheme = theme ?? detectedTheme
  const otherTheme: ThemeType = activeTheme === "night" ? "day" : "night"

  return (
    <>
      <OuterFlex
        direction="column"
        breakpoints={{
          "tablet+": {
            direction: "row",
          },
        }}
      >
        <Flex
          gap="base"
          alignItems="center"
          breakpoints={{
            "laptop+": {
              justifyContent: "center",
              gap: "large",
            },
          }}
        >
          {back && (
            <StoryNavigationLink
              label={getNeighbourLabel(back, current)}
              onClick={() => navigate({ storyId: back.id })}
              iconLeft="arrow-left"
            />
          )}
          {currentName && (
            <TabletUpDiv>
              <Ink
                size="small"
                weight="medium"
                color="lightest"
              >
                {currentName}
              </Ink>
            </TabletUpDiv>
          )}
          {next && (
            <StoryNavigationLink
              label={getNeighbourLabel(next, current)}
              onClick={() => navigate({ storyId: next.id })}
              iconRight="arrow-right"
            />
          )}
        </Flex>
        <Flex
          alignItems="center"
          gap="base"
          breakpoints={{
            "laptop+": {
              justifyContent: "center",
              gap: "large",
            },
          }}
        >
          <TabletUpDiv>
            <StoryNavigationLink
              label={isNavShown ? "Collapse menu" : "Expand menu"}
              onClick={() => addons.getChannel().emit(TOGGLE_NAV_EVENT)}
              iconLeft={isNavShown ? "collapse" : "expand"}
            />
          </TabletUpDiv>
          <TabletUpDiv>
            <StoryNavigationLink
              label="Open in editor"
              onClick={() => addons.getChannel().emit(OPEN_IN_EDITOR_EVENT)}
              iconLeft="code"
            />
          </TabletUpDiv>
          <StoryNavigationLink
            label={`Switch to ${otherTheme} mode`}
            onClick={() =>
              addons.getChannel().emit(UPDATE_DARK_MODE_EVENT_NAME)
            }
            iconLeft={otherTheme === "day" ? "sun" : "moon"}
            iconVendor
          />
          <StoryNavigationSettings />
          <MobileOnlyDiv>
            <StoryNavigationLink
              label="Open navigation menu"
              onClick={() => addons.getChannel().emit(NAV_ACTION_EVENT, "toggle-mobile-menu")}
              iconLeft="menu"
            />
          </MobileOnlyDiv>
        </Flex>
      </OuterFlex>
      <SpacerDiv />
    </>
  )
}

export default StoryNavigation
