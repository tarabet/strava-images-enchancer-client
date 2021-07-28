import React, {useState} from 'react'
import {Button, Form, Header, Icon, Segment} from "semantic-ui-react";
import {useFormik} from "formik";
import { EditorState, convertToRaw } from "draft-js"

import {apiPost} from "../utils/fetch-utils";
import {API_URL_POST_SAVE} from "../utils/constants";

import { RichEditor } from './ReachEditor'
import * as Yup from 'yup';

type PostEditorType = {
  title: string,
  editorState: EditorState
}

export function AdminPostsWriteNewPostComponent() {
  let error: string
  let formik

  const [postSaving, setPostSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')

  const [state, setState] = useState<PostEditorType>({ title: '', editorState: EditorState.createEmpty() })

  formik = useFormik({
    initialValues: state,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Required!')
    }),
    onSubmit: async values => {
      const { editorState, title } = values

      const rawJsonState = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

      const payload = {
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
          <RichEditor
            editorState={formik.values.editorState}
            formikOnChange={formik.setFieldValue}
            onBlur={formik.handleBlur}
          />
          {formik.errors.editorState ? <div>{formik.errors.editorState}</div> : null}
        </Form.Field>
        <Button disabled={!formik.dirty || postSaving} type="submit" content="Save" />
        {postSaving && <Icon loading name='spinner' />}
        {/*Logic should be improved*/}
        {saveStatus === 'success' && <Icon name='check circle' />}
        {saveStatus === 'failed' && <Icon name='close' />}
      </Form>
    </Segment>
  )
}

export default AdminPostsWriteNewPostComponent
