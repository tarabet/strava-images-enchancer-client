import React, {useState} from 'react'
import {Button, Form, Header, Segment, TextArea} from "semantic-ui-react";
import {useDispatch} from "react-redux";
import {useFormik} from "formik";
import {apiPost} from "../utils/fetch-utils";
import {API_URL_POST_SAVE} from "../utils/constants";
import {POPUP_TOGGLE} from "../store/popup";
import {
  POPUP_POST_SAVE_FAILED,
  POPUP_POST_SAVE_SUCCESS,
  POPUP_PROFILE_UPDATE_FAILED,
  POPUP_PROFILE_UPDATE_SUCCESS
} from "./PopupMapper";

export function AdminPostsWriteNewPostComponent() {
  const [postSaving, setPostSaving] = useState(false)

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      title: '',
      postBody: ''
    },
    onSubmit: async values => {
      setPostSaving(true)

      await apiPost(null, API_URL_POST_SAVE, values)
        .then(() => {
          dispatch({ type: POPUP_TOGGLE, payload: { popupShow: true, popupType: POPUP_POST_SAVE_SUCCESS }})
        })
        .catch(() => {
          dispatch({ type: POPUP_TOGGLE, payload: { popupShow: true, popupType: POPUP_POST_SAVE_FAILED }})
        })

      setPostSaving(false)
    },
  });

  return (
    <Segment basic>
      <Header>Write new post here:</Header>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Field>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          {formik.errors.title ? <div>{formik.errors.title}</div> : null}
        </Form.Field>
        <Form.Field>
          <label htmlFor="postBody">Post body</label>
          <Form.Field
            id="postBody"
            name="postBody"
            type="text-area"
            control={TextArea}
            onChange={formik.handleChange}
            value={formik.values.postBody}
          />
          {formik.errors.postBody ? <div>{formik.errors.postBody}</div> : null}
        </Form.Field>
        {postSaving ? <Button basic loading>Loading</Button>  : <Button type="submit" content="Save" />}
      </Form>
    </Segment>
  )
}

export default AdminPostsWriteNewPostComponent
