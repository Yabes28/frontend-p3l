import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Function to get token from localStorage
const getToken = () => {
  const keys = ['access_token', 'sanctum_token', 'token', 'auth_token'];
  for (const key of keys) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`Found token under key: ${key}`, token);
      return token;
    }
  }
  console.log('No token found in localStorage');
  return null;
};

// Function to calculate commissions based on rules
const calculateCommissions = (item) => {
  const masukDate = new Date(item.tanggalMasuk.split('/').reverse().join('-')); // Convert to YYYY-MM-DD
  const lakuDate = new Date(item.tanggalLaku.split('/').reverse().join('-'));  // Convert to YYYY-MM-DD
  const daysDiff = Math.ceil((lakuDate - masukDate) / (1000 * 60 * 60 * 24));

  if (daysDiff < 7) {
    const baseKomisiReUseMart = item.harga * 0.20;
    const komisiHunter = item.hasHunter ? item.harga * 0.05 : 0;
    const bonusPenitip = baseKomisiReUseMart * 0.10;
    const komisiReUseMart = baseKomisiReUseMart - bonusPenitip;

    return {
      ...item,
      komisiHunter,
      komisiReUseMart,
      bonusPenitip,
    };
  } else {
    const komisiReUseMart = item.harga * 0.30;
    return {
      ...item,
      komisiHunter: 0,
      komisiReUseMart,
      bonusPenitip: 0,
    };
  }
};

const LaporanKomisiBulanan = () => {
  const reportRef = useRef();
  const canvasRef = useRef();
  const [selectedMonth, setSelectedMonth] = useState('Mei');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#e0f7fa');
    gradient.addColorStop(1, '#b2ebf2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        setError('Silakan login terlebih dahulu untuk mengakses data.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/barang/monthly-commissions`, {
          params: { month: selectedMonth, year: 2025 },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data); // Debug API response
        const calculatedData = response.data.map(calculateCommissions);
        setData(calculatedData);
      } catch (error) {
        console.error('Error fetching commission data:', error.response?.data || error.message);
        setError('Gagal memuat data dari server. Periksa token atau koneksi.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const totalKomisiHunter = data.reduce((sum, item) => sum + (item.komisiHunter || 0), 0);
  const totalKomisiReUseMart = data.reduce((sum, item) => sum + (item.komisiReUseMart || 0), 0);
  const totalBonusPenitip = data.reduce((sum, item) => sum + (item.bonusPenitip || 0), 0);

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`laporan_komisi_${selectedMonth}_2025.pdf`);
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} width={window.innerWidth} height={window.innerHeight} />
      <div style={{ position: 'relative', zIndex: 1, padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#2E7D32', fontWeight: 'bold' }}>Laporan Komisi Bulanan per Produk</h3>
        <p style={{ color: '#4CAF50' }}>ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta</p>
        <div style={{ marginBottom: '20px' }}>
          <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ width: '200px', display: 'inline-block' }}>
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
            <option value="April">April</option>
            <option value="Mei">Mei</option>
            <option value="Juni">Juni</option>
            <option value="Juli">Juli</option>
            <option value="Agustus">Agustus</option>
            <option value="September">September</option>
            <option value="Oktober">Oktober</option>
            <option value="November">November</option>
            <option value="Desember">Desember</option>
          </Form.Select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          <div ref={reportRef} style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '10px', display: 'inline-block', textAlign: 'left', flex: 1 }}>
            <h4 style={{ color: '#2E7D32' }}>LAPORAN KOMISI BULANAN</h4>
            <p style={{ color: '#4CAF50' }}>Bulan: {selectedMonth}</p>
            <p style={{ color: '#4CAF50' }}>Tahun: 2025</p>
            <p style={{ color: '#4CAF50' }}>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
            {loading ? (
              <p style={{ color: '#6c757d' }}>Memuat data...</p>
            ) : error ? (
              <p style={{ color: '#dc3545' }}>{error}</p>
            ) : data.length === 0 ? (
              <p style={{ color: '#6c757d' }}>Tidak ada data komisi untuk bulan {selectedMonth}.</p>
            ) : (
              <Table bordered style={{ margin: '0' }}>
                <thead>
                  <tr>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Harga Jual</th>
                    <th>Tanggal Masuk</th>
                    <th>Tanggal Laku</th>
                    <th>Komisi Hunter</th>
                    <th>Komisi ReUseMart</th>
                    <th>Bonus Penitip</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.kode}</td>
                      <td>{item.namaProduk}</td>
                      <td>{item.harga.toLocaleString('id-ID')}</td>
                      <td>{item.tanggalMasuk}</td>
                      <td>{item.tanggalLaku}</td>
                      <td>{item.komisiHunter.toLocaleString('id-ID')}</td>
                      <td>{item.komisiReUseMart.toLocaleString('id-ID')}</td>
                      <td>{item.bonusPenitip.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5"><strong>Total</strong></td>
                    <td>{totalKomisiHunter.toLocaleString('id-ID')}</td>
                    <td>{totalKomisiReUseMart.toLocaleString('id-ID')}</td>
                    <td>{totalBonusPenitip.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </div>
          <Button variant="success" onClick={downloadPDF} disabled={loading || error || data.length === 0} style={{ marginTop: '0', height: 'fit-content', alignSelf: 'flex-start' }}>Unduh PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default LaporanKomisiBulanan;