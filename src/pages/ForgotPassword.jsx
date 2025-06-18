import React, { useState } from 'react';
import { Form, Button, Container, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/forgot-password', { email });
      setToast({
        show: true,
        message: response.data.message,
        variant: 'success',
      });
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message,
        variant: 'danger',
      });
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-success">Lupa Password</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Masukkan email yang terdaftar"
          />
        </Form.Group>
        <Button variant="success" type="submit" className="w-100">
          Kirim Link Reset
        </Button>
      </Form>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ForgotPassword;