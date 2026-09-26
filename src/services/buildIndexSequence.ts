import type {
  StoryNavigationIndexEntry,
  StoryNavigationSequence,
} from "../types"

/** Last `/`-separated segment of a title. */
const lastSegment = (title: string): string =>
  title.slice(title.lastIndexOf("/") + 1)

/**
 * Build one continuous navigable sequence from Storybook index entries.
 *
 * - **Filter:** keeps `"docs"` and `"story"` entries whose title starts with
 *   `titlePrefix`.
 * - **Order:** keeps the order of `entries`. Pass them in sidebar order — the
 *   manager's index and `index.json` both are, since Storybook applies
 *   `storySort` when it builds the index.
 * - **Group:** each entry's group is its folder: the shortest title under the
 *   prefix, from the entry's own title upwards, that owns an entry itself.
 *   `Components/Forms/Button/as` groups under `Components/Forms/Button`
 *   (`Components/Forms` owns no page), so its group is `"Button"`.
 * - **Label:** an entry on the folder's own title is labelled by its name
 *   (`"Docs"`, a story name); a docs page in a sub-title by the last title
 *   segment (`"as"`, `"Tokens"`); a story in a sub-title by its name.
 *
 * @param entries - Index entries in sidebar order.
 * @param titlePrefix - Title prefix an entry must start with, e.g. `"Components/"`.
 * @returns The sequence, each item carrying its `group`.
 *
 * @example
 * buildIndexSequence(Object.values(indexJson.entries), "Components/")
 * // [{ id: "components-forms-button--docs", label: "Docs", group: "Button" }, …]
 */
export function buildIndexSequence(
  entries: StoryNavigationIndexEntry[],
  titlePrefix: string
): StoryNavigationSequence {
  const pages = entries.filter(
    entry =>
      (entry.type === "docs" || entry.type === "story") &&
      entry.title.startsWith(titlePrefix)
  )
  const ownedTitles = new Set(pages.map(entry => entry.title))

  return pages.map(entry => {
    const segments = entry.title.slice(titlePrefix.length).split("/")
    let groupTitle = entry.title
    for (let depth = 1; depth <= segments.length; depth++) {
      const candidate = titlePrefix + segments.slice(0, depth).join("/")
      if (ownedTitles.has(candidate)) {
        groupTitle = candidate
        break
      }
    }
    const label =
      entry.title === groupTitle || entry.type !== "docs"
        ? entry.name
        : lastSegment(entry.title)
    return { id: entry.id, label, group: lastSegment(groupTitle) }
  })
}
