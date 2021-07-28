import React from "react";
import {Container} from "semantic-ui-react";

export const MainContent = props => {
  return (
    <Container as="main" className="main-content-wrapper">
      {props.children}
    </Container>
  )
}
