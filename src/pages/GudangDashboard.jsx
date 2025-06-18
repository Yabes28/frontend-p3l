    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import {
    Container, Row, Col, Nav, Modal, Toast, ToastContainer
    } from 'react-bootstrap';
    import 'react-datepicker/dist/react-datepicker.css';
    import BarangDiambil from "../components/gudang/BarangDiambil";
    import BarangTransaksi from "../components/gudang/BarangTransaksi";
    import NotaKurir from "../components/gudang/NotaKurir";
    import NotaPembeli from "../components/gudang/NotaPembeli";
    import PenjadwalanPengiriman from "../components/gudang/PenjadwalanPengiriman";
    import JadwalList from "../components/gudang/JadwalList";
    import PenjadwalanPengambilan from "../components/gudang/PenjadwalanPengambilan";
    import PenitipBesar from "../components/gudang/PenitipBesar";
    import DaftarBarang from "../components/gudang/DaftarBarang";
    import TambahBarang from "../components/gudang/TambahBarang";
    import NotaPenitipan from "../components/gudang/NotaPenitipan";

    const GudangDashboard = () => {
    const [barangs, setBarangs] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [selectedMenu, setSelectedMenu] = useState('barang-diambil');
    const [selectedItem, setSelectedItem] = useState(null);

    const [transaksis, setTransaksis] = useState([]);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const [tanggalAmbil, setTanggalAmbil] = useState('');
    const [waktuAmbil, setWaktuAmbil] = useState('');
    const [selectedGudang, setSelectedGudang] = useState('');
    const [gudangList, setGudangList] = useState([]);

    const [tanggalKirim, setTanggalKirim] = useState('');
    const [selectedKurir, setSelectedKurir] = useState('');
    const [kurirs, setKurirs] = useState([]);
    const [valid, setValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [jadwalList, setJadwalList] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [penitips, setPenitips] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (selectedMenu === 'barang-diambil' || selectedMenu === 'barang-transaksi') {
        const endpoint = selectedMenu === 'barang-diambil'
            ? 'http://localhost:8000/api/gudang-barang-diambil'
            : 'http://localhost:8000/api/transaksi-gudang';
        axios.get(endpoint, { headers })
            .then(res => setBarangs(Array.isArray(res.data) ? res.data : []))
            .catch(() => setToast({ show: true, message: '❌ Gagal mengambil data barang.', variant: 'danger' }));
        } else if (selectedMenu === 'tambah-barang') {
        axios.get('http://localhost:8000/api/kategori', { headers })
            .then(res => setKategoris(res.data));
        axios.get('http://localhost:8000/api/penitips', { headers })
            .then(res => setPenitips(res.data));
        axios.get('http://localhost:8000/api/gudang', { headers })
            .then(res => setGudangList(res.data));
        }
    }, [selectedMenu]);

    useEffect(() => {
        if (selectedMenu === 'pengambilan') {
        axios.get('http://localhost:8000/api/gudang-transaksis-ambil', { headers })
            .then(res => setTransaksis(res.data));
        axios.get('http://localhost:8000/api/gudangs', { headers })
            .then(res => setGudangList(res.data));
        } else if (selectedMenu === 'pengiriman') {
        axios.get('http://localhost:8000/api/gudang-transaksis', { headers })
            .then(res => setTransaksis(res.data));
        axios.get('http://localhost:8000/api/kurirs', { headers })
            .then(res => setKurirs(res.data));
        } else if (selectedMenu === 'jadwal') {
        axios.get('http://localhost:8000/api/penjadwalans', { headers })
            .then(res => setJadwalList(res.data));
        }
    }, [selectedMenu]);

    const handleShowDetail = async (barang) => {
        const endpoint = selectedMenu === 'barang-diambil'
        ? `http://localhost:8000/api/barang-diambil/${barang.idProduk}`
        : `http://localhost:8000/api/barang/${barang.idTransaksi}`;
        try {
        const res = await axios.get(endpoint, { headers });
        setSelectedItem(res.data);
        } catch {
        setToast({ show: true, message: 'Gagal ambil detail barang.', variant: 'danger' });
        }
    };

    const renderMenuItem = (key, icon, label) => (
        <Nav.Link
        onClick={() => setSelectedMenu(key)}
        className={`py-2 px-3 mb-2 rounded ${selectedMenu === key ? 'bg-white text-dark border shadow-sm' : 'text-dark bg-light'}`}
        style={{ fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
        >
        <span className="me-2">{icon}</span>{label}
        </Nav.Link>
    );

    const renderContent = () => {
        switch (selectedMenu) {
        case 'barang-diambil':
            return <BarangDiambil barangs={barangs} handleAmbil={() => { }} handleShowDetail={handleShowDetail} />;
        case 'barang-transaksi':
            return <BarangTransaksi barangs={barangs} handleShowDetail={handleShowDetail} />;
        case 'pengiriman':
            return <PenjadwalanPengiriman {...{
            transaksis, selectedTransaksi, setSelectedTransaksi,
            tanggalKirim, setTanggalKirim,
            selectedKurir, setSelectedKurir,
            kurirs, valid,
            handleTanggalKirimChange: () => { },
            handleSimpanJadwal: () => { },
            errorMsg
            }} />;
        case 'pengambilan':
            return <PenjadwalanPengambilan {...{
            transaksis, selectedTransaksi, setSelectedTransaksi,
            tanggalAmbil, setTanggalAmbil,
            waktuAmbil, setWaktuAmbil,
            gudangList, selectedGudang, setSelectedGudang,
            handleSimpanPengambilan: () => { },
            errorMsg
            }} />;
        case 'jadwal':
            return <JadwalList {...{
            jadwalList,
            handleUbahStatus: () => { },
            handleKonfirmasiBerhasil: () => { },
            handleKonfirmasiDiterima: () => { }
            }} />;
        case 'nota-kurir':
            return <NotaKurir onCetak={() => { }} />;
        case 'nota-pembeli':
            return <NotaPembeli onCetak={() => { }} />;
        case 'penitip-besar':
            return <PenitipBesar />;
        case 'daftar-barang':
            return <DaftarBarang />;
        case 'tambah-barang':
            return <TambahBarang kategoris={kategoris} penitips={penitips} gudangs={gudangList} setToast={setToast} />;
        case 'nota-penitip':
            return <NotaPenitipan />;
        default:
            return <p className="text-muted">Pilih menu di sidebar.</p>;
        }
    };

    return (
        <Container fluid>
        <Row>
            <Col md={2} className="bg-white border-end shadow-sm min-vh-100 p-3">
            <h5 className="mb-4 text-success">Menu Gudang</h5>
            <Nav className="flex-column">
                {renderMenuItem('barang-diambil', '📦', 'Barang Diambil Penitip')}
                {renderMenuItem('barang-transaksi', '📦', 'Barang Transaksi')}
                {renderMenuItem('pengiriman', '🚚', 'Penjadwalan Pengiriman')}
                {renderMenuItem('pengambilan', '📥', 'Penjadwalan Pengambilan')}
                {renderMenuItem('nota-kurir', '🧾', 'Cetak Nota (Kurir)')}
                {renderMenuItem('nota-pembeli', '🧾', 'Cetak Nota (Pembeli)')}
                {renderMenuItem('jadwal', '📅', 'Lihat Jadwal')}
                {renderMenuItem('penitip-besar', '💰', 'Penitip Saldo Besar')}
                {renderMenuItem('daftar-barang', '📃', 'Daftar Barang')}
                {renderMenuItem('tambah-barang', '➕', 'Tambah Barang')}
                {renderMenuItem('nota-penitip', '🖨️', 'Nota Penitipan')}
            </Nav>
            </Col>
            <Col md={10} className="p-4 bg-light min-vh-100">
            {renderContent()}
            </Col>
        </Row>

        <Modal show={!!selectedItem} onHide={() => setSelectedItem(null)} size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Detail Barang</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {selectedItem && <div>Detail komponen ditampilkan di sini...</div>}
            </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </Container>
    );
    };

    export default GudangDashboard;
