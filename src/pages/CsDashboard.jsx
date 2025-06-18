// src/pages/CSDashboard.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react'; // Tambahkan useMemo, useCallback
import { Container, Row, Col, Button, Table, Form, Alert, Spinner, Modal, Image } from 'react-bootstrap'; // Tambahkan Modal, Image, Spinner
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CSDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Ini user CS yang login
    const token = localStorage.getItem('token');

    // State untuk Penitip (sudah ada)
    const [penitip, setPenitip] = useState([]);
    const [searchPenitip, setSearchPenitip] = useState(''); // Ganti nama search agar lebih spesifik
    const [messagePenitip, setMessagePenitip] = useState(''); // Ganti nama message

    // State BARU untuk Transaksi Menunggu Verifikasi
    const [ordersToVerify, setOrdersToVerify] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [errorOrders, setErrorOrders] = useState('');
    const [verifyingOrder, setVerifyingOrder] = useState(null); // Menyimpan order yang sedang diverifikasi di modal

    // State BARU untuk Modal Verifikasi
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(true); // Default ke valid
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

    // Instance Axios (lebih baik di-memoize)
    const api = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:8000/api', // Arahkan ke base URL admin jika rute verifikasi ada di sana
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
    }, [token]);


    // --- Logika untuk Penitip (sudah ada, sedikit penyesuaian nama variabel) ---
    const getDataPenitip = useCallback(async () => {
        // Ubah URL jika API penitip ada di bawah /admin juga atau prefix berbeda
        try {
            const res = await axios.get('http://localhost:8000/api/penitip', { // Tetap pakai axios global jika API penitip di root /api
                headers: { Authorization: `Bearer ${token}` }
            });
            setPenitip(res.data.data || res.data || []); // Sesuaikan dengan struktur data Anda
        } catch (err) {
            console.error("Gagal ambil data penitip", err.response || err);
            setMessagePenitip('Gagal mengambil data penitip.');
        }
    }, [token]);

    const handleDeletePenitip = async (id) => {
        if (!window.confirm('Yakin ingin menghapus penitip ini?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/penitip/${id}`, { // Tetap pakai axios global
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessagePenitip('Penitip berhasil dihapus.');
            getDataPenitip(); // Refresh data penitip
        } catch (err) {
            setMessagePenitip('Gagal menghapus penitip.');
            console.error("Gagal hapus penitip", err.response || err);
        }
    };

    // --- Logika BARU untuk Transaksi Menunggu Verifikasi ---
    const fetchOrdersToVerify = useCallback(async () => {
        setLoadingOrders(true);
        setErrorOrders('');
        try {
            // const response = await api.get('/orders/pending-verification'); // Endpoint dari AdminOrderController
            const response = await api.get('/orders/pending-verification');
            // Log untuk debugging
            console.log('CSDashboard - Response dari /orders/pending-verification:', response);
            console.log('CSDashboard - response.data:', response.data);
            setOrdersToVerify(response.data);

            // Pastikan response.data adalah array sebelum di-set
            // if (response && Array.isArray(response.data)) {
            //     setOrdersToVerify(response.data);
            // } else {
            //     // Jika backend tidak mengembalikan array (misalnya error atau format salah)
            //     console.warn('CSDashboard - Data diterima untuk ordersToVerify bukan array, diatur ke array kosong. Data:', response.data);
            //     setOrdersToVerify([]); // Jaga agar state selalu array
            // }
        } catch (err) {
            setErrorOrders('Gagal memuat daftar transaksi untuk diverifikasi.');
            console.error("CSDashboard - Error fetching orders to verify:", err.response || err.message, err);
            setOrdersToVerify([]); // Jaga agar state selalu array jika error
        } finally {
            setLoadingOrders(false);
        }
    }, [api]);

    useEffect(() => {
        if (token) {
            getDataPenitip();
            fetchOrdersToVerify();
        } else {
            navigate('/login-cs'); // Atau halaman login yang sesuai untuk CS
        }
    }, [token, getDataPenitip, fetchOrdersToVerify, navigate]);

    const handleOpenVerifyModal = (order) => {
        setVerifyingOrder(order);
        setVerificationStatus(true); // Reset ke valid saat modal dibuka
        setAdminNotes('');
        setShowVerifyModal(true);
    };

    const handleCloseVerifyModal = () => {
        setShowVerifyModal(false);
        setVerifyingOrder(null);
    };

    const handleSubmitVerification = async () => {
        if (!verifyingOrder) return;
        setIsSubmittingVerification(true);
        setErrorOrders(''); // Reset error sebelumnya
        console.log(verificationStatus);
        try {
            await api.post(`/orders/${verifyingOrder.idTransaksi}/verify-payment`, { // idTransaksi atau id tergantung respons API Anda
                is_valid: verificationStatus,
                // admin_notes: adminNotes,
            });
            
            setMessagePenitip(`Verifikasi untuk transaksi ${verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi} berhasil diproses.`); // Pesan umum
            fetchOrdersToVerify(); // Refresh daftar order
            handleCloseVerifyModal();
        } catch (err) {
            setErrorOrders(err.response?.data?.message || `Gagal memproses verifikasi untuk transaksi ${verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi}.`);
            console.error("Error submitting verification:", err.response || err);
        } finally {
            setIsSubmittingVerification(false);
        }
    };

    const handleApprove = async () => {
        if (!verifyingOrder) return;
        setIsSubmittingVerification(true);
        setErrorOrders('');
        try {
            await api.post(`/orders/${verifyingOrder.idTransaksi}/approve-payment`, { // idTransaksi atau id
                admin_notes: adminNotes, // Kirim catatan jika ada
            });
            setMessagePenitip(`Pembayaran untuk transaksi ${verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi} berhasil disetujui.`);
            fetchOrdersToVerify(); // Refresh daftar order
            handleCloseVerifyModal();
        } catch (err) {
            setErrorOrders(err.response?.data?.message || `Gagal menyetujui pembayaran untuk transaksi ${verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi}.`);
            console.error("Error approving payment:", err.response || err);
        } finally {
            setIsSubmittingVerification(false);
        }
    };

    const handleReject = async () => {
        if (!verifyingOrder) return;
        // Anda bisa tambahkan konfirmasi window.confirm di sini jika mau
        // if (!window.confirm('Anda yakin ingin menolak pembayaran ini? Stok akan dikembalikan.')) return;

        setIsSubmittingVerification(true);
        setErrorOrders('');
        try {
            await api.post(`/orders/${verifyingOrder.idTransaksi}/reject-payment`, { // idTransaksi atau id
                admin_notes: adminNotes, // Kirim catatan jika ada
            });
            setMessagePenitip(`Pembayaran untuk transaksi ${verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi} ditolak.`);
            fetchOrdersToVerify(); // Refresh daftar order
            handleCloseVerifyModal();
        } catch (err) {
            setErrorOrders(err.response?.data?.message || `Gagal menolak pembayaran untuk transaksi ${verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi}.`);
            console.error("Error rejecting payment:", err.response || err);
        } finally {
            setIsSubmittingVerification(false);
        }
    };

    const filteredPenitip = penitip.filter(p =>
        p.nama?.toLowerCase().includes(searchPenitip.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchPenitip.toLowerCase())
    );

    // Helper untuk format mata uang dan tanggal
    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';


    return (
        <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
            <Container className="px-4 px-md-5">
                {/* ... (Bagian Header Dashboard CS - sudah ada) ... */}
                <Row className="align-items-center justify-content-between mb-4">
                <Col>
                    <h3 className="fw-bold text-success">CS Dashboard</h3>
                    <p className="text-muted">Selamat datang, <strong>{user?.nama || user?.name}</strong>!</p> {/* Sesuaikan dengan field nama user CS */}
                </Col>
                <Col className="text-end">
                    <Button variant="success" className="fw-semibold" onClick={() => navigate('/tambah-penitip')}>
                        + Tambah Penitip
                    </Button>
                </Col>
                </Row>

                {/* --- Bagian Tabel Data Penitip (Sudah Ada) --- */}
                <Row>
                    <Col>
                        <div className="bg-white p-4 rounded shadow-sm border">
                            <h5 className="fw-bold mb-3">Data Penitip</h5>
                            {messagePenitip && <Alert variant={messagePenitip.startsWith('Gagal') ? 'danger' : 'info'} onClose={() => setMessagePenitip('')} dismissible>{messagePenitip}</Alert>}
                            <Form.Control
                                type="text"
                                placeholder="Cari nama/email penitip..."
                                value={searchPenitip}
                                onChange={(e) => setSearchPenitip(e.target.value)}
                                className="mb-3"
                            />
                            <Table striped bordered hover responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>NIK</th>
                                        <th>Email</th>
                                        <th>Nomor HP</th>
                                        <th>Alamat</th>
                                        <th>Foto KTP</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPenitip.map((item, index) => (
                                        <tr key={item.penitipID}>
                                            <td>{index + 1}</td>
                                            <td>{item.nama}</td>
                                            <td>{item.nik}</td>
                                            <td>{item.email}</td>
                                            <td>{item.nomorHP || item.nomor_hp}</td>
                                            <td>{item.alamat}</td>
                                            <td>
                                                {/* Pastikan path gambar KTP benar dan bisa diakses */}
                                                <Image src={`http://localhost:8000/storage/${item.foto_ktp}`} alt="KTP" width="70" thumbnail fluid style={{objectFit: 'cover'}}/>
                                            </td>
                                            <td>
                                                <Button variant="danger" size="sm" onClick={() => handleDeletePenitip(item.penitipID)}>Hapus</Button>
                                                {/* Tambahkan tombol Edit jika perlu */}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPenitip.length === 0 && (
                                        <tr><td colSpan="8" className="text-center text-muted">Data penitip tidak ditemukan.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
                {/* --- Bagian Tabel Transaksi Menunggu Verifikasi (BARU) --- */}
                <Row className="mb-5 mt-4">
                    <Col>
                        <div className="bg-white p-4 rounded shadow-sm border">
                            <h5 className="fw-bold mb-3 text-danger">Transaksi Menunggu Verifikasi Pembayaran</h5>
                            {errorOrders && <Alert variant="danger">{errorOrders}</Alert>}
                            {loadingOrders ? (
                                <div className="text-center"><Spinner animation="border" variant="danger" /> Memuat data...</div>
                            ) : ordersToVerify.length === 0 ? (
                                <Alert variant="info">Tidak ada transaksi yang menunggu verifikasi saat ini.</Alert>
                            ) : (
                                <Table striped bordered hover responsive size="sm">
                                    <thead>
                                        <tr>
                                            <th>No. Transaksi</th>
                                            <th>Tgl. Transaksi</th>
                                            <th>Pembeli</th>
                                            <th>Total Bayar</th>
                                            <th>Bukti Bayar</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersToVerify.map(order => (
                                            <tr key={order.idTransaksi}>
                                                <td>{order.nomor_transaksi_unik || order.idTransaksi}</td>
                                                <td>{formatDate(order.tanggalTransaksi)}</td>
                                                <td>{order.pembeli?.nama_pegawai || order.pegawai?.nama || 'N/A'}</td>
                                                <td>{formatCurrency(order.totalHarga)}</td>
                                                <td>
                                                    {order.buktiPembayaran ? ( // buktiPembayaran atau bukti_pembayaran_url
                                                        <Button variant="outline-info" size="sm" onClick={() => handleOpenVerifyModal(order)}>
                                                            Lihat & Verifikasi
                                                        </Button>
                                                    ) : (
                                                        <span className="text-muted">Belum Diunggah</span>
                                                    )}
                                                </td>
                                                <td>
                                                     <Button variant="info" size="sm" onClick={() => handleOpenVerifyModal(order)} disabled={!order.buktiPembayaran}>
                                                        Verifikasi
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* --- Modal untuk Verifikasi Pembayaran (BARU) --- */}
            {verifyingOrder && (
                <Modal show={showVerifyModal} onHide={handleCloseVerifyModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Verifikasi Pembayaran - Order #{verifyingOrder.nomor_transaksi_unik || verifyingOrder.idTransaksi}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {errorOrders && <Alert variant="danger">{errorOrders}</Alert>}
                        <p><strong>Pembeli:</strong> {verifyingOrder.pegawai?.nama_pegawai || verifyingOrder.pegawai?.nama || 'N/A'}</p>
                        <p><strong>Total Bayar:</strong> {formatCurrency(verifyingOrder.totalHarga)}</p>
                        <p><strong>Tanggal Transaksi:</strong> {formatDate(verifyingOrder.tanggalTransaksi)}</p>
                        <p><strong>Bukti Pembayaran:</strong></p>
                        {verifyingOrder.buktiPembayaran ? ( // buktiPembayaran atau bukti_pembayaran_url
                             <Image src={`http://localhost:8000/storage/${verifyingOrder.buktiPembayaran}`} fluid thumbnail alt="Bukti Pembayaran" style={{maxHeight: '400px', width: 'auto', display:'block', margin:'auto'}} onError={(e) => e.target.alt = 'Gagal memuat gambar bukti'}/>
                        ) : (
                            <p className="text-muted">Bukti pembayaran tidak tersedia.</p>
                        )}
                        <hr />
                        {/* <Form.Group className="my-3">
                            <Form.Label className="fw-semibold">Status Verifikasi:</Form.Label>
                            <Form.Check
                                type="radio"
                                label="Pembayaran Valid (Diterima)"
                                name="verificationStatus"
                                id="statusValid"
                                checked={verificationStatus === true}
                                onChange={() => setVerificationStatus(true)}
                            />
                            <Form.Check
                                type="radio"
                                label="Pembayaran Tidak Valid (Ditolak)"
                                name="verificationStatus"
                                id="statusInvalid"
                                checked={verificationStatus === false}
                                onChange={() => setVerificationStatus(false)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="fw-semibold">Catatan Admin (Opsional):</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Tambahkan catatan jika perlu..."
                            />
                        </Form.Group> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleCloseVerifyModal} disabled={isSubmittingVerification}>
                            Batal
                        </Button>
                        <Button variant="danger" onClick={handleReject} disabled={isSubmittingVerification}>
                            {isSubmittingVerification ? <><Spinner as="span" size="sm" animation="border"/> Memproses...</> : 'Tolak Pembayaran'}
                        </Button>
                        <Button variant="success" onClick={handleApprove} disabled={isSubmittingVerification}>
                            {isSubmittingVerification ? <><Spinner as="span" size="sm" animation="border"/> Memproses...</> : 'Setujui Pembayaran'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default CSDashboard;