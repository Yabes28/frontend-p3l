import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, Button } from 'react-bootstrap';
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

const LaporanStokGudang = () => {
  const reportRef = useRef();
  const canvasRef = useRef();
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
        const response = await axios.get('/api/barang/gudang-stok', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error.response?.data || error.message);
        setError('Gagal memuat data stok dari server. Periksa token atau koneksi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('laporan_stok_gudang.pdf');
    });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} width={window.innerWidth} height={window.innerHeight} />
      <div style={{ position: 'relative', zIndex: 1, padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#2E7D32', fontWeight: 'bold' }}>Laporan Stok Gudang</h3>
        <p style={{ color: '#4CAF50' }}>ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta</p>
        <p style={{ color: '#4CAF50' }}>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
        <p style={{ color: '#757575', fontStyle: 'italic' }}>
          Stok yang bisa dilihat adalah stok per hari ini (sama dengan tanggal cetak). Tidak bisa dilihat stok yang kemarin-kemarin.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          <div ref={reportRef} style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '10px', display: 'inline-block', textAlign: 'left', flex: 1 }}>
            <h4 style={{ color: '#2E7D32' }}>LAPORAN STOK GUDANG</h4>
            {loading ? (
              <p style={{ color: '#6c757d' }}>Memuat data...</p>
            ) : error ? (
              <p style={{ color: '#dc3545' }}>{error}</p>
            ) : data.length === 0 ? (
              <p style={{ color: '#6c757d' }}>Tidak ada stok gudang saat ini.</p>
            ) : (
              <Table bordered style={{ margin: '0' }}>
                <thead>
                  <tr>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Id Penitip</th>
                    <th>Nama Penitip</th>
                    <th>Tanggal Masuk</th>
                    <th>Perpanjangan</th>
                    <th>ID Hunter</th>
                    <th>Nama Hunter</th>
                    <th>Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.kode}</td>
                      <td>{item.namaProduk}</td>
                      <td>{item.penitipID}</td>
                      <td>{item.namaPenitip}</td>
                      <td>{item.tanggalMasuk}</td>
                      <td>{item.perpanjangan ? 'Ya' : 'Tidak'}</td>
                      <td>{item.idHunter || '-'}</td>
                      <td>{item.namaHunter || '-'}</td>
                      <td>{item.harga.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
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

export default LaporanStokGudang;