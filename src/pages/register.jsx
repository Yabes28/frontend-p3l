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
    nomorHP: '',
<<<<<<< Updated upstream
    tipe_akun: 'pembeli',
=======
    tipe_akun: '',
>>>>>>> Stashed changes
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form.tipe_akun);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form.tipe_akun);
    console.log(form.nomorHP);

    if (form.password.length < 8) {
      setToastMessage('Password minimal 8 karakter');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    if (form.password !== form.password_confirmation) {
      setToastMessage('Password dan konfirmasi tidak cocok');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/multi-register', {
        nama: form.name,
        handle: form.handle,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        nomorHP: form.nomorHP,
        alamat: 'alamat default',
        role: form.tipe_akun,
        tipe_akun: form.tipe_akun,
        kontak: form.nomorHP,
        namaOrganisasi: form.name
      });

      const pesanSukses = {
        pembeli: 'Registrasi Pembeli berhasil!',
        pegawai: 'Pegawai berhasil didaftarkan!',
        penitip: 'Penitip berhasil daftar!',
        organisasi: 'Organisasi berhasil registrasi!',
        user: 'Akun umum berhasil dibuat!',
      };

      const msg = pesanSukses[form.tipe_akun] || 'Registrasi sukses!';
      setToastMessage(msg);
      setToastVariant('success');
      setShowToast(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal registrasi.';
      setToastMessage(errMsg);
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  return (
    <div className="py-5 bg-light">
      <Container>
        <div className="mb-4 text-muted fw-semibold">
          <p>
            <Link to="/" className="text-secondary text-decoration-none">Home</Link> /{' '}
            <span className="text-dark">Register</span>
          </p>
        </div>

        <Row className="align-items-center justify-content-center">
          <Col md={6} className="mb-4 text-center">
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
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="handle"
                    value={form.handle}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="nomorHP"
                    value={form.nomorHP}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Pilih Role</Form.Label>
                  <Form.Select name="tipe_akun" value={form.tipe_akun} onChange={handleChange}>
                    <option value=""></option>
                    <option value="pembeli">Pembeli</option>
                    <option value="organisasi">Organisasi</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="success" type="submit">REGISTER</Button>
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

      {/* TOAST */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toastVariant} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Register;
