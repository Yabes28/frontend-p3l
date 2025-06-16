    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Card, Button, ListGroup, Spinner, Toast, ToastContainer, Form } from 'react-bootstrap';
    import { FaArrowRight, FaTimes } from 'react-icons/fa';
    import { Link, useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const MyAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:8000/api/alamat', {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            console.log('Alamat dari API:', res.data);
            setAddresses(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Gagal ambil alamat:", err);
            setLoading(false);
        });
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("Yakin hapus alamat ini?")) return;

        axios.delete(`http://localhost:8000/api/alamat/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
        setAddresses(prev => prev.filter(a => a.alamatID !== id));
        setToastMessage("Alamat berhasil dihapus.");
        setShowToast(true);
        }).catch(err => {
        alert("Gagal hapus: " + (err.response?.data?.message || "Server error"));
        });
    };

    if (loading) {
        return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p>Loading alamat...</p>
        </div>
        );
    }

    return (
        <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4 px-md-5">
            <div className="mb-4 text-muted fw-semibold">
            <span className="text-secondary">Home</span> / <span className="text-dark">My Address</span>
            </div>

            <Row className="gx-4 gy-4">
            <Col md={4} lg={3}>
                <Card className="shadow-sm">
                <Card.Body className="text-center">
                    <img src="/avatar-placeholder.png" alt="avatar" className="rounded-circle mb-3" style={{ width: '100px', height: '100px' }} />
                    <h6 className="fw-bold mb-1">User</h6>
                    <p className="text-muted mb-2">Total Point</p>
                    <h5 className="text-success fw-bold">500</h5>
                </Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item as={Link} to="/profile">Account Info <FaArrowRight /></ListGroup.Item>
                    <ListGroup.Item>History <FaArrowRight /></ListGroup.Item>
                    <ListGroup.Item active>My Address <FaArrowRight /></ListGroup.Item>
                    <ListGroup.Item>Change Password <FaArrowRight /></ListGroup.Item>
                </ListGroup>
                </Card>
            </Col>

            <Col md={8} lg={9}>
                <Card className="shadow-sm">
                <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
                    My Address
                    <Link to="/AddAddres"><Button variant="success" size="sm">+ Tambah Alamat</Button></Link>
                </Card.Header>
                <Card.Body>
                    <Form className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Cari berdasarkan nama alamat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </Form>

                    {addresses.filter(addr =>
                    addr.namaAlamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    addr.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 ? (
                    <p className="text-muted">Anda belom menambahkan alamat</p>
                    ) : (
                    addresses
                        .filter(addr =>
                        addr.namaAlamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        addr.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(addr => (
                        <Card key={addr.alamatID} className="mb-3 border shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 className="fw-bold text-primary">{addr.namaAlamat}</h6>
                                <p className="mb-1"><strong>Penerima:</strong> {addr.namaPenerima}</p>
                                <p className="mb-1"><strong>Nomor HP:</strong> {addr.noHpPenerima}</p>
                                <p className="mb-1"><strong>Alamat:</strong> {addr.alamat}</p>
                                <p className="mb-2"><strong>Kode Pos:</strong> {addr.kodePos}</p>
                                <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate(`/EditAddres/${addr.alamatID}`)}
                                >
                                Ubah
                                </Button>
                            </div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(addr.alamatID)}
                            >
                                <FaTimes />
                            </Button>
                            </Card.Body>
                        </Card>
                        ))
                    )}
                </Card.Body>
                </Card>
            </Col>
            </Row>
        </Container>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast
            bg="success"
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={2500}
            autohide
            style={{ minWidth: '280px' }}
            >
            <Toast.Body className="text-white fw-bold">
                {toastMessage}
            </Toast.Body>
            </Toast>
        </ToastContainer>
        </div>
    );
    };

    export default MyAddress;
