import type { StoryNavigationItem } from "../types"

/**
 * Text for a back / next control. A neighbour in a different group from the
 * current page shows its group name (the control crosses into that group);
 * otherwise — same group, or no group on the neighbour — it shows its label.
 *
 * @param neighbour - The page the control navigates to.
 * @param current - The current page, when it is in the sequence.
 */
export function getNeighbourLabel(
  neighbour: StoryNavigationItem,
  current?: StoryNavigationItem
): string {
  if (neighbour.group !== undefined && neighbour.group !== current?.group)
    return neighbour.group
  return neighbour.label
}
