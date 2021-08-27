import React from 'react'
import {Layout} from "../../components/Layout";
import {Button, Container, Header} from "semantic-ui-react";

import {OAUTH2_AUTHORIZATION_STRAVA} from "../../utils/constants";

const backendUrl = process.env.BACKEND_URL

export default function StravaPhotos () {
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
