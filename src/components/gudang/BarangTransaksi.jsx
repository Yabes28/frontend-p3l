    import React, { useEffect, useState } from 'react';
    import {
    Row,
    Col,
    Card,
    Button,
    Badge,
    Modal,
    Toast,
    ToastContainer,
    Spinner,
    } from 'react-bootstrap';
    import axios from 'axios';
    import Skeleton from 'react-loading-skeleton';
    import 'react-loading-skeleton/dist/skeleton.css';
    import { motion } from 'framer-motion';

    const BarangTransaksi = () => {
    const [barangs, setBarangs] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchTransaksi = async () => {
        try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/transaksi-gudang', { headers });
        if (Array.isArray(res.data)) {
            setBarangs(res.data);
        } else {
            setToast({ show: true, message: '❌ Data bukan array, periksa backend.', variant: 'danger' });
        }
        } catch (err) {
        setToast({ show: true, message: '❌ Gagal mengambil data transaksi.', variant: 'danger' });
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaksi();
    }, []);

    const handleShowDetail = async (item) => {
        try {
        setModalLoading(true);
        const endpoint = `http://localhost:8000/api/barang/${item.idTransaksi}`;
        const res = await axios.get(endpoint, { headers });
        setSelectedItem(res.data);
        } catch (err) {
        setToast({ show: true, message: '❌ Gagal ambil detail barang.', variant: 'danger' });
        } finally {
        setModalLoading(false);
        }
    };

    return (
        <>
        <h4 className="mb-4">Barang Transaksi</h4>

        {loading ? (
            <Row>
            {[...Array(6)].map((_, index) => (
                <Col lg={4} md={6} sm={12} className="mb-4" key={index}>
                <Card className="border-0 shadow-sm h-100">
                    <Skeleton height={200} />
                    <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                        <Skeleton height={20} width={`80%`} />
                        <Skeleton height={15} width={`60%`} className="mt-2" />
                        <Skeleton height={30} width={100} className="mt-3" />
                    </div>
                    <Skeleton height={38} width={`100%`} />
                    </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
        ) : (
            <Row>
            {barangs.length === 0 ? (
                <p className="text-muted">Tidak ada barang.</p>
            ) : (
                barangs.map((item) => (
                <Col lg={4} md={6} sm={12} className="mb-4 d-flex" key={item.idTransaksi}>
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-100"
                    >
                    <Card className="border-0 shadow-sm h-100 d-flex flex-column">
                        <div
                        onClick={() => handleShowDetail(item)}
                        style={{ cursor: 'pointer' }}
                        >
                        <Card.Img
                            variant="top"
                            src={
                            item.gambar1
                                ? `http://localhost:8000/storage/${item.gambar1}`
                                : 'https://via.placeholder.com/300x200?text=No+Image'
                            }
                            style={{ height: '200px', objectFit: 'cover' }}
                        />
                        </div>
                        <Card.Body className="d-flex flex-column justify-content-between">
                        <div>
                            <Card.Title>{item.namaProduk}</Card.Title>
                            <div className="mb-2 text-muted">
                            <small>Penitip: {item.namaPenitip}</small>
                            </div>
                            {item.statusTransaksi === 'selesai' && (
                            <div className="mb-2">
                                <strong>Selesai:</strong> {item.tglSelesai}
                            </div>
                            )}
                            <Badge
                            bg={
                                item.statusTransaksi === 'diproses'
                                ? 'primary'
                                : item.statusTransaksi === 'siap diambil'
                                ? 'info'
                                : item.statusTransaksi === 'siap dikirim'
                                ? 'warning'
                                : 'secondary'
                            }
                            className="mb-3"
                            style={{ width: 'fit-content' }}
                            >
                            {item.statusTransaksi}
                            </Badge>
                        </div>
                        <Button
                            variant="outline-primary"
                            className="mt-auto"
                            onClick={() => handleShowDetail(item)}
                        >
                            Lihat Detail
                        </Button>
                        </Card.Body>
                    </Card>
                    </motion.div>
                </Col>
                ))
            )}
            </Row>
        )}

        <Modal show={!!selectedItem || modalLoading} onHide={() => setSelectedItem(null)} size="lg" centered>
            <Modal.Header closeButton>
            <Modal.Title>Detail Barang</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {modalLoading ? (
                <div className="text-center py-5">
                <Spinner animation="border" variant="secondary" />
                <p className="mt-2 text-muted">Memuat detail barang...</p>
                </div>
            ) : selectedItem ? (
                <>
                <h5>{selectedItem.namaProduk}</h5>
                <p><strong>Penitip:</strong> {selectedItem.namaPenitip || 'Tidak diketahui'}</p>
                <p><strong>Pembeli:</strong> {selectedItem.namaPembeli || '-'}</p>
                <p><strong>Harga:</strong> {selectedItem.harga ? `Rp${Number(selectedItem.harga).toLocaleString()}` : '-'}</p>
                <p><strong>Status:</strong> {selectedItem.statusTransaksi}</p>
                <p><strong>Tipe Transaksi:</strong> {selectedItem.tipe_transaksi || '-'}</p>
                <p><strong>Alamat Pengiriman:</strong> {selectedItem.alamatPengiriman || '-'}</p>
                <p><strong>Tanggal Transaksi:</strong> {selectedItem.tglTransaksi || '-'}</p>
                <Row className="mt-3">
                    <Col md={6}>
                    <img src={`http://localhost:8000/storage/${selectedItem.gambar1}`} className="img-fluid rounded" alt="Gambar 1" />
                    </Col>
                    <Col md={6}>
                    <img src={`http://localhost:8000/storage/${selectedItem.gambar2}`} className="img-fluid rounded" alt="Gambar 2" />
                    </Col>
                </Row>
                </>
            ) : (
                <p className="text-muted">Data tidak tersedia.</p>
            )}
            </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast
            bg={toast.variant}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
            delay={3000}
            autohide
            >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </>
    );
    };

    export default BarangTransaksi;