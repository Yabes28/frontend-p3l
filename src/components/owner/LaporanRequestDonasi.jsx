import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LaporanRequestDonasi = ({ setToast }) => {
  // State untuk menyimpan data, status loading, dan pesan error
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mengambil data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token otentikasi tidak ditemukan.');
        }
        const res = await axios.get('http://localhost:8000/api/laporan-request-donasi', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!Array.isArray(res.data)) {
          throw new Error('Format data dari server tidak valid.');
        }
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
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

  // Fungsi untuk membuat dan mengunduh PDF, sekarang menggunakan data dari state
  const downloadPDF = () => {
    if (data.length === 0) {
      if (typeof setToast === 'function') {
        setToast({
            show: true,
            message: 'Tidak ada data untuk diunduh.',
            variant: 'warning',
        });
      }
      return;
    }

    try {
      const doc = new jsPDF();
      const today = new Date();

      // --- PERUBAHAN TATA LETAK PDF DIMULAI DI SINI ---

      // ✅ Header Laporan (Revisi)
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('ReUse Mart', 14, 20); // Posisi X: 14, Y: 20

      doc.setFont(undefined, 'normal');
      doc.setFontSize(12);
      doc.text('Jl. Green Eco Park No. 456 Yogyakarta', 14, 28);

      // ✅ Judul Laporan (Revisi: Rata Kiri, Bold, Garis Bawah)
      const title = 'LAPORAN REQUEST DONASI';
      const titleYPosition = 40;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(title, 14, titleYPosition);

      // Gambar garis bawah secara manual
      const textWidth = doc.getTextWidth(title);
      doc.setLineWidth(0.5);
      doc.line(14, titleYPosition + 1, 14 + textWidth, titleYPosition + 1);

      // Tanggal Cetak
      doc.setFont(undefined, 'normal'); // Kembalikan style font ke normal
      doc.setFontSize(11);
      doc.text(`Tanggal cetak: ${today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, titleYPosition + 8);


      // ✅ Siapkan Tabel
      const tableColumn = ["ID Organisasi", "Nama", "Alamat", "Request"];
      const tableRows = data.map(item => [
        item.id_organisasi || '-',
        item.nama_organisasi || '-',
        item.alamat_organisasi || '-',
        item.request_barang || '-',
      ]);

      doc.autoTable({
        startY: titleYPosition + 15, // Sesuaikan posisi Y tabel
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 'auto' },
        }
      });

      doc.save(`laporan-request-donasi-${today.toISOString().split('T')[0]}.pdf`);
    } catch (err) {
       console.error('❌ Gagal membuat PDF:', err);
       if (typeof setToast === 'function') {
        setToast({
          show: true,
          message: '❌ Gagal membuat file PDF.',
          variant: 'danger',
        });
      }
    }
  };

  // Fungsi untuk merender konten utama (loading, error, atau tabel)
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-5"><Spinner animation="border" /> <span className="ms-2">Memuat data...</span></div>;
    }

    if (error) {
      return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (data.length === 0) {
      return <Alert variant="info">Tidak ada data request donasi yang belum terpenuhi.</Alert>;
    }

    return (
      <Table striped bordered hover responsive="sm" className="mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID Organisasi</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Request</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`${item.id_organisasi}-${index}`}>
              <td>{item.id_organisasi || '-'}</td>
              <td>{item.nama_organisasi || '-'}</td>
              <td>{item.alamat_organisasi || '-'}</td>
              <td>{item.request_barang || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        Laporan Request Donasi
        <Button variant="success" onClick={downloadPDF} disabled={isLoading || data.length === 0}>
          ⬇️ Unduh PDF
        </Button>
      </Card.Header>
      <Card.Body>
        <Card.Text className="text-muted">
          Berikut adalah daftar semua permintaan donasi dari organisasi yang belum terpenuhi.
        </Card.Text>
        {renderContent()}
      </Card.Body>
      <Card.Footer className="text-muted text-center">
        Tanggal Laporan: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
      </Card.Footer>
    </Card>
  );
};

export default LaporanRequestDonasi;
