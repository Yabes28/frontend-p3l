    import React, { useState } from 'react';
    import { Container, Row, Col, Nav, Toast, ToastContainer } from 'react-bootstrap';
    import { BarChart, CalendarX } from 'lucide-react';
    import LaporanKategori from '../components/owner/LaporanKategori';
    import LaporanPenitipanHabis from '../components/owner/LaporanPenitipanHabis';
    import LaporanDonasiBarang from '../components/owner/LaporanDonasiBarang';
    import LaporanRequestDonasi from '../components/owner/LaporanRequestDonasi';
    import LaporanTransaksiPenitip from '../components/owner/LaporanTransaksiPenitip';
    

    const OwnerDashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState('laporan-kategori');
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

    const renderMenuItem = (key, icon, label) => (
        <Nav.Link
        onClick={() => setSelectedMenu(key)}
        className={`py-2 px-3 mb-2 rounded d-flex align-items-center transition 
            ${selectedMenu === key ? 'bg-white text-dark border-start border-4 border-primary shadow-sm' : 'text-dark bg-light'} 
            hover-shadow`}
        style={{ fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
        >
        <span className="me-2">{icon}</span>{label}
        </Nav.Link>
    );

    const renderContent = () => {
        switch (selectedMenu) {
        case 'laporan-kategori':
            return <LaporanKategori setToast={setToast} />;
        case 'laporan-habis':
            return <LaporanPenitipanHabis />;
        case 'donasi_barang':
            return <LaporanDonasiBarang />;
        case 'request_barang':
            return <LaporanRequestDonasi />;
        case 'transaksi_penitip':
            return <LaporanTransaksiPenitip />;
        default:
            return <p className="text-muted">Pilih menu di sidebar.</p>;
        }
    };

    return (
        <Container fluid>
        <Row>
            {/* SIDEBAR */}
            <Col md={2} className="bg-white border-end shadow-sm min-vh-100 p-3">
            <div className="text-center mb-3">
                {/* <img
                src="/images/reusemart-logo.jpg"
                alt="ReuseMart Logo"
                style={{ width: '100px' }}
                className="mb-2"
                /> */}
                <h6 className="text-success fw-bold">ReUseMart</h6>
            </div>
            <h6 className="text-primary mb-3">📋 Menu Owner</h6>
            <Nav className="flex-column">
                {renderMenuItem('laporan-kategori', <BarChart size={18} />, 'Laporan per Kategori')}
                {renderMenuItem('laporan-habis', <CalendarX size={18} />, 'Laporan Penitipan Habis')}
                {renderMenuItem('donasi_barang', <BarChart size={18} />, 'Laporan Donasi Barang')}
                {renderMenuItem('request_barang', <CalendarX size={18} />, 'Laporan Request Donasi')}
                {renderMenuItem('transaksi_penitip', <CalendarX size={18} />, 'Laporan Transaksi Penitip')}
            </Nav>
            </Col>

            {/* MAIN CONTENT */}
            <Col md={10} className="p-4 bg-light min-vh-100">
            <h3 className="fw-bold mb-4 border-bottom pb-2">
                {selectedMenu === 'laporan-kategori' && '📊 Laporan Penjualan per Kategori'}
                {selectedMenu === 'laporan-habis' && '📉 Laporan Penitipan Sudah Habis'}
                {selectedMenu === 'donasi_barang' && '📊 Laporan Donasi Barang'}
                {selectedMenu === 'request_barang' && '📉 Laporan Request Donasi'}
                {selectedMenu === 'transaksi_penitip' && '📊 Laporan Transaksi Penitip'}
            </h3>
            {renderContent()}
            </Col>
        </Row>

        {/* TOAST */}
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
        </Container>
    );
    };

    export default OwnerDashboard;
