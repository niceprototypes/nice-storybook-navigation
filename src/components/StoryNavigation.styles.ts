import styled from "styled-components"
import Flex from "nice-react-flex"
import { getToken } from "nice-react-styles"

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
