import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Alert } from 'react-bootstrap';

const PenitipList = () => {
  const navigate = useNavigate();
  const [penitips, setPenitips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token used:', token); // Debug token
    fetchPenitipData(token);
  }, []);

  const fetchPenitipData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/penitip/list-with-sales', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      console.log('API Response:', response.data); // Debug respons
      setPenitips(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal ambil data penitip', err.response ? err.response.data : err.message);
      setError('Gagal ambil data penitip. Token mungkin tidak valid atau expired.');
      setLoading(false);
    }
  };

  const handleSetTopSeller = async (penitipID) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/api/penitip/${penitipID}/set-top-seller`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      alert('Penitip berhasil ditetapkan sebagai Top Seller!');
      fetchPenitipData(token); // Refresh data
    } catch (err) {
      console.error('Gagal set Top Seller', err);
      setError('Gagal set Top Seller. Coba lagi.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">List Penitip Terdaftar</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID Penitip</th>
            <th>Nama Penitip</th>
            <th>Jumlah Barang Terjual</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {penitips.map((penitip) => (
            <tr key={penitip.penitipID}>
              <td>{penitip.penitipID}</td>
              <td>
                {penitip.nama} {penitip.isTopSeller && <span className="text-yellow-500">⭐ Top Seller</span>}
              </td>
              <td>{penitip.totalSales || 0}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleSetTopSeller(penitip.penitipID)}
                  disabled={penitip.isTopSeller || penitip.penitipID !== (penitips.find(p => p.totalSales === Math.max(...penitips.map(p => p.totalSales)))?.penitipID)}
                >
                  Set Top Seller
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={() => navigate('/admin')}>
        Kembali ke Dashboard
      </Button>
    </div>
  );
};

export default PenitipList;