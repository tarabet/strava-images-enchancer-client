import React from 'react'
import { useDispatch } from "react-redux";
import {Button, Header, Image, Modal, Menu, Form, Container, Segment} from 'semantic-ui-react'

import {useFormik} from "formik";
import {signInValidate} from "../utils/common";
import {authLogin} from "../store/auth";

function ModalSignInForm() {
  const [open, setOpen] = React.useState(false)
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validate: signInValidate,
    onSubmit: values => {
      dispatch(authLogin(values))
    },
  });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Menu.Item name='sign in' />}
    >
      <Segment>
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
          <Button color='black' onClick={() => setOpen(false)}>Close</Button>
        </Form>
      </Segment>
    </Modal>
  )
}

export default ModalSignInForm

