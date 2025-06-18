import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Spinner, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Data dummyHistory dengan tambahan field penitip
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

const TopRatedProducts = () => {
  const [topRatedPenitips, setTopRatedPenitips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // Agregasi data untuk menghitung rerata bintang per penitip
      const penitipMap = {};

      dummyHistory.forEach((trx) => {
        const { namaPenitip, email } = trx.penitip;
        if (!penitipMap[namaPenitip]) {
          penitipMap[namaPenitip] = {
            email,
            ratings: [],
          };
        }
        trx.detail_transaksi.forEach((item) => {
          if (item.rating) { // Ambil semua rating, bukan hanya >= 4
            penitipMap[namaPenitip].ratings.push(item.rating);
          }
        });
      });

      // Format data untuk ditampilkan
      const formattedPenitips = Object.keys(penitipMap)
        .map((namaPenitip) => {
          const ratings = penitipMap[namaPenitip].ratings;
          if (ratings.length === 0) return null; // Skip jika tidak ada rating
          const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
          if (avgRating < 4) return null; // Filter hanya penitip dengan rerata >= 4
          return {
            namaPenitip,
            rerataBintang: avgRating,
            email: penitipMap[namaPenitip].email,
          };
        })
        .filter((penitip) => penitip !== null); // Filter out null entries

      setTopRatedPenitips(formattedPenitips);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading penitip dengan rating tinggi...</p>
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
            <Nav.Link as={Link} to="/buyer-history">
              Riwayat Transaksi Pembeli
            </Nav.Link>
            <Nav.Link as={Link} to="/top-rated" active>
              Penitip Berperingkat Tinggi
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <h4 className="mb-4">Penitip dengan Rating 4 ke Atas</h4>
      {topRatedPenitips.length === 0 ? (
        <p className="text-muted">Belum ada penitip dengan rating 4 atau lebih.</p>
      ) : (
        <Card className="shadow-sm">
          <Card.Header>
            <strong>Penitip Berperingkat Tinggi</strong>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Nama Penitip</th>
                  <th>Rerata Bintang</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {topRatedPenitips.map((penitip, index) => (
                  <tr key={index}>
                    <td>{penitip.namaPenitip}</td>
                    <td>
                      <StarRatingDisplay rating={penitip.rerataBintang} />
                    </td>
                    <td>{penitip.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TopRatedProducts;