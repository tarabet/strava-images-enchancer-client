import React from 'react'
import {EditorState, convertFromRaw, RawDraftContentState} from "draft-js";

import { RichEditor } from '../../components/ReachEditor'
import { Layout } from '../../components/Layout'
import {GetServerSidePropsContext} from "next";
import {apiGet} from "../../utils/fetch-utils";
import {API_URL_GET_POSTS, API_URL_GET_POSTS_LIST} from "../../utils/constants";

export type PostType = {
  id: number,
  userName: string,
  lastModified: string,
  title: string,
  postBody: string
}

type PostPageParams = {
  post: PostType,
  error?: string
}

export default function Post({ post, error }: PostPageParams) {
  const { title, postBody, userName } = post
  const contentState = convertFromRaw(JSON.parse(postBody))
  const editorState = EditorState.createWithContent(contentState)

  if (error) {
    return <p>Oops some error happened. Error is: ${error}.</p>
  }

  if (post) {
    return (
      <Layout>
        <h1>{title}</h1>
        <p className="posted-by">Posted by: {userName}</p>
        <RichEditor editorState={editorState} readOnly={true}/>
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

  const paths = postsList.map((post: PostType) => ({
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

  const post: PostType = await apiGet(req, API_URL_GET_POSTS + '/' + params?.postId)
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
