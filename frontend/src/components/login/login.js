import { useState, useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../../AuthContext';
import './login.css';

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Sending login request');
    try {
      const response = await axios.post('http://localhost:5000/login', { "email":email, "password":password });
      console.log('Received response:', response);
      if (response) {
        setErrorMessage('');
        const token = response.data.token;
        const user_id = response.data.user_id;
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id);
        setShowLoginSuccess(true);
        setTimeout(() => {setShowLoginSuccess(false); setIsLoggedIn(true);}, 2000);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred while logging in");
      }
    }
  };

//TODO: MAKE ALERT WORK TY:)

  return (
    <>
      <Nav.Link onClick={handleShow} className='nav-link'>Login</Nav.Link>
      <Modal show={show} onHide={handleClose} size='m' centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {showLoginSuccess && <Alert variant="success">Logged in successfully!</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer/>
      </Modal>
    </>
  );
}