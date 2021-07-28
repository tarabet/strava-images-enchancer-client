import React, {useEffect, useState} from 'react'
import {Container, Grid, GridColumn, Icon, List} from "semantic-ui-react";
import {PostsListItem} from "../pages/posts";
import {API_URL_GET_ADMIN_POSTS_LIST, URL_POSTS} from "../utils/constants";
import {apiGet} from "../utils/fetch-utils";

type AdminPostsEditPostsPropsType = {
  editPost: Function,
  deletePost: Function
}

const AdminPostsEditPostsComponent = ({ editPost, deletePost }: AdminPostsEditPostsPropsType) => {
  const [ postsList, setPostsList ] = useState([])

  useEffect(() => {
    apiGet(null, API_URL_GET_ADMIN_POSTS_LIST)
      .then(postsList => setPostsList(postsList))
      .catch(e => {
        return e
      })
  }, [])

  return (
    <Container>
      <List divided relaxed>
        {postsList.length > 0 && postsList.map((item: PostsListItem, i: Number) => {
          return (
            <List.Item key={i.toString()}>
              <List.Content floated="right">
                <Icon link size='large' name="edit" onClick={() => editPost(item.id)}/>
                &nbsp;
                <Icon link size='large' name="delete" onClick={() => deletePost(item.id)}/>
              </List.Content>
              <List.Content key={i.toString()} href={URL_POSTS + '/' + item.id}>{item.title}</List.Content>
            </List.Item>
          )
        })}
      </List>
    </Container>
  )
}

export default AdminPostsEditPostsComponent
