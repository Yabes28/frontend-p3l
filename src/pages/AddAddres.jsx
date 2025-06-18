    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Card, Form, Button, ListGroup, Toast, ToastContainer } from 'react-bootstrap';
    import { FaArrowRight } from 'react-icons/fa';
    import { Link, useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const AddAddress = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: '', id: '', nomorHP: '' });
    const [form, setForm] = useState({ label: '', alamat: '', kodePos: '' });
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:8000/api/pembeli', {
        headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
        // setUser(res.data.user || res.data);
        // console.log('Pembeli:', res.data.user);
        console.log('API Response:', res.data);
        const pembeli = res.data.user || res.data;
            setUser({
                nama: pembeli.nama,
                id: pembeli.pembeliID,
                nomorHP: pembeli.nomorHP,
            });
        }).catch(err => {
        console.error("Gagal mengambil user:", err);
        });
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:8000/api/alamat', {
                namaAlamat: form.label,
                user_id: user.id,
                namaPenerima: user.nama,
                noHpPenerima: user.nomorHP,
                alamat: form.alamat,
                kodePos: form.kodePos,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
            setToast({ show: true, message: 'Alamat berhasil ditambahkan', variant: 'success' });
        
            setTimeout(() => navigate('/myaddress'), 2000);
            } catch (error) {
                console.log('id:', user.id),
            console.error('Error simpan alamat:', error);
            setToast({ show: true, message: error.response?.data?.message || 'Gagal menyimpan', variant: 'danger' });
            }
        };
        

    return (
        <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4 px-md-5">
            <div className="mb-4 text-muted fw-semibold">
            <span className="text-secondary">Home</span> / <span className="text-dark">add address</span>
            </div>

            <Row className="gx-4 gy-4">
            <Col md={4} lg={3}>
                <Card className="shadow-sm">
                <Card.Body className="text-center">
                    <img src="/avatar-placeholder.png" alt="avatar" className="rounded-circle mb-3" style={{ width: '100px', height: '100px' }} />
                    <h6 className="fw-bold mb-1">{user?.nama}</h6>
                    <p className="text-muted mb-2">Total Point</p>
                    <h5 className="text-success fw-bold">500</h5>
                </Card.Body>
                <ListGroup variant="flush">
                                    <ListGroup.Item action as={Link} to="/profile" className={`d-flex justify-content-between align-items-center ${location.pathname === "/profile" ? "bg-success text-white" : ""}`}>
                                    Account Info <FaArrowRight />
                                    </ListGroup.Item>
                                    <ListGroup.Item action as={Link} to="/history" className={`d-flex justify-content-between align-items-center ${location.pathname === "/history" ? "bg-success text-white" : ""}`}>
                                    History <FaArrowRight />
                                    </ListGroup.Item>
                                    <ListGroup.Item action as={Link} to="/myAddress" className={`d-flex justify-content-between align-items-center ${location.pathname === "/myAddress" ? "bg-success text-white" : ""}`}>
                                    My Address <FaArrowRight />
                                    </ListGroup.Item>
                                    <ListGroup.Item action as={Link} to="/change-password" className={`d-flex justify-content-between align-items-center ${location.pathname === "/change-password" ? "bg-success text-white" : ""}`}>
                                    Change Password <FaArrowRight />
                                    </ListGroup.Item>
                                </ListGroup>
                </Card>
            </Col>

            <Col md={8} lg={9}>
                <Card className="shadow-sm">
                <Card.Header className="bg-white fw-bold">Tambah Alamat</Card.Header>
                <Card.Body>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Alamat *</Form.Label>
                        <Form.Control name="label" value={form.label} onChange={handleChange} />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                        <Form.Label>Nama Penerima</Form.Label>
                        <Form.Control value={user?.nama || ''} disabled />
                        </Col>
                        <Col md={6}>
                        <Form.Label>Nomor HP</Form.Label>
                        <Form.Control value={user?.nomorHP || ''} disabled />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Alamat Lengkap *</Form.Label>
                        <Form.Control as="textarea" name="alamat" value={form.alamat} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Kode Pos</Form.Label>
                        <Form.Control name="kodePos" value={form.kodePos} onChange={handleChange} />
                    </Form.Group>

                    <Button variant="success" onClick={handleSave}>SAVE</Button>
                    </Form>
                </Card.Body>
                </Card>
            </Col>
            </Row>

            {/* Toast */}
            <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} show={toast.show} delay={3000} autohide>
                <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
            </ToastContainer>
        </Container>
        </div>
    );
    };

    export default AddAddress;
