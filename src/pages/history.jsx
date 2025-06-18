import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Spinner, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Data dummyHistory
const dummyHistory = [
  {
    idTransaksi: 101,
    tanggalTransaksi: '2025-05-14',
    status: 'Selesai',
    totalHarga: 150000,
    metodePengiriman: 'Kurir',
    penitip: { namaPenitip: 'Budi Santoso', email: 'budi.santoso@example.com' },
    detail_transaksi: [
      { namaProduk: 'Kulkas', jumlah: 1, harga: 100000, rating: 5 },
      { namaProduk: 'Setrika', jumlah: 2, harga: 50000, rating: 4 },
    ],
  },
  {
    idTransaksi: 102,
    tanggalTransaksi: '2025-05-12',
    status: 'Selesai',
    totalHarga: 95000,
    metodePengiriman: 'Pickup',
    penitip: { namaPenitip: 'Ani Wijaya', email: 'ani.wijaya@example.com' },
    detail_transaksi: [
      { namaProduk: 'Sepatu', jumlah: 1, harga: 95000, rating: 3 },
      { namaProduk: 'Kulkas', jumlah: 1, harga: 100000, rating: 4 },
    ],
  },
];

// Komponen untuk menampilkan dan mengatur rating bintang
const StarRating = ({ rating, onRate }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="d-flex align-items-center">
      {stars.map((star) => (
        <button
          key={star}
          className="btn p-0 me-1"
          onClick={() => onRate(star)}
          style={{ color: rating >= star ? '#ffc107' : '#e4e5e9', fontSize: '1.2rem' }}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setHistory(dummyHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRating = (trxId, productIndex, newRating) => {
    setHistory((prevHistory) =>
      prevHistory.map((trx) =>
        trx.idTransaksi === trxId
          ? {
              ...trx,
              detail_transaksi: trx.detail_transaksi.map((item, idx) =>
                idx === productIndex ? { ...item, rating: newRating } : item
              ),
            }
          : trx
      )
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading history transaksi...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      {/* Menu Navigasi */}
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" active>
              Riwayat Transaksi
            </Nav.Link>
            <Nav.Link as={Link} to="/buyer-history">
              Riwayat Transaksi Pembeli
            </Nav.Link>
            <Nav.Link as={Link} to="/top-rated">
              Penitip Berperingkat Tinggi
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <h4 className="mb-4">Riwayat Transaksi</h4>
      {history.map((trx, idx) => (
        <Card key={idx} className="mb-4 shadow-sm">
          <Card.Header>
            <strong>ID Transaksi: #{trx.idTransaksi}</strong> | {trx.tanggalTransaksi} | Status: <em>{trx.status}</em>
          </Card.Header>
          <Card.Body>
            <p><strong>Metode Pengiriman:</strong> {trx.metodePengiriman}</p>
            <p><strong>Total Harga:</strong> Rp{trx.totalHarga.toLocaleString()}</p>
            <p><strong>Nama Penitip:</strong> {trx.penitip.namaPenitip}</p>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Jumlah</th>
                  <th>Harga Satuan</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {trx.detail_transaksi.map((item, index) => (
                  <tr key={index}>
                    <td>{item.namaProduk}</td>
                    <td>{item.jumlah}</td>
                    <td>Rp{item.harga.toLocaleString()}</td>
                    <td>
                      <StarRating
                        rating={item.rating}
                        onRate={(newRating) => handleRating(trx.idTransaksi, index, newRating)}
                      />
                      {item.rating ? (
                        <span className="ms-2 text-muted">({item.rating}/5)</span>
                      ) : (
                        <span className="ms-2 text-muted">Belum dirating</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default History;