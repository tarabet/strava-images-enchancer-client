import React, {useEffect, useState} from "react";
import {Container, Dropdown, Menu} from "semantic-ui-react";
import {useDispatch} from "react-redux";

import { togglePopup } from "../store/popup";
import {POPUP_SIGN_IN_FORM, POPUP_SIGN_UP_FORM} from "./PopupMapper";
import {useSession} from "next-auth/client";
import { useRouter } from "next/router";

import {authSignOut} from "../store/auth";
import {URL_POSTS} from "../utils/constants";

export const Header = props => {
  const [ activeItem, setActiveItem ] = useState('home')
  const [session, loading] = useSession()
  const dispatch = useDispatch()
  const router = useRouter()

  const userName = session?.user?.name

  useEffect(() => {
    const { pathname } = router

    switch(pathname) {
      case URL_POSTS: {
        return setActiveItem('postsList')
      }
      default: {
        return setActiveItem('home')
      }
    }
  }, [])

  function togglePopupHandler (showFlag, type) {
    dispatch(togglePopup(showFlag, type))
  }

  return (
    <Container>
      <Menu pointing secondary>
        <Menu.Item onClick={() => router.push('/')} header>Feed Aggregator</Menu.Item>
        <Menu.Item
          name='postsList'
          active={activeItem === 'postsList'}
          href={URL_POSTS}
          onClick={() => setActiveItem('postsList')}
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
          {loading && <Menu.Item name={`Loading...`} />}
          {session && <Menu.Item onClick={() => router.push('/profile')} name={`Welcome ${userName}`} />}
          {session && (
            <Dropdown item text='Actions'>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => router.push('/admin-posts')}>Posts</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          {session ? <Menu.Item name='sign out' onClick={() => authSignOut()}/> : <Menu.Item name='sign in' onClick={() => togglePopupHandler(true, POPUP_SIGN_IN_FORM)}/> }
          {!session && <Menu.Item name='sign up' onClick={() => togglePopupHandler(true, POPUP_SIGN_UP_FORM)}/>}
        </Menu.Menu>
      </Menu>
    </Container>
  )
}


