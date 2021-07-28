import React, {useEffect} from 'react'
import {getSession, useSession} from "next-auth/client";
import { GetServerSidePropsContext } from 'next'

import {apiGet} from "../../utils/fetch-utils";

import { Layout } from '../../components/Layout'
import {API_URL_GET_POSTS_LIST, URL_POSTS} from "../../utils/constants";
import Error from "next/error";
import {Container, Header, List} from "semantic-ui-react";

export type PostsPageProps = {
  error?: string,
  postsList: Array<PostsListItem>
}

export type PostsListItem = {
  id: number,
  title: string,
  userName: string
}

export default function Posts({ postsList, error }: PostsPageProps) {
  if (error) {
    return(
      <h1>Some error happened: {error}!</h1>
    )
  }

  return (
    <Layout>
        <Header as="h1">All posts list</Header>
        <List bulleted>
          {postsList?.map((item: PostsListItem, i: Number) => {
            return <List.Item key={i.toString()} href={URL_POSTS + '/' + item.id}>{item.title}</List.Item>
          })}
        </List>
    </Layout>
  )
}

export async function getServerSideProps<GetServerSideProps>(context: GetServerSidePropsContext) {
  const { req } = context

  let error = null

  const postsList = await apiGet(req, API_URL_GET_POSTS_LIST)
    .then(postsList => postsList)
    .catch(e => {
      console.log("ERROR", e.message)
      error = e.message
      return {}
    })

  return {
    props: {
      error,
      postsList
    }
  }
}
