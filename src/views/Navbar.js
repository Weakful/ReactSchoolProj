import React from 'react';
import '../styles.css'

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {Home} from "./Home";
import { Link } from "react-router-dom";

export function GameNavbar() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link to={"/"} class="nav-link">Főoldal</Link>
                <Nav.Link href="http://www.ketaklub.hu/letoltes/Stratego%20Aoriginal%20Piatnik.pdf" target="_blank">Játékszabály</Nav.Link>
                <NavDropdown title="Játék indítása" id="basic-nav-dropdown">
                    <Link to={"/waiting"} class="dropdown-item">Új játék</Link>
                    <NavDropdown.Divider />
                        <Link to={"/joining"} class="dropdown-item">Csatlakozás szobához</Link>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}