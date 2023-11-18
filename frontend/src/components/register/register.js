import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './register.css';

export default function Register() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Nav.Link onClick={handleShow} className='nav-link'>Register</Nav.Link>

      <Modal show={show} onHide={handleClose} size='m' centered>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                    />
                    <Form.Control
                        type="password"
                        placeholder="Password"
                    />
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                    />
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}