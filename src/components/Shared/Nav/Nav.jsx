import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function Nav1() {
  //allows us to use the imported fontawesome icons
  library.add(fas, far);
  const user = useSelector((store) => store.user);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
      <Navbar.Brand href="#home">Habicon</Navbar.Brand>
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
            <NavDropdown title="dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/user">
                    <Link to="/user" className="nav_link">
                      Overview
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/paused">
                    <Link to="/paused" className="nav_link">
                      Paused
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/awards">
                    <Link to="/awards" className="nav_link">
                      Awards
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <LogOutButton />
                  </NavDropdown.Item>
                </NavDropdown>

          </>
        )}
        <Link className="nav_link" to="/about">
          About
        </Link>
      </div>
      </Container>
    </Navbar>
  );
}

export default Nav1;