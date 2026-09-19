import styled from "styled-components"
import Flex from "nice-react-flex"
import { getBreakpoint, getToken } from "nice-react-styles"

export const OuterFlex = styled(Flex).attrs({
  gap: "smaller",
  padding: "base",
  direction: "row",
  justifyContent: "space-between",
  breakpoints: {
    "laptop+": {
      gap: "large",
      padding: "large large large larger",
    },
  },
})`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: ${getToken("zIndex", "higher")};
  overflow: hidden;

  /* Feathered backdrop: a token-colored screen behind the bar. It's pushed past
     the left/right/bottom viewport edges and blurred, so those edges bleed
     off-screen while only the top edge softly fades into the content above —
     no hard border line. Sits behind the bar's controls (z-index: -1). */
  &::before {
    content: "";
    position: absolute;
    top: -100px;
    left: -8px;
    right: -8px;
    bottom: 0;
    /* Keep the token var() (so it flips day/night via the [data-theme] cascade). */
    background-color: ${getToken("backgroundColor")};
    filter: blur(8px);
    z-index: -1;
  }
`

export const SpacerDiv = styled.div`
  height: calc(${getToken("gap", "large")} * 2 + ${getToken("size", "small")});
`

/**
 * Wraps a control that only exists below tablet. Storybook's own mobile bar owns
 * the nav menu there, and its button is the only way into it — above tablet the
 * sidebar is always present, so the control has nothing to open.
 */
export const MobileOnlyDiv = styled.div`
  display: inline-flex;

  ${getBreakpoint("tablet+")} {
    display: none;
  }
`

/**
 * Wraps a control that is dropped on a phone. The bar has no room for five, and
 * these are the ones a phone can do without: the sidebar is behind the mobile
 * menu there, and there is no editor to open.
 */
export const TabletUpDiv = styled.div`
  display: none;

  ${getBreakpoint("tablet+")} {
    display: inline-flex;
  }
`
