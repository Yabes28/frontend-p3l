    import React, { useState } from 'react';
    import axios from 'axios';
    import { Form, Button, Row, Col } from 'react-bootstrap';

    const TambahBarang = ({ kategoris, penitips, gudangs, onSuccess, setToast }) => {
    const [form, setForm] = useState({
        namaProduk: '',
        kategoriID: '',
        penitipID: '',
        gudangID: '',
        stok: 1,
        garansi: '',
        harga: '',
        gambar: null,
        gambar2: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
        ...form,
        [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const formData = new FormData();
        for (const key in form) {
        formData.append(key, form[key]);
        }

        try {
        await axios.post('http://localhost:8000/api/barangs', formData, { headers });
        if (typeof setToast === 'function') {
            setToast({ show: true, message: '✅ Barang berhasil ditambahkan.', variant: 'success' });
        }
        if (typeof onSuccess === 'function') onSuccess();
        setForm({
            namaProduk: '', kategoriID: '', penitipID: '', gudangID: '', stok: 1,
            garansi: '', harga: '', gambar: null, gambar2: null
        });
        } catch (err) {
        if (typeof setToast === 'function') {
            setToast({ show: true, message: '❌ Gagal menambahkan barang.', variant: 'danger' });
        }
        }
    };

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control name="namaProduk" value={form.namaProduk} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Kategori</Form.Label>
                <Form.Select name="kategoriID" value={form.kategoriID} onChange={handleChange} required>
                <option value="">Pilih Kategori</option>
                {kategoris.map(k => <option key={k.id} value={k.id}>{k.namaKategori}</option>)}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Penitip</Form.Label>
                <Form.Select name="penitipID" value={form.penitipID} onChange={handleChange} required>
                <option value="">Pilih Penitip</option>
                {penitips.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </Form.Select>
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Gudang</Form.Label>
                <Form.Select name="gudangID" value={form.gudangID} onChange={handleChange} required>
                <option value="">Pilih Gudang</option>
                {gudangs.map(g => <option key={g.id} value={g.id}>{g.namaGudang}</option>)}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Harga</Form.Label>
                <Form.Control name="harga" type="number" value={form.harga} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Garansi (Tanggal)</Form.Label>
                <Form.Control name="garansi" type="date" value={form.garansi} onChange={handleChange} />
            </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Gambar Produk</Form.Label>
                <Form.Control name="gambar" type="file" accept="image/*" onChange={handleChange} />
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Gambar Tambahan</Form.Label>
                <Form.Control name="gambar2" type="file" accept="image/*" onChange={handleChange} />
            </Form.Group>
            </Col>
        </Row>
        <Button type="submit" variant="success">Simpan Barang</Button>
        </Form>
    );
    };

    export default TambahBarang;