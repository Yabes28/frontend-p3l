import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, Spinner, Card, Alert, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LaporanTransaksiPenitip = ({ setToast }) => {
  // State untuk data
  const [reportData, setReportData] = useState(null);
  const [penitipList, setPenitipList] = useState([]);
  
  // State untuk filter
  const [selectedPenitip, setSelectedPenitip] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State untuk UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch daftar penitip untuk dropdown saat komponen dimuat
  useEffect(() => {
    const fetchPenitip = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/penitip', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPenitipList(res.data);
        if (res.data.length > 0) {
          setSelectedPenitip(res.data[0].penitipID);
        }
      } catch (err) {
        setError('Gagal memuat daftar penitip.');
      }
    };
    fetchPenitip();
  }, []);

  // Fungsi untuk mengambil data laporan berdasarkan filter
  const handleGenerateReport = async () => {
    if (!selectedPenitip) {
      setError('Silakan pilih seorang penitip.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const token = localStorage.getItem('token');
      const params = {
        penitip_id: selectedPenitip,
        bulan: selectedMonth,
        tahun: selectedYear,
      };
      const res = await axios.get('http://localhost:8000/api/laporan/transaksi-penitip', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setReportData(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data laporan.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Opsi untuk filter bulan dan tahun
  const monthOptions = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
    { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
  ];
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = new Date().getFullYear(); i >= 2020; i--) years.push(i);
    return years;
  }, []);

  // Fungsi untuk unduh PDF
  const downloadPDF = () => {
    if (!reportData || reportData.laporan.length === 0) {
      alert('Tidak ada data untuk diunduh.');
      return;
    }

    const doc = new jsPDF();
    const today = new Date();
    const { penitip, laporan } = reportData;

    // Header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('ReUse Mart', 14, 20);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text('Jl. Green Eco Park No. 456 Yogyakarta', 14, 28);
    
    // Judul
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('LAPORAN TRANSAKSI PENITIP', 14, 40);
    const textWidth = doc.getTextWidth('LAPORAN TRANSAKSI PENITIP');
    doc.setLineWidth(0.5);
    doc.line(14, 41, 14 + textWidth, 41);

    // Info Laporan
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`ID Penitip: ${penitip.id}`, 14, 50);
    doc.text(`Nama Penitip: ${penitip.nama}`, 14, 57);
    const bulanNama = monthOptions.find(m => m.value == selectedMonth)?.label;
    doc.text(`Bulan: ${bulanNama}`, 14, 64);
    doc.text(`Tahun: ${selectedYear}`, 14, 71);
    doc.text(`Tanggal Cetak: ${today.toLocaleDateString('id-ID')}`, 14, 78);

    // Tabel
    const tableColumn = ["Kode", "Nama Produk", "Tgl Masuk", "Tgl Laku", "Harga Jual Bersih", "Bonus Cepat", "Pendapatan"];
    const tableRows = laporan.map(item => [
      item.kode_produk || '-',
      item.nama_produk || '-',
      item.tanggal_masuk,
      item.tanggal_laku,
      `Rp ${new Intl.NumberFormat('id-ID').format(item.harga_jual_bersih)}`,
      `Rp ${new Intl.NumberFormat('id-ID').format(item.bonus_terjual_cepat)}`,
      `Rp ${new Intl.NumberFormat('id-ID').format(item.pendapatan)}`,
    ]);
    
    const totalPendapatan = laporan.reduce((sum, item) => sum + item.pendapatan, 0);
    tableRows.push([
        { content: 'TOTAL', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `Rp ${new Intl.NumberFormat('id-ID').format(totalPendapatan)}`, styles: { fontStyle: 'bold' } }
    ]);


    doc.autoTable({
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
    });

    doc.save(`laporan-transaksi-${penitip.nama}-${bulanNama}-${selectedYear}.pdf`);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Laporan Transaksi Penitip</Card.Header>
      <Card.Body>
        <Form>
          <Row className="align-items-end g-3">
            <Col md={4} sm={12}>
              <Form.Group>
                <Form.Label>Pilih Penitip</Form.Label>
                <Form.Select value={selectedPenitip} onChange={(e) => setSelectedPenitip(e.target.value)}>
                  {penitipList.map(p => <option key={p.penitipID} value={p.penitipID}>{p.nama}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} sm={6}>
              <Form.Group>
                <Form.Label>Bulan</Form.Label>
                <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} sm={6}>
              <Form.Group>
                <Form.Label>Tahun</Form.Label>
                <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                   {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} sm={12}>
              <Button variant="primary" onClick={handleGenerateReport} className="w-100">
                Tampilkan
              </Button>
            </Col>
          </Row>
        </Form>
        <hr/>
        {isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {reportData && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                    Laporan untuk: <span className="fw-bold">{reportData.penitip.nama}</span>
                </h5>
                <Button variant="success" onClick={downloadPDF}>⬇️ Unduh PDF</Button>
            </div>
            <Table striped bordered hover responsive="sm">
              <thead className="table-dark">
                <tr>
                  <th>Kode</th>
                  <th>Nama Produk</th>
                  <th>Tgl Masuk</th>
                  <th>Tgl Laku</th>
                  <th>Pendapatan Bersih</th>
                  <th>Bonus</th>
                  <th>Total Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {reportData.laporan.length > 0 ? (
                  reportData.laporan.map((item, index) => (
                    <tr key={index}>
                      <td>{item.kode_produk}</td>
                      <td>{item.nama_produk}</td>
                      <td>{item.tanggal_masuk}</td>
                      <td>{item.tanggal_laku}</td>
                      <td>{new Intl.NumberFormat('id-ID').format(item.harga_jual_bersih)}</td>
                      <td>{new Intl.NumberFormat('id-ID').format(item.bonus_terjual_cepat)}</td>
                      <td>{new Intl.NumberFormat('id-ID').format(item.pendapatan)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="text-center">Tidak ada transaksi pada periode ini.</td></tr>
                )}
              </tbody>
               <tfoot>
                    <tr className="fw-bold table-group-divider">
                        <td colSpan="6" className="text-end">TOTAL PENDAPATAN</td>
                        <td>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                                reportData.laporan.reduce((sum, item) => sum + item.pendapatan, 0)
                            )}
                        </td>
                    </tr>
               </tfoot>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LaporanTransaksiPenitip;
