import { useState, useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import './register.css';

export default function Register() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Sending register request');
    if(confpassword != password){
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/new', { "email":email, "password":password });
      console.log('Received response:', response);
      if (response) {
        setErrorMessage('');
        setShowRegisterSuccess(true);
        setTimeout(() => setShowRegisterSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error registering:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while registering");
      }
    }
  };

  return (
    <>
      <Nav.Link onClick={handleShow} className='nav-link'>Register</Nav.Link>
  
      <Modal show={show} onHide={handleClose} size='m' centered>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                    {showRegisterSuccess && <Alert variant="success">Registered successfully!</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        value={confpassword}
                        onChange={e => setConfPassword(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                      Create Account
                    </Button>
            </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
