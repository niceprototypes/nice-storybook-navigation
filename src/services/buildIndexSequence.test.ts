import { test } from "node:test"
import assert from "node:assert/strict"
import { buildIndexSequence } from "./buildIndexSequence.ts"

const docs = (id: string, title: string) => ({ id, title, name: "Docs", type: "docs" })

const entries = [
  docs("basics-welcome--docs", "Basics/Welcome"),
  docs("components--docs", "Components"),
  docs("components-forms-button--docs", "Components/Forms/Button"),
  docs("components-forms-button-tokens--docs", "Components/Forms/Button/Tokens"),
  docs("components-forms-button-status--docs", "Components/Forms/Button/status"),
  docs("components-forms-calendar--docs", "Components/Forms/Calendar"),
  docs("components-forms-calendar-inside-field--docs", "Components/Forms/Calendar/inside Field"),
  docs("components-tile--docs", "Components/Tile"),
  { id: "components-tile--playground", title: "Components/Tile", name: "Playground", type: "story" },
  { id: "components-tile--group", title: "Components/Tile", name: "Tile", type: "group" },
  docs("components-tile-tokens--docs", "Components/Tile/Tokens"),
  docs("bindings-usetheme--docs", "Bindings/useTheme"),
]

test("filters by prefix, keeps order, groups by owning folder, labels by page", () => {
  assert.deepEqual(buildIndexSequence(entries, "Components/"), [
    { id: "components-forms-button--docs", label: "Docs", group: "Button" },
    { id: "components-forms-button-tokens--docs", label: "Tokens", group: "Button" },
    { id: "components-forms-button-status--docs", label: "status", group: "Button" },
    { id: "components-forms-calendar--docs", label: "Docs", group: "Calendar" },
    { id: "components-forms-calendar-inside-field--docs", label: "inside Field", group: "Calendar" },
    { id: "components-tile--docs", label: "Docs", group: "Tile" },
    { id: "components-tile--playground", label: "Playground", group: "Tile" },
    { id: "components-tile-tokens--docs", label: "Tokens", group: "Tile" },
  ])
})

test("the section landing page is excluded by the trailing slash", () => {
  const ids = buildIndexSequence(entries, "Components/").map(item => item.id)
  assert.ok(!ids.includes("components--docs"))
})

test("a title with no owning ancestor is its own group", () => {
  assert.deepEqual(
    buildIndexSequence([docs("x-a-b--docs", "X/A/B")], "X/"),
    [{ id: "x-a-b--docs", label: "Docs", group: "B" }]
  )
})

test("no matches yields an empty sequence", () => {
  assert.deepEqual(buildIndexSequence(entries, "Nothing/"), [])
})
