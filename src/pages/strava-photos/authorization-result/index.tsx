import React from 'react'
import { useSession, getSession } from 'next-auth/client'
import {Button, Container, Header, Message} from "semantic-ui-react"

import {Layout} from "../../../components/Layout"
import {GetServerSidePropsContext} from "next"

export default function StravaPhotosAuthorizationResult ({ status, error, firstname, lastname }: any) {
  const [ session, loading ] = useSession()

  if (loading) return null

  if (!loading && !session) return <Layout>Access Denied, please login first.</Layout>

  return (
    <Layout>
      <Header>Authorization result</Header>
      <Container textAlign="center">
        {error &&  <Button basic color='red' as="a" content={`App authorization failed: ${error.message}`} href="/strava-photos" />}
        {status === 'OK' && <Message positive>
          <Message.Header>All_read access to your activities is authorized for {firstname} {lastname}</Message.Header>
        </Message>}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const { status = null, lastname = null, firstname = null, error = null } = query

  const session = await getSession(context)

  return {
    props: {
      session,
      status: status,
      lastname: lastname,
      firstname: firstname,
      error: error
    }
  }
}
