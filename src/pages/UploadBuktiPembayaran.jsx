import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UploadBuktiPembayaran = () => {
    const { orderId } = useParams(); // Ambil orderId dari URL
    const navigate = useNavigate();
    const authToken = localStorage.getItem('token');

    const [order, setOrder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loadingOrder, setLoadingOrder] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const api = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:8000/api',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
                // Content-Type akan di-set oleh FormData saat upload
            }
        });
    }, [authToken]);

    useEffect(() => {
        // Selalu pastikan loadingOrder di-set false jika tidak ada proses fetch yang berjalan
        // atau jika kondisi awal tidak terpenuhi.

        if (!authToken) {
            setError('Silakan login untuk mengunggah bukti pembayaran.');
            setLoadingOrder(false); // Set loading false karena tidak ada fetch
            return; // Keluar dari useEffect
        }

        if (!orderId) {
            setError('ID Pesanan tidak ditemukan di URL. Pastikan URL Anda benar.');
            setLoadingOrder(false); // Set loading false karena tidak ada fetch
            return; // Keluar dari useEffect
        }

        // Jika authToken dan orderId ada, baru lakukan fetch
        setLoadingOrder(true); // Set loading true sebelum memulai API call
        api.get(`/orders/${orderId}`) // Panggil endpoint show dari TransaksiController
            .then(response => {
                setOrder(response.data); // Sesuaikan dengan struktur API Anda
                setError(null); // Bersihkan error jika sukses
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Gagal memuat detail pesanan. Coba lagi nanti.');
                console.error("Error fetching order details:", err.response || err);
                setOrder(null); // Pastikan order di-reset jika gagal fetch
            })
            .finally(() => {
                setLoadingOrder(false); // Ini akan selalu dipanggil setelah .then() atau .catch()
            });
    }, [orderId, api, authToken]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Batas 2MB
                setError('Ukuran file maksimal adalah 2MB.');
                setSelectedFile(null);
                setPreview(null);
                e.target.value = null; // Reset input file
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                setError('Hanya file gambar (JPEG, PNG, GIF) yang diizinkan.');
                setSelectedFile(null);
                setPreview(null);
                e.target.value = null; // Reset input file
                return;
            }
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setError(null); // Bersihkan error jika file valid
        } else {
            setSelectedFile(null);
            setPreview(null);
        }
    };

    const handleSubmitProof = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Silakan pilih file bukti pembayaran terlebih dahulu.');
            return;
        }
        // if (!order || order.status !== "pending_payment") {
        //     setError('Tidak dapat mengunggah bukti untuk pesanan ini (mungkin status sudah berubah atau pesanan tidak valid).');
        //     return;
        // }

        const formData = new FormData();
        formData.append('buktiPembayaran', selectedFile); // Nama field harus 'buktiPembayaran' sesuai validasi backend

        setIsUploading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await api.post(`/orders/${orderId}/payment-proof`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Penting untuk upload file
                }
            });
            setSuccessMessage(response.data.message || 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi.');
            setOrder(response.data.order); // Update order dengan status baru jika dikirim dari backend
            setSelectedFile(null); // Reset file input
            setPreview(null);
            // Arahkan pengguna atau update UI lebih lanjut
            // setTimeout(() => navigate(`/akun/pesanan/${orderId}`), 3000); // Contoh navigasi setelah sukses
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran. Coba lagi.');
            console.error("Error uploading proof:", err.response || err);
        } finally {
            setIsUploading(false);
        }
    };

    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

    if (loadingOrder) {
        return <Container className="text-center py-5"><Spinner animation="border" /> Memuat Detail Pesanan...</Container>;
    }

    if (error && !order) { // Error saat fetch order awal dan order belum ada
        return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!order && !loadingOrder) { // Jika order tidak ditemukan setelah selesai loading
        return <Container className="py-5"><Alert variant="warning">Detail pesanan tidak ditemukan.</Alert></Container>;
    }


    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4" className="text-center">Unggah Bukti Pembayaran</Card.Header>
                        <Card.Body>
                            {order && (
                                <ListGroup variant="flush" className="mb-3">
                                    <ListGroup.Item><strong>Nomor Transaksi:</strong> RUM-#{order.nomor_transaksi_unik || order.idTransaksi}</ListGroup.Item>
                                    <ListGroup.Item><strong>Total Pembayaran:</strong> <span className="fw-bold text-danger">{formatCurrency(order.totalHarga)}</span></ListGroup.Item>
                                    <ListGroup.Item><strong>Status Saat Ini:</strong> <Badge bg={order.status === 'pending_payment' ? 'warning' : (order.status === 'awaiting_verification' ? 'info' : 'secondary')} text={order.status === 'pending_payment' || order.status === 'awaiting_verification' ? 'dark' : 'white'}>{order.status?.replace('_', ' ').toUpperCase()}</Badge></ListGroup.Item>
                                </ListGroup>
                            )}

                            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                            {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}

                            {order && order.status === 'pending_payment' && (
                                <Form onSubmit={handleSubmitProof}>
                                    <Form.Group controlId="formFileProof" className="mb-3">
                                        <Form.Label>Pilih File Bukti Pembayaran (Gambar, maks 2MB)</Form.Label>
                                        <Form.Control type="file" onChange={handleFileChange} accept="image/jpeg,image/png,image/gif" required />
                                    </Form.Group>

                                    {preview && (
                                        <div className="mb-3 text-center">
                                            <p>Preview Gambar:</p>
                                            <img src={preview} alt="Preview Bukti Pembayaran" style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ddd' }} />
                                        </div>
                                    )}

                                    <Button variant="primary" type="submit" disabled={isUploading || !selectedFile}>
                                        {isUploading ? <><Spinner as="span" animation="border" size="sm" /> Mengunggah...</> : 'Unggah Bukti'}
                                    </Button>
                                </Form>
                            )}

                            {order && order.status_pesanan !== 'pending_payment' && order.buktiPembayaran && (
                                <div className="mt-3">
                                    <h5>Bukti Pembayaran Sudah Diunggah:</h5>
                                    <img src={order.buktiPembayaran.startsWith('http') ? order.buktiPembayaran : `${api.defaults.baseURL.replace('/api','')}/storage/${order.buktiPembayaran}`} alt="Bukti Pembayaran" style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ddd' }} />
                                </div>
                            )}
                             {/* {order && order.status_pesanan !== 'pending_payment' && !order.buktiPembayaran && (
                                 <Alert variant="info" className="mt-3">Tidak dapat mengunggah bukti untuk pesanan ini karena statusnya bukan 'pending payment' atau bukti belum pernah diunggah.</Alert>
                             )} */}


                            <div className="mt-4 text-center">
                                <Button variant="outline-secondary" size="sm" as={Link} to="/akun/pesanan">Kembali ke Daftar Pesanan</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UploadBuktiPembayaran;