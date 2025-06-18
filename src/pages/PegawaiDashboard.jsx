import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Button, Table, Form, Alert } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const PegawaiDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const [penitip, setPenitip] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    const getData = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/pegawai', {
            headers: { Authorization: 'Bearer ${token}' }
        });
        setPenitip(res.data);
        } catch (err) {
        console.error("Gagal ambil data pegawai");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus pegawai ini?')) return;

        try {
        await axios.delete('http://localhost:8000/api/pegawai/${id}', {
            headers: { Authorization: 'Bearer ${token}' }
        });
        setMessage('Pegawai berhasil dihapus.');
        getData();
        } catch (err) {
        setMessage('Gagal menghapus pegawai.');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const filtered = penitip.filter(p =>
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
        <Container className="px-4 px-md-5">
            <Row className="align-items-center justify-content-between mb-4">
            <Col>
                <h3 className="fw-bold text-success">Pegawai Dashboard</h3>
                <p className="text-muted">Selamat datang, <strong>{user?.name}</strong>!</p>
            </Col>
            <Col className="text-end">
                <Button
                variant="success"
                className="fw-semibold"
                onClick={() => navigate('/tambah-pegawai')}
                >
                + Tambah Pegawai
                </Button>
            </Col>
            </Row>

            <Row>
            <Col>
                <div className="bg-white p-4 rounded shadow-sm border">
                <h5 className="fw-bold mb-3">Data Pegawai</h5>

                {message && <Alert variant="info">{message}</Alert>}

                <Form.Control
                    type="text"
                    placeholder="Cari nama/email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-3"
                />

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Jabatan</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((item, index) => (
                        <tr key={item.penitipID}>
                        <td>{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td>{item.jabatan}</td>
                        {/* <td>
                            <img src={http://localhost:8000/${item.foto_ktp}} alt="KTP" width="70" />
                        </td> */}
                        <td>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.pegawaiID)}>Hapus</Button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>
            </Col>
            </Row>
        </Container>
        </div>
    );
    };

    export default PegawaiDashboard;