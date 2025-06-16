<<<<<<< Updated upstream
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const FormPegawai = () => {
  const [form, setForm] = useState({
    nama: '',
    password: '',
    email: '',
    jabatan: ''
  });

  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('❌ Anda belum login sebagai pegawai.');
      setVariant('danger');
      return;
    }

    const data = new FormData();
    data.append('nama', form.nama);
    data.append('password', form.password);
    data.append('email', form.email);
    data.append('jabatan', form.jabatan);
    // role akan diatur otomatis di backend
    // jika perlu tanda, bisa kirim tipe_akun:
    data.append('tipe_akun', 'pegawai');

    try {
      await axios.post('http://localhost:8000/api/pegawai', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json'
        }
      });

      setMessage('✅ Pegawai berhasil ditambahkan!');
      setVariant('success');
      setForm({
        nama: '',
        password: '',
        email: '',
        jabatan: ''
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || '❌ Gagal menambahkan pegawai.';
      setMessage(errorMsg);
      setVariant('danger');
    }
  };

  return (
    <Container className="my-5">
      <h3 className="mb-4 text-success">Tambah Pegawai</h3>
      {message && <Alert variant={variant}>{message}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Nama</Form.Label>
          <Form.Control
            type="text"
            name="nama"
            value={form.nama}
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
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Jabatan</Form.Label>
          <Form.Control
            type="text"
            name="jabatan"
            value={form.jabatan}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">Simpan</Button>
      </Form>
    </Container>
  );
};

export default FormPegawai;
=======
    import React, { useState } from 'react';
    import axios from 'axios';
    import { Form, Button, Container, Alert } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';

    const FormPegawai = () => {
    const [form, setForm] = useState({
        nama: '',
        password: '',
        email: '',
        role: '',
        jabatan: '',
        tanggalLahir: '',
        // foto_ktp: null
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        // if (name === 'foto_ktp') {
        // setForm({ ...form, foto_ktp: files[0] });
        // } else {
        setForm({ ...form, [name]: value });
        // }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('nama', form.nama);
        data.append('password', form.password);
        data.append('email', form.email);
        data.append('role', form.role);
        data.append('jabatan', form.jabatan);
        data.append('tanggalLahir', form.tanggalLahir);
        // data.append('foto_ktp', form.foto_ktp);
        data.append('tipe_akun', 'pegawai');

        try {
        const token = localStorage.getItem('token');

        await axios.post('http://localhost:8000/api/pegawai', data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
        });

        setMessage('Pegawai berhasil ditambahkan!');
        navigate('/pegawai');
        setForm({
            nama: '',
            // nik: '',
            email: '',
            password: '',
            role: '',
            jabatan: '',
            tanggalLahir: '',
        });
        } catch (err) {
        setMessage(err.response?.data?.message || 'Gagal menambahkan pegawai.');
        }
    };

    return (
        <Container className="my-5">
        <h3 className="mb-4 text-success">Tambah Pegawai</h3>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control type="text" name="nama" value={form.nama} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control type="text" name="role" value={form.role} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Jabatan</Form.Label>
            <Form.Control type="text" name="jabatan" value={form.jabatan} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Tanggal Lahir</Form.Label>
            <Form.Control type="date" name="tanggalLahir" value={form.alamat} onChange={handleChange} required />
            </Form.Group>
            {/* <Form.Group className="mb-4">
            <Form.Label>Foto KTP</Form.Label>
            <Form.Control type="file" name="foto_ktp" onChange={handleChange} required />
            </Form.Group> */}
            <Button type="submit" variant="success">Simpan</Button>
        </Form>
        </Container>
    );
    };

    export default FormPegawai;
>>>>>>> Stashed changes
