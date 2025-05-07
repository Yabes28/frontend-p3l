    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
    import { FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
    import { Link, useNavigate } from 'react-router-dom';

    const MyAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('addresses')) || [];
        setAddresses(stored);

        if (stored.length > 0) {
        const lastSelectedId = localStorage.getItem('selectedAddressId');
        setSelectedAddressId(lastSelectedId ? parseInt(lastSelectedId) : stored[stored.length - 1].id);
        }
    }, []);

    const handleSelect = (id) => {
        setSelectedAddressId(id);
        localStorage.setItem('selectedAddressId', id);
    };

    const handleDelete = (id) => {
        const filtered = addresses.filter(addr => addr.id !== id);
        setAddresses(filtered);
        localStorage.setItem('addresses', JSON.stringify(filtered));

        if (selectedAddressId === id && filtered.length > 0) {
        const newSelectedId = filtered[0].id;
        setSelectedAddressId(newSelectedId);
        localStorage.setItem('selectedAddressId', newSelectedId);
        } else if (filtered.length === 0) {
        setSelectedAddressId(null);
        localStorage.removeItem('selectedAddressId');
        }
    };

    return (
        <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4 px-md-5">
            {/* Breadcrumb */}
            <div className="mb-4 text-muted fw-semibold">
            <span className="text-secondary">Home</span> / <span className="text-secondary">pages</span> /{' '}
            <span className="text-dark">my address</span>
            </div>

            <Row className="gx-4 gy-4">
            {/* Sidebar */}
            <Col md={4} lg={3}>
                <Card className="shadow-sm">
                <Card.Body className="text-center">
                    <img
                    src="/avatar-placeholder.png"
                    alt="avatar"
                    className="rounded-circle mb-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h6 className="fw-bold mb-1">Mark Cole</h6>
                    <p className="text-muted mb-2">Total Point</p>
                    <h5 className="text-success fw-bold">500</h5>
                </Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item as={Link} to="/profile" action className="d-flex justify-content-between align-items-center">
                    Account Info <FaArrowRight />
                    </ListGroup.Item>
                    <ListGroup.Item action className="d-flex justify-content-between align-items-center">
                    History <FaArrowRight />
                    </ListGroup.Item>
                    <ListGroup.Item active action className="d-flex justify-content-between align-items-center">
                    My Address <FaArrowRight />
                    </ListGroup.Item>
                    <ListGroup.Item action className="d-flex justify-content-between align-items-center">
                    Change Password <FaArrowRight />
                    </ListGroup.Item>
                </ListGroup>
                </Card>
            </Col>

            {/* Main Content */}
            <Col md={8} lg={9}>
                <Card className="shadow-sm">
                <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
                    My Address
                    <Link to="/AddAddres">
                    <Button variant="success" size="sm">+ Tambah Alamat Baru</Button>
                    </Link>
                </Card.Header>
                <Card.Body>
                    {addresses.length === 0 ? (
                    <p className="text-muted">Belum ada alamat tersimpan.</p>
                    ) : (
                    addresses.map((addr) => {
                        const isSelected = addr.id === selectedAddressId;
                        return (
                        <Card
                            key={addr.id}
                            className="mb-3 border-0"
                            style={{ backgroundColor: isSelected ? '#e6fff2' : '#f8f9fa' }}
                        >
                            <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                <small className="text-muted fw-bold">
                                    {addr.label}
                                    {isSelected && (
                                    <span className="badge bg-light text-success border ms-2">Utama</span>
                                    )}
                                </small>
                                <p className="mb-1 fw-bold">{addr.name}</p>
                                <p className="mb-1">{addr.phone}</p>
                                <p className="mb-2">{addr.address}</p>
                                <div className="d-flex gap-3">
                                    <Button variant="link" className="p-0 text-success">Share</Button>
                                    <Button
                                    variant="link"
                                    className="p-0 text-success"
                                    onClick={() => navigate(`/EditAddres/${addr.id}`)}
                                    >
                                    Ubah Alamat
                                    </Button>
                                    {!isSelected && (
                                    <Button
                                        variant="link"
                                        className="p-0 text-primary"
                                        onClick={() => handleSelect(addr.id)}
                                    >
                                        Jadikan Utama
                                    </Button>
                                    )}
                                </div>
                                </div>
                                <Button
                                variant="link"
                                className="p-0"
                                onClick={() => handleDelete(addr.id)}
                                title="Hapus alamat"
                                style={{ color: '#ccc', fontSize: '1rem' }}
                                onMouseEnter={(e) => (e.target.style.color = '#000')}
                                onMouseLeave={(e) => (e.target.style.color = '#ccc')}
                                >
                                <FaTimes />
                                </Button>
                            </div>
                            {isSelected && (
                                <div className="d-flex justify-content-end">
                                <FaCheck className="text-success" />
                                </div>
                            )}
                            </Card.Body>
                        </Card>
                        );
                    })
                    )}
                </Card.Body>
                </Card>
            </Col>
            </Row>
        </Container>
        </div>
    );
    };

    export default MyAddress;