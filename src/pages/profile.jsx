    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Card, Form, Button, ListGroup, Spinner, Toast, ToastContainer } from 'react-bootstrap';
    import { FaArrowRight } from 'react-icons/fa';
    import { Link, useLocation } from 'react-router-dom';

    const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', no_telp: '', foto: null });
    const [fotoPreview, setFotoPreview] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const token = localStorage.getItem('token');
    const tipe_akun = localStorage.getItem('tipe_akun');
    const location = useLocation();

    useEffect(() => {
        if (!token || !tipe_akun) return;

        fetch('http://localhost:8000/api/user', {
        headers: {
            Authorization: `Bearer ${token}`,
            'tipe-akun': tipe_akun,
        },
        })
        .then(res => res.json())
        .then(data => {
            const u = data.user;
            setUser(u);
            setForm({
            name: u.name || u.nama || u.namaOrganisasi || '',
            email: u.email || '',
            no_telp: u.no_telp || u.nomorHP || u.kontak || '',
            foto: null
            });
            setFotoPreview(u.foto ? `http://localhost:8000/${u.foto}` : null);
            setLoading(false);
        })
        .catch(err => {
            console.error('Gagal mengambil user:', err);
                setLoading(false);
        });
    }, [token, tipe_akun]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto') {
        const file = files[0];
        setForm({ ...form, foto: file });
        setFotoPreview(URL.createObjectURL(file));
        } else {
        setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', form.name);
        data.append('email', form.email);
        data.append('no_telp', form.no_telp);
        if (form.foto) data.append('foto', form.foto);

        try {
        const response = await fetch('http://localhost:8000/api/user/update', {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,
            'tipe-akun': tipe_akun,
            },
            body: data,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal update profil');

        setToastMessage('Profil berhasil diperbarui!');
        setToastVariant('success');
        setShowToast(true);
        setUser(result.user);
        setFotoPreview(result.user.foto ? `http://localhost:8000/${result.user.foto}` : null);
        } catch (err) {
        setToastMessage(err.message);
        setToastVariant('danger');
        setShowToast(true);
        }
    };

    if (loading) {
        return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Loading profile...</p>
        </div>
        );
    }

    if (!user) {
        return (
        <div className="text-center py-5">
            <h5>Data user tidak ditemukan.</h5>
        </div>
        );
    }

    return (
        <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4 px-md-5">
            <div className="mb-4 text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
            <Link to="/" className="text-secondary text-decoration-none">Home</Link> / <span className="text-dark">profile</span>
            </div>

            <Row className="gx-4 gy-4">
            <Col md={4} lg={3}>
                <Card className="shadow-sm border-0">
                <Card.Body className="text-center">
                    <img
                    src={fotoPreview || '/avatar-placeholder.png'}
                    alt="avatar"
                    className="rounded-circle mb-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h6 className="fw-bold mb-1">{form.name}</h6>
                    <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Total Point</p>
                    <h5 className="text-success fw-bold">{user.poinLoyalitas ?? 0}</h5>
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
                    <ListGroup.Item action as={Link} to="/merchandise" className={`d-flex justify-content-between align-items-center ${location.pathname === "/merchandise" ? "bg-success text-white" : ""}`}>
                        Merchandise <FaArrowRight />
                    </ListGroup.Item>
                </ListGroup>
                </Card>
            </Col>

            <Col md={8} lg={9}>
                <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold border-0">Account Info</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                        <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control name="name" type="text" value={form.name} onChange={handleChange} className="rounded-3" />
                        </Col>
                        <Col md={6}>
                        <Form.Label>Foto Profile</Form.Label>
                        <Form.Control name="foto" type="file" onChange={handleChange} className="rounded-3" accept="image/*" />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}>
                        <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                        <Form.Control name="email" type="email" value={form.email} onChange={handleChange} className="rounded-3" />
                        </Col>
                        <Col md={6}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control name="no_telp" type="text" value={form.no_telp} onChange={handleChange} className="rounded-3" />
                        </Col>
                    </Row>
                    <div className="text-start mt-4">
                        <Button variant="success" type="submit" className="px-4 py-2 fw-bold rounded-3">SAVE</Button>
                    </div>
                    </Form>
                </Card.Body>
                </Card>
            </Col>
            </Row>

            <ToastContainer position="bottom-end" className="p-3">
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
                <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
            </ToastContainer>
        </Container>
        </div>
    );
    };

    export default Profile;
