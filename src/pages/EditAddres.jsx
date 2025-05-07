    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

    const EditAddress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ label: '', firstName: '', lastName: '', phone: '', address: '' });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('addresses')) || [];
        const existing = stored.find((addr) => addr.id === parseInt(id));
        if (existing) {
        const [first, ...rest] = existing.name.split(' ');
        setForm({
            label: existing.label,
            firstName: first,
            lastName: rest.join(' '),
            phone: existing.phone,
            address: existing.address,
        });
        }
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = () => {
        const stored = JSON.parse(localStorage.getItem('addresses')) || [];
        const updated = stored.map((addr) =>
            addr.id === parseInt(id)
            ? {
                ...addr,
                label: form.label,
                name: `${form.firstName} ${form.lastName}`,
                phone: form.phone,
                address: form.address,
            }
            : addr
            );
        localStorage.setItem('addresses', JSON.stringify(updated));
        navigate('/myaddress');
    };
    

    return (
        <Container className="py-4">
        <Card>
            <Card.Header>Edit Alamat</Card.Header>
            <Card.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Nama Alamat *</Form.Label>
                <Form.Control name="label" value={form.label} onChange={handleChange} />
                </Form.Group>
                <Row className="mb-3">
                <Col>
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control name="firstName" value={form.firstName} onChange={handleChange} />
                </Col>
                <Col>
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control name="lastName" value={form.lastName} onChange={handleChange} />
                </Col>
                </Row>
                <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control as="textarea" name="address" value={form.address} onChange={handleChange} />
                </Form.Group>
                <Button onClick={handleSave} variant="success">SAVE</Button>
            </Form>
            </Card.Body>
        </Card>
        </Container>
    );
    };

    export default EditAddress;