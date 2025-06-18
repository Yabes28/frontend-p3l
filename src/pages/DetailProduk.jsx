import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import './DetailProduk.css';

const DetailProduk = () => {
  const { id } = useParams(); // ambil id dari URL
  const [produk, setproduk] = useState(null);
  const [diskusiList, setDiskusiList] = useState([]);
  const [newDiskusi, setNewDiskusi] = useState('');
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem('token'); // Assuming token saved here on login
  const pembeliID = localStorage.getItem('id');    // Assuming user ID saved here on login

  const nama = localStorage.getItem('name');

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const [addToCartError, setAddToCartError] = useState('');

  useEffect(() => {
    fetchprodukDetail();
    fetchDiskusi();
    console.log('token', authToken);
    console.log('id', pembeliID);
  }, [id]);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    // If you use Laravel Sanctum with session cookies, set withCredentials:true and remove Authorization headers below
    // withCredentials: true,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const fetchprodukDetail = async () => {
    try {
      // const res = await axios.get(`http://localhost:8000/api/produk/${id}`);
      const res = await axiosInstance.get(`/produk/${id}`);
      setproduk(res.data);
      setLoading(false);
      console.log('id:', res.data);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const fetchDiskusi = async () => {
    try {
      // const res = await axios.get(`http://localhost:8000/api/diskusiProduk/${id}`);
      const res = await axiosInstance.get(`/diskusiProduk/${id}`);
      setDiskusiList(res.data);
      console.log('diskusi',res.data);
    } catch (err) {
      console.error('Error fetch diskusi:', err);
    }
  };

  const handleDiskusiSubmit = async (e) => {
    e.preventDefault();
    if (!newDiskusi.trim()) return;

    try {
      // const pembeliID = localStorage.getItem("pembeliID");
      // await axios.post('http://localhost:8000/api/diskusi', {
      //   produkID: id,
      //   isi: newDiskusi,
      //   pembeliID: pembeliID, // contoh: id pembeli yang login
      // });

      await axiosInstance.post(`/diskusi`,
        {
        produkID: id,
        isi: newDiskusi,
        pembeliID: pembeliID, // contoh: id pembeli yang login
      }
      );
      setNewDiskusi('');
      fetchprodukDetail(); // refresh diskusi
    } catch (err) {
      console.error('Error menambahkan diskusi:', err);
    }
  };

  const handleAddToCart = async () => {
        if (!authToken) {
            setAddToCartError('Silakan login untuk menambahkan produk ke keranjang.');
            // Mungkin arahkan ke halaman login: navigate('/login');
            return;
        }
        if (!produk || produk.status !== 'ada') {
            setAddToCartError('Produk ini tidak tersedia saat ini.');
            return;
        }

        setIsAddingToCart(true);
        setAddToCartMessage('');
        setAddToCartError('');

        try {
            const response = await axiosInstance.post('/active-cart/add', {
                product_id: produk.idProduk, // Sesuai dengan backend controller kita
            });
            setAddToCartMessage(response.data.message || 'Produk berhasil ditambahkan ke keranjang!');
            // Opsional: update jumlah item di ikon keranjang (jika ada, via context/redux)
            // Opsional: arahkan ke halaman keranjang setelah beberapa detik
            // setTimeout(() => navigate('/cart'), 2000);
        } catch (err) {
            console.error('Error adding to cart:', err.response || err);
            setAddToCartError(err.response?.data?.message || 'Gagal menambahkan produk ke keranjang. Coba lagi.');
        } finally {
            setIsAddingToCart(false);
        }
    };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!produk) {
    return <p className="text-center">Produk tidak ditemukan</p>;
  }

  return (
    <div className="produk-detail-page py-4">
      <Container>
        <Row>
          <Col md={5} className="mb-3">
            <img
              src={produk.gambar_url || 'data:image/jpeg;base64,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'}
              alt={produk.namaProduk}
              className="img-fluid rounded shadow-sm"
            />
          </Col>
          <Col md={7}>
            <h3 className="fw-bold">{produk.namaProduk}</h3>
            <p className="text-muted mb-1">{produk.kategori}</p>
            <h4 className="text-success">Rp {produk.harga.toLocaleString('id-ID')}</h4>
            <p>{produk.deskripsi}</p>
            <p><strong>Status:</strong> {produk.status}</p>
            <p><strong>Garansi:</strong> {produk.garansi ? `Sampai ${produk.garansi}` : 'Tidak ada'}</p>
            <div className="mt-4">
              <Button
                variant="success"
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddingToCart || produk.status !== 'ada'}
              >
              {isAddingToCart ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    Menambahkan...
                </>
              ) : (
                'Tambah ke Keranjang'
              )}
              </Button>
              {addToCartMessage && <Alert variant="success" className="mt-3 py-2">{addToCartMessage}</Alert>}
              {addToCartError && <Alert variant="danger" className="mt-3 py-2">{addToCartError}</Alert>}
            </div>
          </Col>
        </Row>

        <hr />

        <h5 className="fw-bold mt-4">Diskusi Produk</h5>
        {diskusiList.length === 0 ? (
          <p className="text-muted">Belum ada diskusi.</p>
        ) : (
          diskusiList.map((diskusi) => (
            <Card key={diskusi.diskusiID} className="mb-2">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  {/* <strong>{diskusi.pembeli?.nama || 'User'}</strong> */}
                  <strong>{nama|| 'User'}</strong>
                  <small className="text-muted">{diskusi.tanggal}</small>
                </div>
                <p className="mb-0">{diskusi.isi}</p>
              </Card.Body>
            </Card>
          ))
        )}

        {/* Form tambah diskusi */}
        <Form onSubmit={handleDiskusiSubmit} className="mt-3">
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={newDiskusi}
              onChange={(e) => setNewDiskusi(e.target.value)}
              placeholder="Tulis pertanyaan atau komentar..."
              required
            />
          </Form.Group>
          <Button type="submit" variant="success" className="mt-2">Kirim Diskusi</Button>
        </Form>
      </Container>
    </div>
  );
};

export default DetailProduk;
