import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavbarComponent from './components/navbar/navbar';
import Home from './pages/home';
import Error404 from "./pages/page_not_found";
import FooterComponent from "./components/footer/footer";

function App() {
  return (
      <>
        <NavbarComponent/>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<Error404/>}/>
          </Routes>
        </Router>
        <FooterComponent/>
      </>
  );
}

export default App;
