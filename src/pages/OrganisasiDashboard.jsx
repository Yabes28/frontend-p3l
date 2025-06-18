    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Button, Table, Form, Alert } from 'react-bootstrap';
    import axios from 'axios';

    const OrganisasiDashboard = () => {
    const token = localStorage.getItem('token');
    const [data, setData] = useState([]);
    const [form, setForm] = useState({ namaReqDonasi: '', kategoriReqDonasi: '' });
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getData = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/request-donasi', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        } catch (err) {
        console.error("Gagal ambil data:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (item) => {
        setEditingId(item.idReqDonasi);
        setForm({
        namaReqDonasi: item.namaReqDonasi,
        kategoriReqDonasi: item.kategoriReqDonasi
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ namaReqDonasi: '', kategoriReqDonasi: '' });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
        await axios.put(`http://localhost:8000/api/request-donasi/${editingId}`, form, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('✅ Data berhasil diperbarui');
        setEditingId(null);
        setForm({ namaReqDonasi: '', kategoriReqDonasi: '' });
        getData();
        } catch (err) {
        setMessage('❌ Gagal memperbarui data');
        }
    };

    const handleSubmit = editingId ? handleUpdate : async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:8000/api/request-donasi', form, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('✅ Request donasi berhasil ditambahkan');
        setForm({ namaReqDonasi: '', kategoriReqDonasi: '' });
        getData();
        } catch (err) {
        console.error("Error saat mengirim request:", err);
        setMessage('❌ Gagal menambahkan data');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus data ini?')) {
        try {
            await axios.delete(`http://localhost:8000/api/request-donasi/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('🗑️ Data berhasil dihapus');
            getData();
        } catch (err) {
            setMessage('❌ Gagal menghapus data');
        }
        }
    };

    useEffect(() => {
        if (message) {
        const timer = setTimeout(() => setMessage(''), 4000);
        return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <Container className="py-5">
        <h3 className="text-success fw-bold mb-4">Dashboard Organisasi</h3>

        {message && (
            <Alert variant={message.includes('berhasil') ? 'success' : 'danger'}>
            {message}
            </Alert>
        )}

        <Form onSubmit={handleSubmit} className="mb-4">
            <Row>
            <Col md={5}>
                <Form.Control
                name="namaReqDonasi"
                placeholder="Nama Permintaan"
                value={form.namaReqDonasi}
                onChange={handleChange}
                required
                />
            </Col>
            <Col md={5}>
                <Form.Control
                name="kategoriReqDonasi"
                placeholder="Kategori (makanan/pakaian/lainnya)"
                value={form.kategoriReqDonasi}
                onChange={handleChange}
                required
                />
            </Col>
            <Col md={2}>
                <Button type="submit" variant="success" className="w-100">
                {editingId ? 'Update' : 'Tambah'}
                </Button>
                {editingId && (
                <Button variant="secondary" className="w-100 mt-2" onClick={handleCancelEdit}>
                    Batal Edit
                </Button>
                )}
            </Col>
            </Row>
        </Form>

        <Form.Control
            type="text"
            placeholder="Cari berdasarkan nama atau kategori..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />

        <Table bordered hover>
            <thead>
            <tr>
                <th>No</th>
                <th>Nama Request</th>
                <th>Kategori</th>
                <th>Aksi</th>
            </tr>
            </thead>
            <tbody>
            {data
                .filter(item =>
                item.namaReqDonasi.toLowerCase().includes(searchTerm) ||
                item.kategoriReqDonasi.toLowerCase().includes(searchTerm)
                )
                .map((item, index) => (
                <tr key={item.idReqDonasi}>
                    <td>{index + 1}</td>
                    <td>{item.namaReqDonasi}</td>
                    <td>{item.kategoriReqDonasi}</td>
                    <td>
                    <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(item.idReqDonasi)}>Hapus</Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
        </Container>
    );
    };

    export default OrganisasiDashboard;
