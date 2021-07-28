import React, {useState} from 'react'

import { Layout } from '../../components/Layout'
import {Menu} from "semantic-ui-react";
import AdminPostsWriteNewPostComponent from "../../components/AdminPostsWriteNewPostComponent";
import AdminPostsEditPostsComponent from "../../components/AdminPostsEditPostsComponent";
import AdminPostsPostEditorComponent from "../../components/AdminPostsPostEditorComponent";

interface IAdminPostsState {
  activeItem: string,
  postToEdit: number|null
}

export default function AdminPosts() {
  const [ state, setState ] = useState<IAdminPostsState>({
    activeItem: 'editPosts',
    postToEdit: 11
  })

  function setActiveItem (activeItem: string) {
    setState({
      ...state,
      activeItem
    })
  }

  function editPost(postId: number) {
    setState({
      ...state,
      activeItem: 'post-editor',
      postToEdit: postId
    })
  }

  function deletePost(postId: number) {
    console.log("Delete Post", postId)
  }

  return (
    <Layout>
      <Menu pointing>
        <Menu.Item
          name='writeNewPost'
          active={state.activeItem === 'write-new-post'}
          onClick={() => setActiveItem('write-new-post')}
        />
        <Menu.Item
          name='editPosts'
          active={state.activeItem === 'edit-posts'}
          onClick={() => setActiveItem('edit-posts')}
        />
        <Menu.Item
          disabled={state.postToEdit === null}
          name='postEditor'
          active={state.activeItem === 'post-editor'}
          onClick={() => setActiveItem('post-editor')}
        />
      </Menu>
      {state.activeItem === 'write-new-post' && <AdminPostsWriteNewPostComponent />}
      {state.activeItem === 'edit-posts' && <AdminPostsEditPostsComponent editPost={editPost} deletePost={deletePost} />}
      {state.activeItem === 'post-editor' && <AdminPostsPostEditorComponent postToEdit={state.postToEdit}/>}
    </Layout>
  )
}
