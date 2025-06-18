    import React, { useEffect, useState } from 'react';
    import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
    import axios from 'axios';

    const DaftarBarang = ({ token, setToast, setEditItem, setSelectedItem }) => {
    const [barangs, setBarangs] = useState([]);
    const [filteredBarangs, setFilteredBarangs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [penitips, setPenitips] = useState([]);
    const [searchQuery, setSearchQuery] = useState({ namaProduk: '', penitipID: '', status: '', kategoriID: '' });

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
        const [barangRes, kategoriRes, penitipRes] = await Promise.all([
            axios.get('http://localhost:8000/api/gudang', { headers }),
            axios.get('http://localhost:8000/api/kategori', { headers }),
            axios.get('http://localhost:8000/api/penitips', { headers })
        ]);
        setBarangs(barangRes.data || []);
        setFilteredBarangs(barangRes.data || []);
        setCategories(kategoriRes.data || []);
        setPenitips(penitipRes.data || []);
        } catch (error) {
        setToast({ show: true, message: '❌ Gagal memuat data barang.', variant: 'danger' });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        const filtered = barangs.filter((item) => {
        const matchNama = searchQuery.namaProduk ? item.namaProduk.toLowerCase().includes(searchQuery.namaProduk.toLowerCase()) : true;
        const matchPenitip = searchQuery.penitipID ? item.penitipID == searchQuery.penitipID : true;
        const matchStatus = searchQuery.status ? item.status === searchQuery.status : true;
        const matchKategori = searchQuery.kategoriID ? item.kategoriID == searchQuery.kategoriID : true;
        return matchNama && matchPenitip && matchStatus && matchKategori;
        });
        setFilteredBarangs(filtered);
    };

    return (
        <>
        <h4 className="mb-4">Daftar Barang</h4>
        <Form className="mb-3">
            <Row>
            <Col md={3}><Form.Label>Nama Barang</Form.Label>
                <Form.Control value={searchQuery.namaProduk} onChange={(e) => setSearchQuery({ ...searchQuery, namaProduk: e.target.value })} /></Col>
            <Col md={3}><Form.Label>Penitip</Form.Label>
                <Form.Select value={searchQuery.penitipID} onChange={(e) => setSearchQuery({ ...searchQuery, penitipID: e.target.value })}>
                <option value="">Semua</option>
                {penitips.map(p => <option key={p.penitipID} value={p.penitipID}>{p.nama}</option>)}
                </Form.Select></Col>
            <Col md={3}><Form.Label>Status</Form.Label>
                <Form.Select value={searchQuery.status} onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}>
                <option value="">Semua</option>
                <option value="aktif">Aktif</option>
                <option value="menunggu diambil">Menunggu Diambil</option>
                <option value="diambil">Diambil</option>
                <option value="didonasikan">Didonasikan</option>
                </Form.Select></Col>
            <Col md={3}><Form.Label>Kategori</Form.Label>
                <Form.Select value={searchQuery.kategoriID} onChange={(e) => setSearchQuery({ ...searchQuery, kategoriID: e.target.value })}>
                <option value="">Semua</option>
                {categories.map(c => <option key={c.idKategori} value={c.idKategori}>{c.namaKategori}</option>)}
                </Form.Select></Col>
            </Row>
            <div className="text-end mt-3">
            <Button variant="primary" onClick={handleSearch} className="me-2">Cari</Button>
            <Button variant="secondary" onClick={() => {
                setSearchQuery({ namaProduk: '', penitipID: '', status: '', kategoriID: '' });
                setFilteredBarangs(barangs);
            }}>Reset</Button>
            </div>
        </Form>

        <Row>
            {filteredBarangs.map(item => (
            <Col key={item.idProduk} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={item.gambar_url || 'https://via.placeholder.com/300x200'} style={{ height: '200px', objectFit: 'cover' }} onClick={() => setSelectedItem(item)} />
                <Card.Body className="d-flex flex-column">
                    <Card.Title>{item.namaProduk}</Card.Title>
                    <small className="text-muted">Penitip: {item.namaPenitip}</small>
                    <div className="mt-2"><strong>Harga:</strong> Rp {item.harga.toLocaleString()}</div>
                    <Badge bg="secondary" className="my-2">{item.status}</Badge>
                    <div className="mt-auto d-flex justify-content-between">
                    <Button variant="outline-primary" size="sm" onClick={() => setEditItem(item)}>Edit</Button>
                    </div>
                </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
        </>
    );
    };

    export default DaftarBarang;
