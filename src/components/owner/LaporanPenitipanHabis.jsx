    import React, { useState } from 'react';
    import { Button, Modal, Table, Spinner } from 'react-bootstrap';
    import axios from 'axios';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';

    const LaporanPenitipanHabis = () => {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/laporan-penitipan-habis', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedData = res.data.data;

        if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
            alert('❌ Tidak ada data penitipan habis untuk ditampilkan.');
            return;
        }

        setData(fetchedData);
        setShowModal(true);
        } catch (err) {
        console.error('❌ Gagal ambil data laporan:', err);
        alert('❌ Gagal memuat data laporan.');
        } finally {
        setLoading(false);
        }
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
        doc.text('LAPORAN Barang yang Masa Penitipannya Sudah Habis', 14, 42);

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Tanggal cetak: ${today.toLocaleDateString('id-ID')}`, 14, 49);

        const tableData = data.map(item => [
            item.kode_produk || '-',
            item.nama_produk || '-',
            item.penitip_id || '-',
            item.nama_penitip || '-',
            item.tgl_masuk || '-',
            item.tgl_akhir || '-',
            item.batas_ambil || '-'
        ]);

        doc.autoTable({
            startY: 55,
            head: [[
            'Kode Produk', 'Nama Produk', 'ID Penitip',
            'Nama Penitip', 'Tanggal Masuk', 'Tanggal Akhir', 'Batas Ambil'
            ]],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [220, 53, 69], textColor: 255 }
        });

        doc.save('laporan-penitipan-habis.pdf');
        setShowModal(false);
        };
    };

    return (
        <div>
        <Button variant="danger" onClick={fetchData}>
            ⬇️ Unduh PDF Laporan
        </Button>

        <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            size="xl"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title>Data Laporan Penitipan Habis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="table-responsive">
                <Table striped bordered hover>
                <thead className="table-danger">
                    <tr>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>ID Penitip</th>
                    <th>Nama Penitip</th>
                    <th>Tanggal Masuk</th>
                    <th>Tanggal Akhir</th>
                    <th>Batas Ambil</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                    <tr key={i}>
                        <td>{item.kode_produk}</td>
                        <td>{item.nama_produk}</td>
                        <td>{item.penitip_id}</td>
                        <td>{item.nama_penitip}</td>
                        <td>{item.tgl_masuk}</td>
                        <td>{item.tgl_akhir}</td>
                        <td>{item.batas_ambil}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                Batal
            </Button>
            <Button variant="danger" onClick={downloadPDF}>
                Konfirmasi & Unduh PDF
            </Button>
            </Modal.Footer>
        </Modal>

        {loading && (
            <div className="mt-3 text-center">
            <Spinner animation="border" variant="danger" />
            </div>
        )}
        </div>
    );
    };

    export default LaporanPenitipanHabis;
