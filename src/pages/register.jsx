// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    handle: '',
    email: '',
    password: '',
    password_confirmation: '',
    no_telp: '',
  });
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi minimal 8 karakter password
    if (form.password.length < 8) {
      setToastMessage('Password harus minimal 8 karakter.');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (form.password !== form.password_confirmation) {
      setToastMessage('Password dan Konfirmasi Password tidak sama.');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        name: form.name,
        handle: form.handle,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        no_telp: form.no_telp,
      });
      

      setToastMessage(response.data.message || 'Register sukses');
      setToastVariant('success');
      setShowToast(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal register';
      setToastMessage(errMsg);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  return (
    <div className="py-5 bg-light position-relative">
      <Container>
      <div className="mb-4 text-muted fw-semibold">
          <p className="mb-4 text-muted fw-semibold">
            <Link to="/" className="text-secondary text-decoration-none">Home</Link> /{' '}
              <span className="text-dark">Register</span>
          </p>
        </div>
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

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label> name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formHandle">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="handle"
                    placeholder="Username"
                    value={form.handle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="no_telp"
                    placeholder="+62..."
                    value={form.no_telp}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="email@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder="••••••"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="success" type="submit">
                    REGISTER
                  </Button>
                </div>
              </Form>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  ALREADY USER?{' '}
                  <Link to="/login" className="text-success fw-semibold">
                    LOGIN
                  </Link>
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Toast Feedback */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Register;
