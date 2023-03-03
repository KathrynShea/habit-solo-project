import React from "react";

import { useHistory } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function RegisterPage() {
  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col>
          <div className="main_container">
            <div>
              <RegisterForm />

              <center>
                <Button
                  type="button"
                  className="btn btn_asLink"
                  variant="light"
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  Login
                </Button>
              </center>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
