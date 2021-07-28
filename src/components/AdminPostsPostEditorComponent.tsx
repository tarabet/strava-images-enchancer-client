import React, {useEffect, useState} from 'react'
import {Button, Form, Header, Icon, Segment} from "semantic-ui-react";
import {useFormik} from "formik";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js"

import {apiGet, apiPost} from "../utils/fetch-utils";
import {API_URL_GET_POSTS, API_URL_POST_SAVE} from "../utils/constants";

import { RichEditor } from './ReachEditor'
import * as Yup from 'yup';

type AdminPostsPostEditorPropsType = {
  postToEdit: number|null
}

// export const DisplayFormikState = props =>
//   <div style={{ margin: '1rem 0', background: '#f6f8fa', padding: '.5rem' }}>
//     <strong>Injected Formik props (the form's state)</strong>
//     <div style={{}}>
//       <code>touched:</code> {JSON.stringify(props.touched, null, 2)}
//     </div>
//     <div>
//       <code>errors:</code> {JSON.stringify(props.errors, null, 2)}
//     </div>
//     <div>
//       <code>values:</code> {JSON.stringify(props.values, null, 2)}
//     </div>
//     <div>
//       <code>isSubmitting:</code> {JSON.stringify(props.isSubmitting, null, 2)}
//     </div>
//   </div>;

type PostEditorType = {
  title: string,
  id: number|null,
  editorState: EditorState
}

export function AdminPostsPostEditorComponent({ postToEdit }: AdminPostsPostEditorPropsType) {
  let error: string
  let formik

  const [postSaving, setPostSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const [state, setState] = useState<PostEditorType>({ title: '', id: null, editorState: EditorState.createEmpty() })

  useEffect(() => {
    apiGet(null, API_URL_GET_POSTS + '/' + postToEdit)
      .then(post => setState({
        ...post,
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(post.postBody)))
      }))
      .catch(e => {
        console.log("ERROR", e.message)
        error = e.message
        return {}
      })
  }, [])

  formik = useFormik({
    initialValues: state,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Required!')
    }),
    onSubmit: async values => {
      const { id, editorState, title } = values

      const rawJsonState = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

      const payload = {
        id,
        title,
        postBody: rawJsonState
      }

      setPostSaving(true)

      await apiPost(null, API_URL_POST_SAVE, payload)
        .then(() => {
          setSaveStatus('success')
        })
        .catch((e) => {
          setSaveStatus('failed')
        })

      setPostSaving(false)
    },
  });

  return (
    <Segment basic>
      <Header>Edit post here:</Header>
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
          <RichEditor
            editorState={formik.values.editorState}
            formikOnChange={formik.setFieldValue}
            onBlur={formik.handleBlur}
          />
          {formik.errors.editorState ? <div>{formik.errors.editorState}</div> : null}
        </Form.Field>
        <Button disabled={!formik.dirty || postSaving} type="submit" content="Update" />
        {postSaving && <Icon loading name='spinner' />}
        {/*Logic should be improved*/}
        {saveStatus === 'success' && <Icon name='check circle' />}
        {saveStatus === 'failed' && <Icon name='close' />}
      </Form>
    </Segment>
  )
}

export default AdminPostsPostEditorComponent
