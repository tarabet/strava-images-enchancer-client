import React, {useEffect} from 'react'

import { Layout } from '../../components/Layout'
import {Container, Header, List} from "semantic-ui-react";
import {useRouter} from "next/router";
import {GetServerSidePropsContext} from "next";
import {apiGet} from "../../utils/fetch-utils";
import {API_URL_GET_POSTS, API_URL_GET_POSTS_LIST} from "../../utils/constants";

export type Post = {
  id: number,
  userName: string,
  lastModified: string,
  title: string,
  postBody: string
}

type PostPageParams = {
  post: Post,
  error?: string
}

export default function Post({ post, error }: PostPageParams) {
  const router = useRouter()
  const { title, postBody } = post

  const { pathname } = router

  if (error) {
    return <p>Ooops some error happened. Error is: ${error}.</p>
  }

  if (post) {
    return (
      <Layout>
        <Container className="main-content-wrapper">
          <h1>{title}</h1>
          <p>{postBody}</p>
        </Container>
      </Layout>
    )
  }
}

export async function getStaticPaths(context: GetServerSidePropsContext) {
  const { req } = context

  let error = null;

  const postsList = await apiGet(req, API_URL_GET_POSTS_LIST)
    .then(postsList => postsList)
    .catch(e => {
      console.log("ERROR", e.message)
      error = e.message
      return {}
    })

  const paths = postsList.map((post: Post) => ({
    params: { postId: post.id.toString() },
  }))

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps(context: GetServerSidePropsContext) {
  const { req, params } = context

  let error = null;

  const post: Post = await apiGet(req, API_URL_GET_POSTS + '/' + params?.postId)
    .then(post => post)
    .catch(e => {
      console.log("ERROR", e.message)
      error = e.message
      return {}
    })

  return {
    props: {
      error,
      post
    },
  }
}
