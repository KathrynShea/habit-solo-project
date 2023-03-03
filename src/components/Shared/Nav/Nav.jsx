import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import { useSelector } from "react-redux";
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

  const [navColor, setNavColor] = useState("oneNav");
  const handleClick = () => {
    console.log("clicked!");
    let randomNum = Math.floor(Math.random() * 15);
    switch (randomNum) {
      case 0:
        setNavColor("oneNav");
        break;
      case 1:
        setNavColor("twoNav");
        break;
      case 2:
        setNavColor("threeNav");
        break;
      case 3:
        setNavColor("fourNav");
        break;
      case 4:
        setNavColor("fiveNav");
        break;
      case 5:
        setNavColor("sixNav");
        break;
      case 6:
        setNavColor("sevenNav");
        break;
      case 7:
        setNavColor("eightNav");
        break;
      case 8:
        setNavColor("nineNav");
        break;
      case 9:
        setNavColor("tenNav");
        break;
      case 10:
        setNavColor("elevenNav");
        break;
      case 11:
        setNavColor("twelveNav");
        break;
      case 12:
        setNavColor("thirteenNav");
        break;
      case 13:
        setNavColor("fourteenNav");
        break;
      case 14:
        setNavColor("fifteenNav");
        break;
      case 15:
        setNavColor("sixteenNav");
        break;
    }
  };

  return (
    <Navbar
      expand="lg"
      className={`nav_big ${navColor}`}
      onClick={() => handleClick()}
    >
      <Container className="nav_container">
        <Navbar.Brand href="#home" className="brand_name">
          habicon
        </Navbar.Brand>
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
