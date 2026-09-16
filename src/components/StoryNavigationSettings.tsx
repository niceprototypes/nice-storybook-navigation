import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { addons } from "storybook/preview-api"
import { NAV_ACTION_EVENT } from "../constants"
import type { NavAction } from "../types"
import StoryNavigationLink from "./StoryNavigationLink"
import {
  SettingsAnchor,
  SettingsMenu,
  SettingsGroup,
  SettingsItem,
} from "./StoryNavigationSettings.styles"

/** An action item (dispatched over the channel) or an external link. */
type MenuItem =
  | { label: string; action: NavAction; shortcut?: string }
  | { label: string; href: string }

/**
 * The menu, grouped like Storybook's own gear menu. The sidebar toggle is omitted
 * — the bar already owns it. Everything else maps to a manager `api` call in the
 * manager register (see `NAV_ACTION_EVENT`), except Documentation, a plain link.
 */
const GROUPS: MenuItem[][] = [
  [
    { label: "About your Storybook", action: "about" },
    { label: "Keyboard shortcuts", action: "shortcuts", shortcut: "⌘⇧," },
  ],
  [
    { label: "Show toolbar", action: "toggle-toolbar", shortcut: "⌥T" },
    { label: "Show addons panel", action: "toggle-panel", shortcut: "⌥A" },
    { label: "Previous component", action: "prev-component", shortcut: "⌥↑" },
    { label: "Next component", action: "next-component", shortcut: "⌥↓" },
    { label: "Previous story", action: "prev-story", shortcut: "⌥←" },
    { label: "Next story", action: "next-story", shortcut: "⌥→" },
    { label: "Collapse all", action: "collapse-all", shortcut: "⌘⇧↑" },
  ],
  [{ label: "Documentation", href: "https://storybook.js.org/docs/?renderer=react" }],
]

/**
 * A preview-side replica of Storybook's settings (gear) menu, surfaced in the
 * navigation bar. Each action crosses the addons channel to the manager, which
 * calls the matching `api` method — the same bridge the nav toggle uses.
 *
 * The popover is portaled to <body> so it escapes the bar's `overflow: hidden`,
 * and positioned `fixed` from the trigger's rect (right-aligned under the gear).
 */
const StoryNavigationSettings: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    setOpen(prev => !prev)
  }

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const run = (action: NavAction) => {
    addons.getChannel().emit(NAV_ACTION_EVENT, action)
    setOpen(false)
  }

  return (
    <SettingsAnchor ref={triggerRef}>
      <StoryNavigationLink label="Settings" onClick={toggle} iconLeft="cog" />
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <SettingsMenu ref={menuRef} style={{ top: pos.top, right: pos.right }} role="menu" aria-label="Storybook settings">
            {GROUPS.map((group, index) => (
              <SettingsGroup key={index}>
                {group.map(item =>
                  "href" in item ? (
                    <SettingsItem
                      as="a"
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                    </SettingsItem>
                  ) : (
                    <SettingsItem key={item.label} type="button" onClick={() => run(item.action)}>
                      <span>{item.label}</span>
                      {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
                    </SettingsItem>
                  )
                )}
              </SettingsGroup>
            ))}
          </SettingsMenu>,
          document.body
        )}
    </SettingsAnchor>
  )
}

export default StoryNavigationSettings
