import { test } from "node:test"
import assert from "node:assert/strict"
import { getNeighbourLabel } from "./getNeighbourLabel.ts"

test("items without group show their label (backwards compatible)", () => {
  assert.equal(
    getNeighbourLabel({ id: "b", label: "Reset" }, { id: "a", label: "Welcome" }),
    "Reset"
  )
  assert.equal(getNeighbourLabel({ id: "b", label: "Reset" }), "Reset")
})

test("neighbour in the same group shows its label", () => {
  assert.equal(
    getNeighbourLabel(
      { id: "tokens", label: "Tokens", group: "Button" },
      { id: "docs", label: "Docs", group: "Button" }
    ),
    "Tokens"
  )
})

test("neighbour in a different group shows its group name", () => {
  assert.equal(
    getNeighbourLabel(
      { id: "calendar-docs", label: "Docs", group: "Calendar" },
      { id: "button-status", label: "status", group: "Button" }
    ),
    "Calendar"
  )
  assert.equal(
    getNeighbourLabel(
      { id: "button-status", label: "status", group: "Button" },
      { id: "calendar-docs", label: "Docs", group: "Calendar" }
    ),
    "Button"
  )
})

test("grouped neighbour of an ungrouped current page shows its group", () => {
  assert.equal(
    getNeighbourLabel({ id: "x", label: "Docs", group: "Button" }, { id: "y", label: "Y" }),
    "Button"
  )
})
