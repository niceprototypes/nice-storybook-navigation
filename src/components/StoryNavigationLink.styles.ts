import styled from "styled-components"
import Flex from "nice-react-flex"
import Ink from "nice-react-ink"
import { getToken, getBreakpoint } from "nice-react-styles"

/**
 * Wrapper for a single navigation control. Overrides the inlined Button's
 * default link color with the bar's muted `lighter`, brightening to full `color`
 * on hover. Targets `[role="button"]` because each control renders as a clickable
 * `<div>` (`as="div" inlined`), not an anchor.
 */
export const LinkFlex = styled(Flex).attrs({
  direction: "column",
})`
  flex-shrink: 0;

  [role="button"] {
    position: relative;
    color: ${getToken("color", "lighter")} !important;
    height: ${getToken("size", "small")};

    &:hover {
      color: ${getToken("color")} !important;
    }
  }

  ${getBreakpoint("phone")} {
    /* Square tap target: the label is hidden here, so the control is just its
       glyph and the box should not stay text-width. */
    [role="button"] {
      width: ${getToken("size", "small")};
    }

    /* Size Icon's wrapper, not the svg: the wrapper carries the icon.size token
       and its own \`svg { width: 100% }\` makes the glyph follow. Selected by what
       it contains, since the class is generated. */
    [role="button"] div:has(> svg) {
      width: ${getToken("icon.size:large")};
      height: ${getToken("icon.size:large")};
    }
  }
`

/**
 * The link's text label, rendered as an Ink `<span>`. Hidden by default so the
 * icon alone represents the control on narrow viewports, and revealed from
 * laptop up (`getBreakpoint("laptop+")`) where the bar has horizontal room.
 */
export const Label = styled(Ink)`
  display: none;

  ${getBreakpoint("laptop+")} {
    display: inline;
  }
`
