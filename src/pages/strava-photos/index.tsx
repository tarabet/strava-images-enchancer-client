import React from 'react'
import {Layout} from "../../components/Layout";
import {Button, Container, Header} from "semantic-ui-react";

import {OAUTH2_AUTHORIZATION_STRAVA} from "../../utils/constants";
import {GetServerSidePropsContext} from "next";
import {getSession, useSession} from "next-auth/client";

const backendUrl = process.env.BACKEND_URL

export default function StravaPhotos () {
  const [ session, loading ] = useSession()

  if (typeof window !== 'undefined' && loading) return null

  if (session) {
    return (
      <Layout>
        <Header>Strava Photos feature</Header>
        <Container text>
          Please authorize "Route images enhancer" application to get access to your latest public activities.
          <Container className="padding-around-12" textAlign="center">
            <Button as="a" href={backendUrl + OAUTH2_AUTHORIZATION_STRAVA} positive content="Authorize"/>
          </Container>
        </Container>
      </Layout>
    )
  }

  return <p>Access Denied</p>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}
