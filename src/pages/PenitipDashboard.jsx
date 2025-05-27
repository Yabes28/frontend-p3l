    import React, { useEffect, useState, useRef } from 'react';
    import axios from 'axios';
    import {
    Card,
    Button,
    Modal,
    Form,
    InputGroup,
    Toast,
    ToastContainer,
    Badge,
    } from 'react-bootstrap';

    const PenitipDashboard = () => {
    const [barang, setBarang] = useState([]);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const debounceRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchBarang = async () => {
        setIsLoading(true);
        try {
        const res = await axios.get(`http://localhost:8000/api/barang-penitip/${user.id}`, { headers });
        setBarang(res.data);
        setIsEmpty(res.data.length === 0);
        } catch (error) {
        console.error('Gagal mengambil data barang penitip:', error);
        setIsEmpty(true);
        } finally {
        setIsLoading(false);
        }
    };

    const searchBarang = async () => {
        try {
        const res = await axios.get(
            `http://localhost:8000/api/barang-search?q=${searchTerm}&penitipID=${user.id}`,
            { headers }
        );
        setBarang(res.data);
        setIsEmpty(res.data.length === 0);
        } catch (error) {
        console.error('Gagal mencari barang:', error);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
        if (searchTerm.trim() !== '') {
            searchBarang();
        } else {
            fetchBarang();
        }
        }, 400);
    }, [searchTerm]);

    const showToast = (message, variant = 'success') => {
        setToast({ show: true, message, variant });
        setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 3000);
    };

    const handleKonfirmasiAmbil = async (idProduk) => {
        const pilihan = window.confirm('Apakah Anda yakin ingin mengambil barang ini?');
        if (pilihan) {
        try {
            await axios.put(`http://localhost:8000/api/barang-konfirmasi-ambil/${idProduk}`, {}, { headers });
            showToast('Permintaan pengambilan dikirim ke petugas.', 'info');
            fetchBarang();
        } catch (error) {
            const msg = error.response?.data?.message || 'Terjadi kesalahan saat mengirim permintaan.';
            showToast(msg, 'danger');
        }
        }
    };

    const handleDonasikan = async (idProduk) => {
        const confirm = window.confirm("Apakah Anda yakin ingin mendonasikan barang ini?");
        if (!confirm) return;

        try {
        await axios.put(`http://localhost:8000/api/barang-donasikan/${idProduk}`, {}, { headers });
        showToast('Barang telah didonasikan.', 'warning');
        fetchBarang();
        } catch (error) {
        showToast('Gagal mendonasikan barang.', 'danger');
        }
    };

    const handlePerpanjang = async (idProduk) => {
        const konfirmasi = window.confirm("Apakah Anda yakin ingin memperpanjang masa penitipan barang ini?");
        if (!konfirmasi) return;

        try {
        await axios.put(`http://localhost:8000/api/barang-perpanjang/${idProduk}`, {}, { headers });
        showToast("Barang berhasil diperpanjang selama 30 hari.", "success");
        fetchBarang();
        } catch (error) {
        const msg = error.response?.data?.message || "Gagal memperpanjang masa penitipan.";
        showToast(msg, "danger");
        }
    };

    useEffect(() => {
        fetchBarang();
    }, []);

    const handleShowDetail = (barang) => {
        setSelectedBarang(barang);
        setShowModal(true);
    };

    const getDisplayStatus = (item) => {
        const today = new Date();
        const selesai = new Date(item.tglSelesai);
        const status = item.status?.toLowerCase();

        if (['diambil', 'didonasikan', 'menunggu diambil'].includes(status)) {
        return status;
        }

        if (status === 'aktif' && selesai < today) {
        return 'masa penitipan habis';
        }

        return status;
    };

    const renderBadge = (status) => {
        const variant = {
        'diperpanjang': 'primary',
        'menunggu diambil': 'info',
        'diambil': 'success',
        'didonasikan': 'danger',
        'terjual': 'warning',
        'masa penitipan habis': 'secondary'
        }[status] || 'dark';

        return <Badge bg={variant} className="text-capitalize">{status}</Badge>;
    };

    return (
        <div className="container mt-5">
        <h3 className="mb-4">Barang Titipan {user?.name}</h3>

        <InputGroup className="mb-4">
            <Form.Control
            placeholder="Cari nama, kategori, status, atau garansi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </InputGroup>

        {isLoading ? (
            <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2">Memuat data barang...</p>
            </div>
        ) : isEmpty ? (
            <div className="text-center mt-5">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="empty" width={120} />
            <h5 className="mt-3">Belum ada barang yang dititipkan.</h5>
            <p>Silakan titipkan barang terlebih dahulu untuk melihat daftar di sini.</p>
            </div>
        ) : (
            <div className="row">
            {barang.map((item) => {
                const displayStatus = getDisplayStatus(item);

                return (
                <div className="col-md-4 mb-4" key={item.idProduk}>
                    <Card className="shadow-sm h-100">
                    <Card.Img
                        variant="top"
                        src={item.gambar_url || 'https://via.placeholder.com/300x200'}
                        alt={item.namaProduk}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                        <Card.Title>{item.namaProduk}</Card.Title>
                        <Card.Text>Rp{parseInt(item.harga).toLocaleString()}</Card.Text>
                        <Card.Text>Status: {renderBadge(displayStatus)}</Card.Text>

                        <div className="mt-auto">
                        <Button variant="info" className="me-2 mb-2" onClick={() => handleShowDetail(item)}>
                            Detail
                        </Button>

                        {displayStatus === 'aktif' && new Date(item.tglSelesai) < new Date() && (
                            <Button
                            variant="warning"
                            className="mb-2"
                            onClick={() => handlePerpanjang(item.idProduk)}
                            >
                            Perpanjang +30hr
                            </Button>
                        )}

                        {item.status.toLowerCase() === 'diperpanjang' && (
                            <Button variant="warning" className="mb-2" disabled>
                            Sudah Diperpanjang
                            </Button>
                        )}

                        {displayStatus === 'masa penitipan habis' && (
                            <>
                            <Button
                                variant="danger"
                                className="me-2 mb-2"
                                onClick={() => handleKonfirmasiAmbil(item.idProduk)}
                            >
                                Konfirmasi Ambil
                            </Button>
                            <Button
                                variant="outline-danger"
                                className="mb-2"
                                onClick={() => handleDonasikan(item.idProduk)}
                            >
                                Donasikan
                            </Button>
                            </>
                        )}
                        </div>
                    </Card.Body>
                    </Card>
                </div>
                );
            })}
            </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Detail Barang</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {selectedBarang && (
                <div>
                <h5>{selectedBarang.namaProduk}</h5>
                <p>{selectedBarang.deskripsi}</p>
                <p><strong>Harga:</strong> Rp{parseInt(selectedBarang.harga).toLocaleString()}</p>
                <p><strong>Kategori:</strong> {selectedBarang.kategori}</p>
                <p><strong>Status:</strong> {renderBadge(getDisplayStatus(selectedBarang))}</p>
                <p><strong>Garansi:</strong> {selectedBarang.garansi}</p>
                <p><strong>Tgl Mulai:</strong> {selectedBarang.tglMulai}</p>
                <p><strong>Tgl Selesai:</strong> {selectedBarang.tglSelesai}</p>
                <div className="row mt-3">
                    <div className="col-md-6">
                    <img
                        src={selectedBarang.gambar_url || 'https://via.placeholder.com/300x200'}
                        alt="Gambar 1"
                        className="img-fluid rounded"
                    />
                    </div>
                    <div className="col-md-6">
                    <img
                        src={selectedBarang.gambar2_url || 'https://via.placeholder.com/300x200'}
                        alt="Gambar 2"
                        className="img-fluid rounded"
                    />
                    </div>
                </div>
                </div>
            )}
            </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </div>
    );
    };

    export default PenitipDashboard;
