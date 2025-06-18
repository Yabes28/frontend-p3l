import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Spinner, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Data dummyHistory (sama seperti di TopRatedProducts)
const dummyHistory = [
  {
    idTransaksi: 101,
    tanggalTransaksi: '2025-05-14',
    status: 'Selesai',
    totalHarga: 150000,
    metodePengiriman: 'Kurir',
    penitip: { namaPenitip: 'Budi Santoso', email: 'budi.santoso@example.com' },
    detail_transaksi: [
      { namaProduk: 'Kulkas', jumlah: 1, harga: 100000, rating: 1 },
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

// Komponen untuk menampilkan bintang rating (hanya display)
const StarRatingDisplay = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="d-flex align-items-center">
      {stars.map((star) => (
        <span
          key={star}
          style={{ color: rating >= star ? '#ffc107' : '#e4e5e9', fontSize: '1.2rem' }}
        >
          ★
        </span>
      ))}
      <span className="ms-2 text-muted">({rating.toFixed(1)}/5)</span>
    </div>
  );
};

const BuyerTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // Format data transaksi dengan rerata rating
      const formattedTransactions = dummyHistory.map((trx) => {
        const ratings = trx.detail_transaksi
          .filter((item) => item.rating !== null)
          .map((item) => item.rating);
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : null;
        return {
          ...trx,
          avgRating,
        };
      });

      setTransactions(formattedTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading riwayat transaksi pembeli...</p>
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
            <Nav.Link as={Link} to="/">
              Riwayat Transaksi
            </Nav.Link>
            <Nav.Link as={Link} to="/buyer-history" active>
              Riwayat Transaksi Pembeli
            </Nav.Link>
            <Nav.Link as={Link} to="/top-rated">
              Penitip Berperingkat Tinggi
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <h4 className="mb-4">Riwayat Transaksi Pembeli</h4>
      {transactions.length === 0 ? (
        <p className="text-muted">Belum ada transaksi.</p>
      ) : (
        transactions.map((trx, idx) => (
          <Card key={idx} className="mb-4 shadow-sm">
            <Card.Header>
              <strong>ID Transaksi: #{trx.idTransaksi}</strong> | {trx.tanggalTransaksi} | Status: <em>{trx.status}</em>
            </Card.Header>
            <Card.Body>
              <p><strong>Metode Pengiriman:</strong> {trx.metodePengiriman}</p>
              <p><strong>Total Harga:</strong> Rp{trx.totalHarga.toLocaleString()}</p>
              <p><strong>Nama Penitip:</strong> {trx.penitip.namaPenitip}</p>
              <p>
                <strong>Rerata Rating:</strong>{' '}
                {trx.avgRating ? (
                  <StarRatingDisplay rating={trx.avgRating} />
                ) : (
                  <span className="text-muted">Belum dirating</span>
                )}
              </p>
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
                        {item.rating ? (
                          <StarRatingDisplay rating={item.rating} />
                        ) : (
                          <span className="text-muted">Belum dirating</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default BuyerTransactionHistory;