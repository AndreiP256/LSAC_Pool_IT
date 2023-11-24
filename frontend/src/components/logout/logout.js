import React, { useContext, useState } from 'react';
import { AuthContext } from '../../AuthContext';
import { Alert } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';

export default function Logout() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);
    setShowLogoutSuccess(true);
    setTimeout(() => setShowLogoutSuccess(false), 5000);
  };

  return (
    <>
        <Nav.Link onClick={handleLogout} className='nav-link'>Logout</Nav.Link>
        {showLogoutSuccess && <Alert variant="success">Logged out successfully!</Alert>}
    </>
  );
}
