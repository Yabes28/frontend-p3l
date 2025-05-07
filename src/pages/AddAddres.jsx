    import React, { useState } from 'react';
    import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
    import { FaArrowRight } from 'react-icons/fa';
    import { Link, useNavigate } from 'react-router-dom';

    const AddAddress = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        label: '',
        name: 'Mark Cole',
        phone: '+62 821 9271 0031',
        address: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const newAddress = {
        id: Date.now(),
        ...form,
        };

        const existing = JSON.parse(localStorage.getItem('addresses')) || [];
        localStorage.setItem('addresses', JSON.stringify([...existing, newAddress]));

        navigate('/myAddress');
    };

    return (
        <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4 px-md-5">
            <div className="mb-4 text-muted fw-semibold">
            <span className="text-secondary">Home</span> / <span className="text-secondary">pages</span> /{' '}
            <span className="text-dark">add address</span>
            </div>

            <Row className="gx-4 gy-4">
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

            <Col md={8} lg={9}>
                <Card className="shadow-sm">
                <Card.Header className="bg-white fw-bold">Tambah Alamat</Card.Header>
                <Card.Body>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Alamat <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" placeholder="Contoh: Rumah 2" name="label" value={form.label} onChange={handleChange} />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                        <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" value="Mark" disabled />
                        </Col>
                        <Col md={6}>
                        <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" value="Cole" disabled />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" name="phone" value={form.phone} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={2} name="address" value={form.address} onChange={handleChange} />
                    </Form.Group>

                    <div className="text-start">
                        <Button variant="success" onClick={handleSave}>SAVE</Button>
                    </div>
                    </Form>
                </Card.Body>
                </Card>
            </Col>
            </Row>
        </Container>
        </div>
    );
    };

    export default AddAddress;