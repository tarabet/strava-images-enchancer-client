import React, { useState } from "react";
import { Container, Menu } from "semantic-ui-react";

import ModalSignInForm from "./ModalRegularSignInForm";
import ModalSignUpForm from "./ModalRegularSignUpForm";

export const Header = props => {
  const [ activeItem, setActiveItem ] = useState('home')

  return (
    <Container fluid>
      <Menu pointing secondary>
        <Menu.Item header>Our Company</Menu.Item>
        <Menu.Item
          name='aboutUs'
          active={activeItem === 'aboutUs'}
          onClick={() => setActiveItem('aboutUs')}
        />
        <Menu.Item
          name='jobs'
          active={activeItem === 'jobs'}
          onClick={() => setActiveItem('jobs')}
        />
        <Menu.Item
          name='locations'
          active={activeItem === 'locations'}
          onClick={() => setActiveItem('locations')}
        />
        <Menu.Menu position="right">
          <ModalSignInForm />
          <ModalSignUpForm />
        </Menu.Menu>
      </Menu>
    </Container>
  )
}
