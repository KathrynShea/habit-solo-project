import React from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import Dropdown from 'react-bootstrap/Dropdown';



import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Button from 'react-bootstrap/Button';


function Nav1() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  const user = useSelector((store) => store.user);

  return (
    <>

<Button>Click Me!</Button>

    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Habicon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
           <Nav className="me-auto">
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item>Action</NavDropdown.Item>
              </NavDropdown>
           </Nav>
        </Navbar.Collapse>
      </Container>

    </Navbar>


    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Prime Solo Project</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            {/* <Link className="navLink" to="/user">
              Overview
            </Link>

            <Link className="navLink" to="/paused">
              Paused
            </Link>
            <Link className="navLink" to="/awards">
              Awards
            </Link> */}

          
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              <FontAwesomeIcon icon="fa-solid fa-bars" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                  <Dropdown.Item href="/user"><Link to="/user">
              Overview
            </Link></Dropdown.Item>
                  <Dropdown.Item href="/paused"><Link to="/paused">
              Paused
            </Link></Dropdown.Item>
                  <Dropdown.Item href="/awards"><Link to="/awards">
              Awards
            </Link> </Dropdown.Item>
                  <Dropdown.Item><LogOutButton /></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        )}

        {/* <Link className="navLink" to="/about">
          About
        </Link> */}
      </div>
    </div>
    </>
  );
}

export default Nav1;
