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
    <Navbar  expand="lg" className="nav_big">
      <Container className="nav_container">
      <Navbar.Brand href="#home" className="brand_name">Habicon</Navbar.Brand>
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
            
                    <LogOutButton />


          </>
        )}
        {/* <Link className="nav_link" to="/about">
          About
        </Link> */}
      </div>
      </Container>
    </Navbar>
  );
}

export default Nav1;