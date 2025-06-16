    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import {
    Container, Row, Col, Card, Form, Button, Toast, ToastContainer,
    } from 'react-bootstrap';

    const EditAddress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        namaAlamat: '',
        namaPenerima: '',
        nomorHP: '',
        alamat: '',
        kodePos: '',
    });
    // const [user, setUser] = useState({ name: '', no_telp: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Ambil data user
        // fetch('http://localhost:8000/api/', {
        // headers: { Authorization: `Bearer ${token}` },
        // })
        // .then((res) => res.json())
        // .then((data) => {
        //     setUser({
        //     name: data.user.name,
        //     no_telp: data.user.no_telp,
        //     });
        // });

        // Ambil data alamat
        fetch(`http://localhost:8000/api/alamat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.json())
        .then((data) => {
            setForm({
            namaAlamat: data.namaAlamat || '',
            namaPenerima: data.namaPenerima || '',
            nomorHP: data.noHpPenerima || '',
            alamat: data.alamat || '',
            kodePos: data.kodePos || '',
            });
        });
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
        const response = await fetch(`http://localhost:8000/api/alamat/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            namaAlamat: form.namaAlamat,
            alamat: form.alamat,
            kodePos: form.kodePos,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setToastMessage('Alamat berhasil diperbarui');
            setToastVariant('success');
            setShowToast(true);
            setTimeout(() => navigate('/myaddress'), 2000);
        } else {
            setToastMessage(data.message || 'Gagal memperbarui alamat');
            setToastVariant('danger');
            setShowToast(true);
        }
        } catch (err) {
        console.error(err);
        setToastMessage('Gagal koneksi ke server');
        setToastVariant('danger');
        setShowToast(true);
        }
    };

    return (
        <Container className="py-4">
        <Card>
            <Card.Header className="fw-bold">Edit Alamat</Card.Header>
            <Card.Body>
            <Form>
                <Form.Group className="mb-3">
                <Form.Label>Nama Alamat (Label)</Form.Label>
                <Form.Control
                    type="text"
                    name="namaAlamat"
                    value={form.namaAlamat}
                    onChange={handleChange}
                    placeholder="Contoh: Rumah, Kantor, Kosan"
                />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Nama Penerima</Form.Label>
                <Form.Control type="text" value={form.namaPenerima} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>No HP Penerima</Form.Label>
                <Form.Control type="text" value={form.nomorHP} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Alamat Lengkap</Form.Label>
                <Form.Control
                    as="textarea"
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                />
                </Form.Group>

                <Form.Group className="mb-4">
                <Form.Label>Kode Pos</Form.Label>
                <Form.Control
                    type="text"
                    name="kodePos"
                    value={form.kodePos}
                    onChange={handleChange}
                />
                </Form.Group>

                <Button variant="success" onClick={handleSave}>
                SAVE
                </Button>
            </Form>
            </Card.Body>
        </Card>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            bg={toastVariant}
            >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
        </Container>
    );
    };

    export default EditAddress;
