import React from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function Nav1() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);

  const user = useSelector((store) => store.user);

  return (
    <>
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Habicon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link href="#home">Overview</Nav.Link>
            <Nav.Link href="#link">paused</Nav.Link> */}
            <NavDropdown title="dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/user" >Overview</NavDropdown.Item>
              <NavDropdown.Item href="/paused">
                Paused Habits
              </NavDropdown.Item>
              <NavDropdown.Item href="/awards">Awards</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="nav">
      
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
