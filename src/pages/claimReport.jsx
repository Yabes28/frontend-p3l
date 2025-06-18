import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

const getToken = () => {
  const keys = ['access_token', 'sanctum_token', 'token', 'auth_token'];
  for (const key of keys) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }
  return null;
};

const ClaimReport = () => {
  const reportRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        setError('Silakan login terlebih dahulu untuk mengakses data.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/transaksimerchandise', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredData = response.data.filter(item => 
          item.merchandise.jumlahPoin === 100
        ).map(item => ({
          ...item,
          merchandiseName: item.merchandise.nama,
          claimDate: item.tanggal_claim,
          pickupDate: item.tanggal_ambil,
        }));
        setData(filteredData);
      } catch (error) {
        setError('Gagal memuat data dari server.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const input = reportRef.current;
    const doc = new jsPDF();
    doc.text('Laporan Klaim Merchandise (Harga Poin 100)', 10, 10);
    doc.autoTable({
      html: input,
      startY: 20,
    });
    doc.save('laporan_klaim_poin_100.pdf');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Laporan Klaim Merchandise</h3>
      <p>Harga Poin: 100</p>
      <div ref={reportRef}>
        {loading ? (
          <p>Memuat data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : data.length === 0 ? (
          <p>Tidak ada data klaim untuk merchandise dengan poin 100.</p>
        ) : (
          <Table bordered>
            <thead>
              <tr>
                <th>Pembeli ID</th>
                <th>Nama Merchandise</th>
                <th>Jumlah Penukaran</th>
                <th>Tanggal Claim</th>
                <th>Tanggal Ambil</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.pembeliID}</td>
                  <td>{item.merchandiseName}</td>
                  <td>{item.jumlah_penukaran}</td>
                  <td>{item.claimDate}</td>
                  <td>{item.pickupDate || 'Belum diambil'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <Button variant="success" onClick={downloadPDF} disabled={loading || error || data.length === 0}>
        Unduh PDF
      </Button>
    </div>
  );
};

export default ClaimReport;