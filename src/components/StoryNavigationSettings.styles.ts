import styled from "styled-components"
import { getToken } from "nice-react-styles"

export const SettingsAnchor = styled.div`
  display: inline-flex;
`

export const SettingsMenu = styled.div`
  position: fixed;
  z-index: 10000;
  min-width: 16em;
  padding: ${getToken("gap", "smaller")} 0;
  background-color: ${getToken("backgroundColor")};
  border: 1px solid ${getToken("borderColor")};
  border-radius: ${getToken("borderRadius")};
  box-shadow: ${getToken("boxShadow")};
  overflow: hidden;
`

export const SettingsGroup = styled.div`
  padding: ${getToken("gap", "smaller")} 0;

  & + & {
    border-top: 1px solid ${getToken("borderColor")};
  }
`

export const SettingsItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${getToken("gap")};
  width: 100%;
  margin: 0;
  padding: ${getToken("gap", "smaller")} ${getToken("gap", "base")};
  border: none;
  background: transparent;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  color: ${getToken("color", "light")};
  font-family: ${getToken("fontFamily")};
  font-size: ${getToken("fontSize", "small")};
  line-height: 1.4;

  &:hover {
    background-color: ${getToken("backgroundColor", "dark")};
    color: ${getToken("color")};
  }

  kbd {
    flex-shrink: 0;
    font-family: ${getToken("fontFamily", "code")};
    font-size: ${getToken("fontSize", "smaller")};
    color: ${getToken("color", "lighter")};
  }
`
