    import React, { useState } from 'react';
    import { Button, Modal, Table, Spinner } from 'react-bootstrap';
    import axios from 'axios';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';

    const LaporanKategori = ({ setToast }) => {
    const [showModal, setShowModal] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/laporan-penjualan-per-kategori', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.kategori;
        setPreviewData(data);
        setShowModal(true);
        } catch (err) {
        console.error('❌ Gagal ambil data laporan:', err.response?.data || err.message || err);
        if (typeof setToast === 'function') {
            setToast({
            show: true,
            message: '❌ Gagal memuat data laporan.',
            variant: 'danger',
            });
        }
        }
        setLoading(false);
    };

    const downloadPDF = () => {
        const img = new Image();
        img.src = '/images/reusemart-logo.jpg';
        img.onload = () => {
        const doc = new jsPDF();
        const today = new Date();

        doc.addImage(img, 'JPEG', 14, 10, 25, 25);
        doc.setFontSize(12);
        doc.text('ReUse Mart', 50, 15);
        doc.text('Jl. Green Eco Park No. 456 Yogyakarta', 50, 22);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('LAPORAN PENJUALAN PER KATEGORI BARANG', 14, 42);
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Tahun : ${today.getFullYear()}`, 14, 49);
        doc.text(`Tanggal cetak: ${today.toLocaleDateString('id-ID')}`, 14, 56);

        const tableBody = [];
        let totalTerjual = 0;
        let totalBelum = 0;

        Object.entries(previewData).forEach(([kategori, item]) => {
            const jumlahTerjual = item.jumlah_produk || 0;
            const jumlahBelum = item.belum_terjual || 0;
            tableBody.push([kategori, jumlahTerjual, jumlahBelum]);
            totalTerjual += jumlahTerjual;
            totalBelum += jumlahBelum;
        });

        tableBody.push(['Total', totalTerjual, totalBelum]);

        doc.autoTable({
            startY: 62,
            head: [['Kategori', 'Jumlah item terjual', 'Jumlah item belum terjual']],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        });

        doc.save('laporan-penjualan-kategori.pdf');
        setShowModal(false);
        };
    };

    return (
        <div>
        <Button variant="success" onClick={fetchData}>
            ⬇️ Unduh PDF Laporan
        </Button>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton>
            <Modal.Title>Data Laporan Penjualan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {previewData ? (
                <Table striped bordered hover responsive>
                <thead>
                    <tr>
                    <th>Kategori</th>
                    <th>Jumlah item terjual</th>
                    <th>Jumlah item belum terjual</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(previewData).map(([kategori, item]) => (
                    <tr key={kategori}>
                        <td>{kategori}</td>
                        <td>{item.jumlah_produk || 0}</td>
                        <td>{item.belum_terjual || 0}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            ) : (
                <p>Loading data...</p>
            )}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" onClick={downloadPDF}>Download PDF</Button>
            </Modal.Footer>
        </Modal>

        {loading && (
            <div className="mt-3 text-center">
            <Spinner animation="border" variant="success" />
            </div>
        )}
        </div>
    );
    };

    export default LaporanKategori;
