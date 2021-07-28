import React, {useEffect} from 'react'
import {getSession, useSession} from "next-auth/client";
import { GetServerSidePropsContext } from 'next'

import {apiGet, apiPost} from "../../utils/fetch-utils";

import { Layout } from '../../components/Layout'
import {API_URL_GET_USER_PROFILE} from "../../utils/constants";
import {useFormik} from "formik";
import {Button, Container, Form, Header, Segment} from "semantic-ui-react";
import {useDispatch} from "react-redux";
import {POPUP_TOGGLE} from "../../store/popup";
import {
  POPUP_FETCH_ERROR,
  POPUP_PROFILE_UPDATE_FAILED,
  POPUP_PROFILE_UPDATE_SUCCESS
} from "../../components/PopupMapper";

type UserProfile = {
  realName: string,
  profession: string
}

type ProfilePageProps = {
  userProfile: UserProfile,
  error: string
}

export default function Profile({ userProfile, error }: ProfilePageProps) {
  const [ session, loading ] = useSession()
  const { realName, profession } = userProfile
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      realName: realName,
      profession: profession
    },
    onSubmit: values => {
      apiPost(null, API_URL_GET_USER_PROFILE, values)
        .then(() => {
          dispatch({ type: POPUP_TOGGLE, payload: { popupShow: true, popupType: POPUP_PROFILE_UPDATE_SUCCESS }})
        })
        .catch(() => {
          dispatch({ type: POPUP_TOGGLE, payload: { popupShow: true, popupType: POPUP_PROFILE_UPDATE_FAILED }})
        })
    },
  });

  if (typeof window !== 'undefined' && loading) return null

  if (error) {
    dispatch({ type: POPUP_TOGGLE, payload: { popupShow: true, popupType: POPUP_FETCH_ERROR, popupMessage: error }})
  }

  if (session) {
    return (
      <Layout>
        <Segment basic>
          <Header>User Profile Data</Header>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Field>
              <label htmlFor="realName">Real name</label>
              <input
                id="realName"
                name="realName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.realName}
              />
              {formik.errors.realName ? <div>{formik.errors.realName}</div> : null}
            </Form.Field>
            <Form.Field>
              <label htmlFor="profession">Profession</label>
              <input
                id="profession"
                name="profession"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.profession}
              />
              {formik.errors.profession ? <div>{formik.errors.profession}</div> : null}
            </Form.Field>
            <Button type="submit" content="Submit" />
          </Form>
        </Segment>
      </Layout>
    )
  }

  return <Layout><h1>Access denied</h1></Layout>
}

export async function getServerSideProps<GetServerSideProps>(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  const { req } = context

  let error = null

  const userProfile = await apiGet(req, API_URL_GET_USER_PROFILE)
    .then(profile => profile || {})
    .catch(e => {
      console.log("ERROR", e.message)
      error = e.message
      return {}
    })

  return {
    props: {
      error,
      userProfile
    }
  }
}
