import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, Button, Form } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Function to get token from localStorage
const getToken = () => {
  const keys = ['sanctum_token', 'access_token', 'token', 'auth_token']; // Possible keys
  for (const key of keys) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`Found token under key: ${key}`, token); // Debug log
      return token;
    }
  }
  console.log('No token found in localStorage'); // Debug log
  return null;
};

const LaporanPenjualanBulanan = () => {
  const reportRef = useRef();
  const canvasRef = useRef();
  const chartRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up canvas background
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#e0f7fa');
    gradient.addColorStop(1, '#b2ebf2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fetch sales data with authentication
    const fetchSalesData = async () => {
      const token = getToken();
      if (!token) {
        setError('Silakan login terlebih dahulu untuk mengakses data.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/barang/monthly-sales`, {
          params: { year: selectedYear },
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.map(item => ({
          ...item,
          jumlahKotor: parseFloat(item.jumlahKotor) || 0,
        }));
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error.response?.data || error.message);
        setError('Gagal memuat data dari server. Periksa token atau koneksi.');
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedYear]);

  // Calculate totals
  const totalJumlahTerjual = salesData.reduce((sum, item) => sum + (item.jumlahTerjual || 0), 0);
  const totalJumlahKotor = salesData.reduce((sum, item) => sum + (item.jumlahKotor || 0), 0);

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`laporan_penjualan_${selectedYear}.pdf`);
    });
  };

  // Chart configuration
  useEffect(() => {
    if (chartRef.current && salesData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      if (window.myChart) window.myChart.destroy();
      window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: salesData.map(item => item.bulan),
          datasets: [
            {
              label: 'Jumlah Terjual',
              data: salesData.map(item => item.jumlahTerjual),
              backgroundColor: '#4CAF50',
              borderColor: '#388E3C',
              borderWidth: 1,
            },
            {
              label: 'Jumlah Kotor (Rp)',
              data: salesData.map(item => item.jumlahKotor),
              backgroundColor: '#2196F3',
              borderColor: '#1976D2',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Values',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Bulan',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#333',
              },
            },
          },
        },
      });
    }
  }, [salesData]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#2E7D32', fontWeight: 'bold' }}>Laporan Penjualan Bulanan Keseluruhan</h3>
        <p style={{ color: '#4CAF50' }}>ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta</p>
        <div style={{ marginBottom: '20px' }}>
          <Form.Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ width: '200px', display: 'inline-block' }}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Form.Select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          <div
            ref={reportRef}
            style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '10px', display: 'inline-block', textAlign: 'left', flex: 1 }}
          >
            <h4 style={{ color: '#2E7D32' }}>LAPORAN PENJUALAN BULANAN</h4>
            <p style={{ color: '#4CAF50' }}>Tahun: {selectedYear}</p>
            <p style={{ color: '#4CAF50' }}>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
            {loading ? (
              <p style={{ color: '#6c757d' }}>Memuat data...</p>
            ) : error ? (
              <p style={{ color: '#dc3545' }}>{error}</p>
            ) : salesData.length === 0 ? (
              <p style={{ color: '#6c757d' }}>Tidak ada data penjualan untuk tahun {selectedYear}.</p>
            ) : (
              <Table bordered style={{ margin: '0' }}>
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Jumlah Barang Terjual</th>
                    <th>Jumlah Penjualan Kotor</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.bulan}</td>
                      <td>{item.jumlahTerjual || 0}</td>
                      <td>{(item.jumlahKotor || 0).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total</strong></td>
                    <td>{totalJumlahTerjual}</td>
                    <td>{totalJumlahKotor.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </Table>
            )}
            {/* Chart below the table */}
            <div style={{ marginTop: '20px' }}>
              <h5 style={{ color: '#2E7D32' }}>Visualisasi Data Penjualan</h5>
              <div style={{ width: '100%', height: '400px' }}>
                <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </div>
          <Button
            variant="success"
            onClick={downloadPDF}
            disabled={loading || error || salesData.length === 0}
            style={{ marginTop: '0', height: 'fit-content', alignSelf: 'flex-start' }}
          >
            Unduh PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LaporanPenjualanBulanan;