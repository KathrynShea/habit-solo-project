import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Nav1 from "./Shared/Nav/Nav";
import Footer from "./Shared/Footer/Footer";

import ProtectedRoute from "./Shared/ProtectedRoute/ProtectedRoute";

import AboutPage from "./Pages/AboutPage/AboutPage";
import UserPage from "./Pages/UserPage/UserPage";
import InfoPage from "./Pages/InfoPage/InfoPage";
import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import Form from "./Pages/Form";
import Edit from "./Pages/Edit";
import PausedHabits from "./Pages/PausedHabits";
import HabitAwards from "./Pages/HabitAwards";
//import UserPagenew from "./Pages/UserPage/UserPagenew"
import { useState } from "react";

import "./App.css";
import moment from "moment";


function App() {
  var moment = require("moment");
  const dispatch = useDispatch();

  const [bodyColor, setBodyColor] = useState("oneBody");

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  const handleClick = () => {

    let randomNum = Math.floor(Math.random() * 15);
    switch (randomNum) {
      case 0:
        setBodyColor("oneBody");
        break;
      case 1:
        setBodyColor("twoNav");
        break;
      case 2:
        setBodyColor("threeNav");
        break;
      case 3:
        setBodyColor("fourNav");
        break;
      case 4:
        setBodyColor("fiveNav");
        break;
      case 5:
        setBodyColor("sixNav");
        break;
      case 6:
        setBodyColor("sevenNav");
        break;
      case 7:
        setBodyColor("eightNav");
        break;
      case 8:
        setBodyColor("nineNav");
        break;
      case 9:
        setBodyColor("tenNav");
        break;
      case 10:
        setBodyColor("elevenNav");
        break;
      case 11:
        setBodyColor("twelveNav");
        break;
      case 12:
        setBodyColor("thirteenNav");
        break;
      case 13:
        setBodyColor("fourteenNav");
        break;
      case 14:
        setBodyColor("fifteenNav");
        break;
      case 15:
        setBodyColor("sixteenNav");
        break;
    }
  }

  return (
    <Router>
      <div className={`all`} onClick={() => handleClick()}>
        <Nav1 />
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:3000/about will show the about page. */}
          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/about"
          >
            <AboutPage />
          </Route>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/user"
          >
            <UserPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows InfoPage else shows LoginPage
            exact
            path="/info"
          >
            <InfoPage />
          </ProtectedRoute>

          <Route exact path="/login">
            {user.id ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the login page
              <LoginPage />
            )}
          </Route>

          <Route exact path="/registration">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the registration page
              <RegisterPage />
            )}
          </Route>

          <Route exact path="/home">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the Landing page
              <LandingPage />
            )}
          </Route>
          <Route path="/form">
            <Form />
          </Route>
          <Route path="/edit/:id">
            <Edit />
          </Route>
          <Route path="/paused">
            <PausedHabits />
          </Route>
          <Route path="/awards">
            <HabitAwards />
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
