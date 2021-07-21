import React from 'react'
import { useDispatch } from "react-redux";
import {Button, Header, Modal, Form, Segment} from 'semantic-ui-react'

import {useFormik} from "formik";
import {signInValidate} from "../utils/common";
import {authLogin} from "../store/auth";

type ModalSignInFormPropsType = {
  togglePopupHandler: Function
}

function ModalSignInForm({ togglePopupHandler }: ModalSignInFormPropsType) {
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      username: 'alexTestUser',
      password: '0950106547'
    },
    validate: signInValidate,
    onSubmit: values => {
      dispatch(authLogin(values))
    },
  });

  return (
    <Modal
      defaultOpen={true}
      closeIcon={true}
      onClose={() => togglePopupHandler(false, '')}
    >
      <Segment basic>
        <Header>SignIn with existing account</Header>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username ? <div>{formik.errors.username}</div> : null}
          </Form.Field>
          <Form.Field>
            <label htmlFor="password">Last Name</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
          </Form.Field>
          <Button type="submit" content="Submit" />
          <Button color='black' onClick={() => togglePopupHandler(false)}>Close</Button>
        </Form>
      </Segment>
    </Modal>
  )
}

export default ModalSignInForm

