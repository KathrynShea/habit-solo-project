import React from "react";
import LoginForm from "./LoginForm";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function LoginPage() {
  const history = useHistory();

  return (
    <Container>
      <Row>
        <Col>
          <div className="main_container">
            <LoginForm />

            <center>
              <Button
                type="button"
                className="btn btn_asLink"
                variant="light"
                onClick={() => {
                  history.push("/registration");
                }}
              >
                Register
              </Button>
            </center>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
