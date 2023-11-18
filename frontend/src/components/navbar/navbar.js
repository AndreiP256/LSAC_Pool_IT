import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';
import nav_logo from '../../assets/navbar/navbar_logo.png';
import Login from '../login/login';
import Register from '../register/register';
import './navbar.css';


export default function NavbarComponent() {
    return (
        <Navbar expand="lg" className="bg-body-white">
            <Container className='nav_container'>
                <NavbarBrand>
                    <img src={nav_logo}
                    class="logo" alt="Responsive image"/>
                </NavbarBrand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className='hamburger'>
                    <Nav className="ms-auto">
                        <Login/>
                        <Register/>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}