<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Button, Table, Form, Alert } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
=======
    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Button, Table, Form, Alert, Modal } from 'react-bootstrap';
    import { useNavigate, Link } from 'react-router-dom';
>>>>>>> Stashed changes
    import axios from 'axios';

    const PegawaiDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const [penitip, setPenitip] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
<<<<<<< Updated upstream
=======
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ nama: '', nik: '', email: '', password: '', nomorHP: '', alamat: '', foto_ktp: null });
    const [selectedId, setSelectedId] = useState(null);
>>>>>>> Stashed changes

    const getData = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/pegawai', {
<<<<<<< Updated upstream
            headers: { Authorization: 'Bearer ${token}' }
=======
            headers: { Authorization: `Bearer ${token}` }
>>>>>>> Stashed changes
        });
        setPenitip(res.data);
        } catch (err) {
        console.error("Gagal ambil data pegawai");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus pegawai ini?')) return;

        try {
<<<<<<< Updated upstream
        await axios.delete('http://localhost:8000/api/pegawai/${id}', {
            headers: { Authorization: 'Bearer ${token}' }
=======
        await axios.delete(`http://localhost:8000/api/pegawai/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
>>>>>>> Stashed changes
        });
        setMessage('Pegawai berhasil dihapus.');
        getData();
        } catch (err) {
        setMessage('Gagal menghapus pegawai.');
        }
    };

<<<<<<< Updated upstream
=======
    const handleResetPassword = async (id) => {
        if (!window.confirm('Yakin ingin reset password pegawai ini?')) return;

        try {
        await axios.post(`http://localhost:8000/api/pegawai/${id}/reset-password`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Berhasil reset password pegawai.');
        getData();
        } catch (err) {
        setMessage('Gagal mereset password pegawai.');
        }
    };

    const handleEdit = (item) => {
        setEditData({
        nama: item.nama || '',
        email: item.email || '',
        jabatan: item.jabatan || '',
        tanggalLahir: item.tanggalLahir || '',
        });
        setSelectedId(item.pegawaiID);
        setShowModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        // if (name === 'foto_ktp') {
        // setEditData({ ...editData, foto_ktp: files[0] });
        // } else {
        setEditData({ ...editData, [name]: value });
        // }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.entries(editData).forEach(([key, value]) => {
            if (value !== '') formData.append(key, value);
        });

        try {
            await axios.post(`http://localhost:8000/api/pegawai/${selectedId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
            });
            setMessage('Pegawai berhasil diperbarui.');
            setShowModal(false);
            getData();
        } catch (err) {
            console.error('Error saat update:', err.response);
            setMessage(err.response?.data?.message || 'Gagal mengedit pegawai.');
        }
    };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                        <tr key={item.penitipID}>
=======
                        <tr key={item.penitipID || index}>
>>>>>>> Stashed changes
                        <td>{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td>{item.jabatan}</td>
                        {/* <td>
<<<<<<< Updated upstream
                            <img src={http://localhost:8000/${item.foto_ktp}} alt="KTP" width="70" />
                        </td> */}
                        <td>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.pegawaiID)}>Hapus</Button>
=======
                            <img src={`http://localhost:8000/${item.foto_ktp}`} alt="KTP" width="70" />
                        </td> */}
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.pegawaiID)}>Hapus</Button>
                            <Button variant="info" size="sm" onClick={() => handleResetPassword(item.pegawaiID)}>Reset Password</Button>
>>>>>>> Stashed changes
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>
            </Col>
            </Row>
<<<<<<< Updated upstream
=======

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Pegawai</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control
                    name="nama"
                    value={editData.nama}
                    onChange={handleEditChange}
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Jabatan</Form.Label>
                    <Form.Control
                    name="jabatan"
                    value={editData.jabatan}
                    onChange={handleEditChange}
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Tanggal Lahir</Form.Label>
                    <Form.Control
                    type="date"
                    name="tanggalLahir"
                    value={editData.tanggalLahir}
                    onChange={handleEditChange}
                    required
                    />
                </Form.Group>
                <Button type="submit" variant="success">Simpan Perubahan</Button>
                </Form>
            </Modal.Body>
            </Modal>
>>>>>>> Stashed changes
        </Container>
        </div>
    );
    };

<<<<<<< Updated upstream
    export default PegawaiDashboard;
=======
    export default PegawaiDashboard;
>>>>>>> Stashed changes
