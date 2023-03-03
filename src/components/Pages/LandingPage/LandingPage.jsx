import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterPage/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome to habicon');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

 

  return (
    <Container>
      <div className="main_container">

          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <button className="btn btn_sizeSm" onClick={onLogin}>
              Login
            </button>
          </center>
       
      
    
    </div>
    </Container>
  );
}

export default LandingPage;
