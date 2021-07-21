import React from 'react'
import { useDispatch } from "react-redux";

import {Button, Header, Image, Modal, Menu, Form, Container, Segment} from 'semantic-ui-react'

import {useFormik} from "formik";
import {signUpValidate} from "../utils/common";
import {authRegister} from "../store/auth";

type ModalSignInFormPropsType = {
  togglePopupHandler: Function
}

function ModalSignUpForm({ togglePopupHandler }: ModalSignInFormPropsType) {
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: ''
    },
    validate: signUpValidate,
    onSubmit: values => {
      dispatch(authRegister(values))
    },
  });

  return (
    <Modal
      defaultOpen={true}
      closeIcon={true}
      onClose={() => togglePopupHandler(false, '')}
    >
      <Segment basic>
        <Header>Create new account</Header>
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.username ? <div>{formik.errors.username}</div> : null}
          </Form.Field>
          <Form.Field>
            <label htmlFor="password">Password</label>
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

export default ModalSignUpForm

