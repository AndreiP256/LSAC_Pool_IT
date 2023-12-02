import { useState, useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import InputGroup from 'react-bootstrap/InputGroup';

import './register.css';

export default function Register() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);



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
      const response = await axios.post('http://localhost:5000/new', { "email":email, "password":password, "confpass":confpassword });
      console.log('Received response:', response);
      if (response) {
        setErrorMessage('');
        setShowRegisterSuccess(true);
        setTimeout(() => setShowRegisterSuccess(false), 2000);
        window.location.reload()
        //Mabye add a redirect here
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
                        required
                        autoFocus
                    />
                    <InputGroup className='no-margins'>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                      <Button variant="outline-light" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputGroup>
                    <InputGroup className='no-margins'>
                    <Form.Control
                      type={showConfPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confpassword}
                      onChange={e => setConfPassword(e.target.value)}
                      required
                    />
                      <Button variant="outline-light" onClick={() => setShowConfPassword(!showConfPassword)}>
                        {showConfPassword ? "Hide" : "Show"}
                      </Button>
                      </InputGroup>
                    <Button variant="primary" type="submit">
                      Create Account
                    </Button>
            </Form>
        </Modal.Body>
        <Modal.Footer/>
      </Modal>
    </>
  );
}
