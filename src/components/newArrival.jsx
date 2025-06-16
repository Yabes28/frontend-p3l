import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './productCard';

const NewArrivalSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/produk')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching produk-diskusi:', err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (product) => {
    // Bisa buka modal, atau pindah halaman. Pilih salah satu:
    // Untuk modal preview:
    // setSelectedProduct(product);
    // setShowModal(true);

    // Untuk navigasi ke halaman detail:
    navigate(`/detailProduk/${product.idProduk}`); // sesuaikan field ID
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const checkGaransi = (garansiDate) => {
    if (!garansiDate) return 'Tidak ada garansi';
    const today = new Date();
    const garansi = new Date(garansiDate);
    return today <= garansi ? 'Masih Bergaransi' : 'Tidak Bergaransi';
  };

  return (
    <section className="py-5 bg-white">
      <Container fluid className="px-4 px-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">NEW ARRIVAL</h4>
          <a href="#" className="text-decoration-none fw-semibold small">View All</a>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {products.map((product, idx) => (
              <Col key={idx} onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
                <ProductCard
                  image={product.gambar_url}
                  title={product.namaProduk}
                  price={product.harga}
                  discount={null}
                  status={product.status}
                />
                <small className="text-muted d-block mt-2">
                  {product.diskusis?.length
                    ? `${product.diskusis.length} Diskusi`
                    : 'Belum ada diskusi'}
                </small>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Optional: Modal Preview (nonaktif jika navigasi langsung) */}
      <Modal show={showModal} onHide={handleClose} centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.namaProduk}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedProduct.gambar_url && (
                <img
                  src={selectedProduct.gambar_url}
                  alt={selectedProduct.namaProduk}
                  className="img-fluid mb-3"
                />
              )}
              <p><strong>Harga:</strong> Rp {selectedProduct.harga.toLocaleString('id-ID')}</p>
              <p><strong>Deskripsi:</strong> {selectedProduct.deskripsi}</p>
              <p><strong>Kategori:</strong> {selectedProduct.kategori}</p>
              <p><strong>Status Produk:</strong> {selectedProduct.status}</p>
              <p><strong>Status Garansi:</strong> {checkGaransi(selectedProduct.garansi)}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleClose}>
                Tutup
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  );
};

export default NewArrivalSection;
