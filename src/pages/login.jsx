// src/pages/Login.jsx
import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  return (
    <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
      <Container fluid className="px-5 px-xl-6">
        <div className="mb-4 text-muted fw-semibold">
          <span className="text-secondary">Home</span> / <span className="text-secondary">pages</span> / <span className="text-dark">login</span>
        </div>
        <Row className="align-items-center gx-5 gy-5 flex-lg-nowrap justify-content-between">
          <Col lg={6} className="text-center">
            <img
              src="/login-illustration.png"
              alt="Login Illustration"
              className="img-fluid"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
            />
          </Col>

          <Col lg={6} className="px-lg-5">
            <h3 className="fw-bold text-success mb-2">Welcome Back</h3>
            <p className="text-muted text-uppercase" style={{ fontSize: '0.85rem' }}>Login to continue</p>

            <Form className="mt-4">
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Example@gmail.com" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control type="password" placeholder="...." required />
                  <InputGroup.Text><FaEyeSlash /></InputGroup.Text>
                </InputGroup>
                <div className="mt-1 text-end">
                  <a href="#" className="text-muted" style={{ fontSize: '0.85rem' }}>Forget Password ?</a>
                </div>
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type="submit" variant="success" className="fw-semibold py-2">LOGIN</Button>
              </div>
              <div className="mt-3 text-center">
                <span className="text-muted">NEW USER ? </span>
                <a href="#" className="text-success fw-semibold">SIGN UP</a>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
