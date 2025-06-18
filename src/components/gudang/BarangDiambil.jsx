    // BarangDiambil.js
    import React, { useEffect, useState } from 'react';
    import { Row, Col, Card, Button, Badge, Modal, Toast, ToastContainer, Spinner } from 'react-bootstrap';
    import axios from 'axios';
    import { motion } from 'framer-motion';
    import Skeleton from 'react-loading-skeleton';
    import 'react-loading-skeleton/dist/skeleton.css';

    const BarangDiambil = () => {
    const [barangs, setBarangs] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchBarang = async () => {
        setLoading(true);
        try {
        const res = await axios.get('http://localhost:8000/api/gudang-barang-diambil', { headers });
        if (Array.isArray(res.data)) {
            setBarangs(res.data);
        } else {
            setToast({ show: true, message: '❌ Data bukan array, cek backend.', variant: 'danger' });
        }
        } catch (error) {
        setToast({ show: true, message: '❌ Gagal mengambil data barang.', variant: 'danger' });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchBarang();
    }, []);

    const handleAmbil = async (idProduk) => {
        if (!window.confirm('Yakin barang ini telah diambil oleh pemilik?')) return;
        try {
        await axios.put(`http://localhost:8000/api/barang-diterima/${idProduk}`, {}, { headers });
        setToast({ show: true, message: '✅ Barang ditandai diambil.', variant: 'success' });
        fetchBarang();
        } catch {
        setToast({ show: true, message: '❌ Gagal mencatat pengambilan.', variant: 'danger' });
        }
    };

    const handleShowDetail = async (barang) => {
        try {
        const endpoint = `http://localhost:8000/api/barang-diambil/${barang.idProduk}`;
        const res = await axios.get(endpoint, { headers });
        setSelectedItem(res.data);
        } catch (err) {
        setToast({ show: true, message: '❌ Gagal ambil detail barang.', variant: 'danger' });
        }
    };

    return (
        <>
        <h4 className="mb-4">Barang Menunggu dan Sudah Diambil</h4>
        <Row>
            {loading ? (
            Array(3).fill().map((_, i) => (
                <Col lg={4} md={6} sm={12} className="mb-4" key={i}>
                <Skeleton height={300} borderRadius={10} />
                </Col>
            ))
            ) : barangs.length === 0 ? (
            <p className="text-muted">Tidak ada barang.</p>
            ) : (
            barangs.map((item, i) => (
                <Col lg={4} md={6} sm={12} className="mb-4" key={item.idProduk}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                    <Card className="border-0 shadow-sm h-100">
                    <Card.Img
                        variant="top"
                        src={item.gambar_url || 'https://via.placeholder.com/300x200'}
                        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => handleShowDetail(item)}
                    />
                    <Card.Body
                        className="d-flex flex-column justify-content-between"
                        style={{ minHeight: '240px' }} // Atur tinggi minimum
                    >
                        <div>
                        <Card.Title>{item.namaProduk}</Card.Title>
                        <div className="mb-2 text-muted"><small>Penitip: {item.namaPenitip}</small></div>
                        <div className="mb-2"><strong>Selesai:</strong> {item.tglSelesai}</div>
                        <Badge
                            bg={item.status === 'menunggu diambil' ? 'info' : 'secondary'}
                            className="mb-3"
                            style={{ width: 'fit-content' }}
                        >
                            {item.status}
                        </Badge>
                        </div>

                        {item.status?.toLowerCase() === 'menunggu diambil' && (
                        <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleAmbil(item.idProduk)}
                        >
                            Tandai Diambil
                        </Button>
                        )}
                    </Card.Body>
                    </Card>

                </motion.div>
                </Col>
            ))
            )}
        </Row>

        <Modal show={!!selectedItem} onHide={() => setSelectedItem(null)} size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Detail Barang</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {selectedItem && (
                <>
                <h5>{selectedItem.namaProduk}</h5>
                <p><strong>Penitip:</strong> {selectedItem.namaPenitip || 'Tidak diketahui'}</p>
                <p><strong>Kategori:</strong> {selectedItem.kategori || 'Tidak ada kategori'}</p>
                <p><strong>Harga:</strong> {selectedItem.harga ? `Rp${Number(selectedItem.harga).toLocaleString()}` : 'Tidak ada harga'}</p>
                <p><strong>Deskripsi:</strong> {selectedItem.deskripsi || 'Tidak ada deskripsi.'}</p>
                <p><strong>Garansi:</strong> {selectedItem.garansi || 'Tidak ada garansi.'}</p>
                <p><strong>Tanggal Mulai:</strong> {selectedItem.tglMulai}</p>
                <p><strong>Tanggal Selesai:</strong> {selectedItem.tglSelesai}</p>
                <Row className="mt-3">
                    <Col md={6}><img src={selectedItem.gambar_url} className="img-fluid rounded" alt="Foto 1" /></Col>
                    <Col md={6}><img src={selectedItem.gambar2_url} className="img-fluid rounded" alt="Foto 2" /></Col>
                </Row>
                </>
            )}
            </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </>
    );
    };

    export default BarangDiambil;