    import React, { useState } from 'react';
    import axios from 'axios';
    import { Form, Button, Container, Alert } from 'react-bootstrap';

    const FormPenitip = () => {
    const [form, setForm] = useState({
        nama: '',
        nik: '',
        email: '',
        password: '',
        nomorHP: '',
        alamat: '',
        foto_ktp: null
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto_ktp') {
        setForm({ ...form, foto_ktp: files[0] });
        } else {
        setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('nama', form.nama);
        data.append('nik', form.nik);
        data.append('email', form.email);
        data.append('password', form.password);
        data.append('nomorHP', form.nomorHP);
        data.append('alamat', form.alamat);
        data.append('foto_ktp', form.foto_ktp);
        data.append('tipe_akun', 'penitip');

        try {
        const token = localStorage.getItem('token');

        await axios.post('http://localhost:8000/api/penitip', data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
        });

        setMessage('Penitip berhasil ditambahkan!');
        setForm({
            nama: '',
            nik: '',
            email: '',
            password: '',
            nomorHP: '',
            alamat: '',
            foto_ktp: null
        });
        } catch (err) {
        setMessage(err.response?.data?.message || 'Gagal menambahkan penitip.');
        }
    };

    return (
        
        <Container className="my-5">
        <h3 className="mb-4 text-success">Tambah Penitip</h3>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control type="text" name="nama" value={form.nama} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>NIK</Form.Label>
            <Form.Control type="text" name="nik" value={form.nik} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Nomor HP</Form.Label>
            <Form.Control type="text" name="nomorHP" value={form.nomorHP} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Alamat</Form.Label>
            <Form.Control type="text" name="alamat" value={form.alamat} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-4">
            <Form.Label>Foto KTP</Form.Label>
            <Form.Control type="file" name="foto_ktp" onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="success">Simpan</Button>
        </Form>
        </Container>
    );
    };

    export default FormPenitip;
