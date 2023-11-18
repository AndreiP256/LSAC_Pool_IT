import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';
import nav_logo from '../../assets/navbar/navbar_logo.png';
import Login from '../login/login';
import Register from '../register/register';
import './navbar.css';
import CreatePool from '../create-pool/create_pool';


export default function NavbarComponent() {
    return (
        <Navbar expand="lg" className="bg-body-white">
                <NavbarBrand>
                    <img src={nav_logo}
                    class="logo" alt="Responsive image"/>
                </NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className='hamburger'>
                    <Nav className="ms-auto">
                        <CreatePool></CreatePool>
                        <Login/>
                        <Register/>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>
    )
}