// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ show: false, message: '', variant: 'danger' });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:8000/api/multi-login', {
      email: form.email,
      password: form.password
    });

    const id = res.data.user.id;
    // const pegawaiID = res.data.pegawaiID;
    
    const role = res.data.role;               // contoh: "pegawai"
    const user = res.data.user;               // objek user
<<<<<<< Updated upstream
    const jabatan = res.data.jabatan;                // contoh: "admin"
=======
    const jabatan = res.data.jabatan;          // contoh: "admin"
    const nama = res.data.user.name;   
>>>>>>> Stashed changes

    // Simpan ke localStorage
    localStorage.setItem('id', id);
    localStorage.setItem('name', nama);
    // localStorage.setItem('pegawaiID', pegawaiID);
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);       // role model
    localStorage.setItem('tipe_akun', res.data.tipe_akun);
    localStorage.setItem('jabatan', jabatan); // role pegawai

    // Pesan berdasarkan role model (untuk toast)
    const roleMessage = {
      admin: 'Selamat datang Admin!',
      owner: 'Login Owner berhasil!',
      pegawai: 'Halo Pegawai, selamat datang!',
      pembeli: 'Hai Pembeli! Login berhasil!',
      penitip: 'Selamat datang Penitip!',
      organisasi: 'Login Organisasi berhasil!'
    };

    const message = roleMessage[jabatan] || 'Login berhasil!';

    setToast({ show: true, message, variant: 'success' });
    console.log('Role:', role);
    console.log('Jabatan:', jabatan);
    console.log('id', id);


    // Logika redirect
    setTimeout(() => {
<<<<<<< Updated upstream
      if (role === 'organisasi') {
        navigate('/organisasi');
      } else if (jabatan === 'admin') {
        navigate('/admin');
      } else if (jabatan === 'cs') {
        navigate('/cs');
      } else if (jabatan === 'kurir') {
        navigate('/kurir');
      } else if (jabatan === 'gudang') {
        navigate('/gudang');
      } else if (role === 'penitip') {
        navigate('/penitip');
      } else if (jabatan === 'owner') {
        navigate('/owner');
      }else {
=======
      if (jabatan === 'admin') {
          navigate('/admin');
      } else if (jabatan === 'cs') {
          navigate('/cs');
      } else if (jabatan === 'kurir') {
          navigate('/kurir');
      } else if (jabatan === 'gudang') {
          navigate('/gudang');
      } else {
>>>>>>> Stashed changes
        navigate('/');
      }

      window.location.reload();
    }, 1500);


  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Login gagal.';
    setToast({ show: true, message: errorMsg, variant: 'danger' });
  }
};

  return (
    <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
      <Container fluid className="px-3 px-md-4 px-lg-5">
        <div className="mb-4 text-muted fw-semibold">
          <p className="mb-4 text-muted fw-semibold">
            <Link to="/" className="text-secondary text-decoration-none">Home</Link> /{' '}
            <span className="text-dark">Login</span>
          </p>
        </div>
        <Row className="align-items-center gx-4 gy-5 justify-content-between">
          <Col lg={6} className="text-center">
            <img
              src="/login-illustration.png"
              alt="Login Illustration"
              className="img-fluid"
              style={{ maxHeight: '100%', objectFit: 'contain' }}
            />
          </Col>

          <Col lg={6} className="px-lg-5">
            <h3 className="fw-bold text-success mb-2">Welcome Back</h3>
            <p className="text-muted text-uppercase" style={{ fontSize: '0.85rem' }}>Login to continue</p>

            <Form className="mt-4" onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    placeholder="...."
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type="submit" variant="success" className="fw-semibold py-2">LOGIN</Button>
              </div>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  NEW USER?{' '}
                  <Link to="/register" className="text-success fw-semibold">
                    SIGN UP
                  </Link>
                  {' '}
                  <Link to="/forgot" className="text-success fw-semibold">
                    FORGOT PASSWORD
                  </Link>
                </small>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

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
    </div>
  );
};

export default Login;
