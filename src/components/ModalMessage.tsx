import React from 'react'
import {Header, Modal, Segment} from 'semantic-ui-react'

type ModalMessagePropsType = {
  title: string,
  text: string
  togglePopupHandler: Function
}

function ModalMessage({ text, title, togglePopupHandler }: ModalMessagePropsType) {
  return (
    <Modal
      defaultOpen={true}
      closeIcon={true}
      onClose={() => togglePopupHandler(false, '')}
    >
      <Segment basic>
        <Header>{title}</Header>
        <Modal.Content>
          <p>{text}</p>
        </Modal.Content>
      </Segment>
    </Modal>
  )
}

export default ModalMessage

