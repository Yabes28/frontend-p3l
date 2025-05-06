// src/pages/Register.jsx
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Register = () => {
  return (
    <div className="py-5 bg-light">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col md={6} className="mb-4 mb-md-0 text-center">
            <img
              src="/login-illustration.png"
              alt="Register Illustration"
              className="img-fluid"
              style={{ maxWidth: '85%' }}
            />
          </Col>
          <Col md={6}>
            <div className="p-4 bg-white rounded shadow-sm">
              <h3 className="fw-bold text-success mb-2">Register</h3>
              <p className="text-muted mb-4">JOIN TO US</p>
              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Your name</Form.Label>
                  <Form.Control type="text" placeholder="Jhon Deo" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Example@gmail.com" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••" />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••" />
                </Form.Group>
                <div className="d-grid">
                  <Button variant="success" type="submit">
                    REGISTER
                  </Button>
                </div>
              </Form>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  ALREADY USER ?{' '}
                  <Link to="/login" className="text-success fw-semibold">
                    LOGIN
                  </Link>
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
