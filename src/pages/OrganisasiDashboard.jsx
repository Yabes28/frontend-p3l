    import React, { useEffect, useState } from 'react';
<<<<<<< Updated upstream
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
=======
    import { Container, Row, Col, Button, Table, Form, Alert, Modal } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const OrganisasiDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const [penitip, setPenitip] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ nama: '', nik: '', email: '', password: '', nomorHP: '', alamat: '' });
    const [selectedId, setSelectedId] = useState(null);

    const getData = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/organisasi', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPenitip(res.data);
        } catch (err) {
        console.error("Gagal ambil data organisasi");
>>>>>>> Stashed changes
        }
    };

    const handleDelete = async (id) => {
<<<<<<< Updated upstream
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
=======
        if (!window.confirm('Yakin ingin menghapus organisasi ini?')) return;

        try {
        await axios.delete(`http://localhost:8000/api/organisasi/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('organisasi berhasil dihapus.');
        getData();
        } catch (err) {
        setMessage('Gagal menghapus organisasi.');
        }
    };

    const handleEdit = (item) => {
        setEditData({
        namaOrganisasi: item.namaOrganisasi || '',
        email: item.email || '',
        kontak: item.kontak || '',
        alamat: item.alamat || '',
        // foto_ktp: null
        });
        setSelectedId(item.organisasiID);
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
            await axios.post(`http://localhost:8000/api/organisasi/${selectedId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
            });
            setMessage('Organisasi berhasil diperbarui.');
            setShowModal(false);
            getData();
        } catch (err) {
            console.error('Error saat update:', err.response);
            setMessage(err.response?.data?.message || 'Gagal mengedit organisasi.');
        }
    };
>>>>>>> Stashed changes

    useEffect(() => {
        getData();
    }, []);

<<<<<<< Updated upstream
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
=======
    const filtered = penitip.filter(p =>
        p.namaOrganisasi.toLowerCase().includes(search.toLowerCase()) 
        ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
        <Container className="px-4 px-md-5">
            <Row className="align-items-center justify-content-between mb-4">
            <Col>
                <h3 className="fw-bold text-success">Organisasi Dashboard</h3>
                <p className="text-muted">Selamat datang, <strong>{user?.name}</strong>!</p>
            </Col>
            <Col className="text-end">
            </Col>
            </Row>

            <Row>
            <Col>
                <div className="bg-white p-4 rounded shadow-sm border">
                <h5 className="fw-bold mb-3">Data organisasi</h5>

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
                        <th>kontak</th>
                        <th>alamat</th>
                        {/* <th>password</th> */}
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((item, index) => (
                        <tr key={item.organisasiID || index}>
                        <td>{index + 1}</td>
                        <td>{item.namaOrganisasi}</td>
                        <td>{item.email}</td>
                        <td>{item.kontak}</td>
                        <td>{item.alamat}</td>
                        {/* <td>{item.role}</td> */}
                        {/* <td>
                            <img src={`http://localhost:8000/${item.foto_ktp}`} alt="KTP" width="70" />
                        </td> */}
                        <td>
                            <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                            <Button size="sm" variant="danger" onClick={() => handleDelete(item.organisasiID)}>Hapus</Button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>
            </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Organisasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEditSubmit} encType="multipart/form-data">
                <Form.Group className="mb-2">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control name="namaOrganisasi" value={editData.namaOrganisasi} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={editData.email} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Kontak</Form.Label>
                    <Form.Control name="kontak" value={editData.kontak} onChange={handleEditChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Alamat</Form.Label>
                    <Form.Control name="alamat" value={editData.alamat} onChange={handleEditChange} required />
                </Form.Group>
                <Button type="submit" variant="success">Simpan Perubahan</Button>
                </Form>
            </Modal.Body>
            </Modal>
        </Container>
        </div>
>>>>>>> Stashed changes
    );
    };

    export default OrganisasiDashboard;
