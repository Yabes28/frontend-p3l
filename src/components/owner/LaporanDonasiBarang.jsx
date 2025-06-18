import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Spinner, Card, Alert, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LaporanDonasiBarang = ({ setToast }) => {
  // State
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Hook untuk mengambil data saat komponen dimuat atau filter tahun berubah
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token otentikasi tidak ditemukan.');

        const res = await axios.get('http://localhost:8000/api/laporan-donasi-barang', {
          headers: { Authorization: `Bearer ${token}` },
          params: { tahun: selectedYear },
        });

        if (!Array.isArray(res.data)) throw new Error('Format data dari server tidak valid.');
        setData(res.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data.';
        setError(errorMessage);
        console.error('❌ Gagal mengambil data laporan:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [selectedYear]);

  // Fungsi untuk unduh PDF
  const downloadPDF = () => {
    if (data.length === 0) {
      alert('Tidak ada data untuk diunduh.');
      return;
    }

    try {
      const doc = new jsPDF();
      const today = new Date();
      
      // Header
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('ReUse Mart', 14, 20);
      doc.setFont(undefined, 'normal');
      doc.text('Jl. Green Eco Park No. 456 Yogyakarta', 14, 28);
      
      // Judul
      const title = 'LAPORAN DONASI BARANG';
      const titleYPosition = 40;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(title, 14, titleYPosition);
      const textWidth = doc.getTextWidth(title);
      doc.setLineWidth(0.5);
      doc.line(14, titleYPosition + 1, 14 + textWidth, titleYPosition + 1);

      // Info Laporan
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      doc.text(`Tahun: ${selectedYear}`, 14, titleYPosition + 8);
      doc.text(`Tanggal Cetak: ${today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, titleYPosition + 15);

      // Tabel
      const tableColumn = ["Kode Produk", "Nama Produk", "ID Penitip", "Nama Penitip", "Tgl Donasi", "Organisasi", "Nama Penerima"];
      const tableRows = data.map(item => [
        item.kode_produk || '-',
        item.nama_produk || '-',
        item.id_penitip || '-',
        item.nama_penitip || '-',
        item.tanggal_donasi || '-',
        item.organisasi || '-',
        item.nama_penerima || '-',
      ]);

      doc.autoTable({
        startY: titleYPosition + 22,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [0, 102, 204], fontStyle: 'bold' },
      });

      doc.save(`laporan-donasi-barang-${selectedYear}.pdf`);
    } catch (err) {
       console.error('❌ Gagal membuat PDF:', err);
       alert('Gagal membuat file PDF.');
    }
  };
  
  // Opsi tahun untuk dropdown
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = new Date().getFullYear(); i >= 2020; i--) years.push(i);
    return years;
  }, []);

  // Render konten utama
  const renderContent = () => {
    if (isLoading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    if (data.length === 0) return <Alert variant="info">Tidak ada data donasi untuk tahun {selectedYear}.</Alert>;
    return (
      <Table striped bordered hover responsive="sm" className="mt-3">
        <thead className="table-dark">
          <tr>
            <th>Kode Produk</th>
            <th>Nama Produk</th>
            <th>ID Penitip</th>
            <th>Nama Penitip</th>
            <th>Tgl Donasi</th>
            <th>Organisasi</th>
            <th>Nama Penerima</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`${item.kode_produk}-${index}`}>
              <td>{item.kode_produk || '-'}</td>
              <td>{item.nama_produk || '-'}</td>
              <td>{item.id_penitip || '-'}</td>
              <td>{item.nama_penitip || '-'}</td>
              <td>{item.tanggal_donasi || '-'}</td>
              <td>{item.organisasi || '-'}</td>
              <td>{item.nama_penerima || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        Laporan Donasi Barang
      </Card.Header>
      <Card.Body>
        <Row className="mb-3 g-3 align-items-end">
            <Col md={3}>
                <Form.Group>
                    <Form.Label>Pilih Tahun</Form.Label>
                    <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col>
                <Button variant="success" onClick={downloadPDF} disabled={isLoading || data.length === 0}>
                    ⬇️ Unduh PDF
                </Button>
            </Col>
        </Row>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default LaporanDonasiBarang;
