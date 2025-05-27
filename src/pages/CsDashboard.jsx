    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Button, Table, Form, Alert, Modal } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const CsDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const [penitip, setPenitip] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({
        nama: '',
        nik: '',
        email: '',
        password: '',
        nomorHP: '',
        alamat: '',
        foto_ktp: null
    });
    const [selectedId, setSelectedId] = useState(null);

    const headers = { Authorization: `Bearer ${token}` };

    const getData = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/penitip', { headers });
        setPenitip(res.data);
        } catch (err) {
        console.error("Gagal ambil data penitip");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus penitip ini?')) return;
        try {
        await axios.delete(`http://localhost:8000/api/penitip/${id}`, { headers });
        setMessage('Penitip berhasil dihapus.');
        getData();
        } catch (err) {
        setMessage('Gagal menghapus penitip.');
        }
    };

    const handleEdit = (item) => {
        setEditData({
        nama: item.nama || '',
        nik: item.nik || '',
        email: item.email || '',
        password: '',
        nomorHP: item.nomorHP || '',
        alamat: item.alamat || '',
        foto_ktp: null
        });
        setSelectedId(item.penitipID);
        setShowModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto_ktp') {
        setEditData({ ...editData, foto_ktp: files[0] });
        } else {
        setEditData({ ...editData, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(editData).forEach(([key, value]) => {
        if (value !== null && value !== '') formData.append(key, value);
        });

        try {
        await axios.post(`http://localhost:8000/api/penitip/${selectedId}?_method=PUT`, formData, {
            headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Penitip berhasil diperbarui.');
        setShowModal(false);
        getData();
        } catch (err) {
        setMessage(err.response?.data?.message || 'Gagal mengedit penitip.');
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
        <div className="bg-light" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-0">
            <Row className="g-0">
            {/* Sidebar */}
            <Col md={2} className="bg-white border-end p-3 shadow-sm">
                <h5 className="fw-bold text-success mb-4">Menu</h5>
                <ul className="list-unstyled">
                <li className="mb-2">
                    <Button
                    variant="link"
                    className="text-start w-100 text-decoration-none fw-semibold text-dark"
                    onClick={() => navigate('/tambah-penitip')}
                    >
                    ➕ Tambah Penitip
                    </Button>
                </li>
                {/* Tambah menu lain jika diperlukan */}
                </ul>
            </Col>

            {/* Main Content */}
            <Col md={10} className="p-4">
                <h3 className="fw-bold text-success">Customer Service Dashboard</h3>
                <p className="text-muted">Selamat datang, <strong>{user?.name}</strong>!</p>

                <div className="bg-white p-4 rounded shadow-sm border">
                <h5 className="fw-bold mb-3">Data Penitip</h5>
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
                        <th>NIK</th>
                        <th>Email</th>
                        <th>Nomor HP</th>
                        <th>Alamat</th>
                        <th>Foto KTP</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((item, index) => (
                        <tr key={item.penitipID}>
                        <td>{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.nik}</td>
                        <td>{item.email}</td>
                        <td>{item.nomorHP}</td>
                        <td>{item.alamat}</td>
                        <td>
                            <img src={`http://localhost:8000/${item.foto_ktp}`} alt="KTP" width="70" />
                        </td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.penitipID)}>Hapus</Button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>
            </Col>
            </Row>

            {/* Modal Edit */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Penitip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <Form.Group className="mb-2">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control name="nama" value={editData.nama} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>NIK</Form.Label>
                    <Form.Control name="nik" value={editData.nik} onChange={handleEditChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={editData.email} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={editData.password} onChange={handleEditChange} placeholder="Kosongkan jika tidak diubah" />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Nomor HP</Form.Label>
                    <Form.Control name="nomorHP" value={editData.nomorHP} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control name="alamat" value={editData.alamat} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Foto KTP</Form.Label>
                    <Form.Control type="file" name="foto_ktp" onChange={handleEditChange} accept="image/*" />
                </Form.Group>
                <Button type="submit" variant="success">Simpan Perubahan</Button>
                </Form>
            </Modal.Body>
            </Modal>
        </Container>
        </div>
    );
    };

    export default CsDashboard;
