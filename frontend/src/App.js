import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import { useEffect } from 'react';

import NavbarComponent from './components/navbar/navbar';
import Home from './pages/home/home';
import Error404 from "./pages/error404/error404";
import FooterComponent from "./components/footer/footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (token) {
      setIsLoggedIn(true);
      setUserId(userId);
    }
  }, []);

  return (
      <>
       <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <NavbarComponent/>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<Error404/>}/>
          </Routes>
        </Router>
        <FooterComponent/>
        </AuthContext.Provider>
      </>
      
  );
}

export default App;
