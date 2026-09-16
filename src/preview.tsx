import * as React from "react"
import StoryNavigation from "./components/StoryNavigation"
import { PARAM_KEY } from "./constants"
import type { StoryNavigationSequence } from "./types"

/** Shape of the `storyNavigation` parameter a consumer sets. */
interface StoryNavigationParameters {
  sequences?: StoryNavigationSequence[]
}

/**
 * Preview entry. Loaded by Storybook from `nice-storybook-navigation/preview`.
 * A global decorator renders the navigation bar beneath every story, reading the
 * navigable sequences from the consumer's `storyNavigation` parameter — so the
 * addon ships no project-specific story ids.
 *
 * @example
 * // .storybook/preview.tsx
 * export const parameters = {
 *   storyNavigation: { sequences: [[{ id: "basics-welcome--docs", label: "Welcome" }]] },
 * }
 */
export const decorators = [
  (
    Story: React.ComponentType,
    context: { parameters?: Record<string, unknown> }
  ) => {
    const param = context.parameters?.[PARAM_KEY] as
      | StoryNavigationParameters
      | undefined
    return (
      <>
        <Story />
        <StoryNavigation sequences={param?.sequences} />
      </>
    )
  },
]
