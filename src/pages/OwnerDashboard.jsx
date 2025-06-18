import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OwnerDashboard = () => {
  const token = localStorage.getItem('token');
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const getRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/request-donasi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Gagal ambil request:', err);
    }
  };

  const getDonatableItems = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/barang-donasi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data.filter(item => item.status === 'barang untuk donasi'));
    } catch (err) {
      console.error('Gagal ambil barang:', err);
    }
  };

  const handleAccept = (requestId) => {
    localStorage.setItem('selectedRequestId', requestId);
    window.location.href = `/donasi/:reqId/:barangId`;
  };

  const handleReject = async (requestId) => {
    try {
      await axios.delete(`http://localhost:8000/api/request-donasi/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('❌ Request ditolak dan dihapus');
      getRequests();
    } catch (err) {
      setMessage('Gagal menolak request');
    }
  };

  const handleShowItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSendItem = () => {
    localStorage.setItem('selectedItemId', selectedItem.id);
    window.location.href = `/form-donasi/${requestId}`;
  };

  useEffect(() => {
    getRequests();
    getDonatableItems();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-gradient" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)' }}>
      <Container fluid className="px-0">
        <Row className="g-0">
          {/* Left Menu */}
          <Col md={2} className="bg-white border-end p-3 shadow-lg rounded-end" style={{ minHeight: '100vh' }}>
            <h5 className="fw-bold text-success mb-4 text-center" style={{ fontSize: '1.2rem' }}>Menu</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <Button
                  variant="outline-primary"
                  className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                  as={Link} to="/owner-dashboard"
                  style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#007bff')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                >
                  📋 Request Donasi
                </Button>
              </li>
              <li className="mb-3">
                <Button
                  variant="outline-success"
                  className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                  as={Link} to="/laporan-penjualan-bulanan"
                  style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#28a745')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                >
                  📊 Laporan Penjualan Bulanan Keseluruhan
                </Button>
              </li>
              <li className="mb-3">
                <Button
                  variant="outline-info"
                  className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                  as={Link} to="/laporan-komisi-bulanan"
                  style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#17a2b8')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                >
                  💰 Laporan Komisi Bulanan per Produk
                </Button>
              </li>
              <li className="mb-3">
                <Button
                  variant="outline-warning"
                  className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                  as={Link} to="/laporan-stok-gudang"
                  style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#ffc107')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                >
                  📦 Laporan Stok Gudang
                </Button>
              </li>
              <li className="mb-3">
                <Button
                  variant="outline-secondary"
                  className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                  as={Link} to="/claim-report"
                  style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#6c757d')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                >
                  📝 Laporan Klaim Merchandise
                </Button>
              </li>
            </ul>
          </Col>

          {/* Main Content */}
          <Col md={10} className="p-4">
            <h3 className="fw-bold text-success" style={{ fontSize: '1.8rem' }}>Dashboard Owner</h3>
            {message && <Alert variant={message.includes('❌') ? 'danger' : 'success'}>{message}</Alert>}

            <h5 className="mb-3">Permintaan Donasi dari Organisasi</h5>
            <Table bordered hover style={{ marginLeft: '0' }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Request</th>
                  <th>Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={req.idReqDonasi}>
                    <td>{index + 1}</td>
                    <td>{req.namaReqDonasi}</td>
                    <td>{req.kategoriReqDonasi}</td>
                    <td>
                      <Button size="sm" variant="success" onClick={() => handleAccept(req.idReqDonasi)}>Acc</Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => handleReject(req.idReqDonasi)}>Tolak</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5 className="mt-4 mb-3">Barang Tersedia untuk Donasi</h5>
            <Row>
              {items.map(item => (
                <Col md={4} key={item.id} className="mb-4">
                  <Card onClick={() => handleShowItem(item)} style={{ cursor: 'pointer', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <Card.Img variant="top" src={`http://localhost:8000/storage/${item.thumbnail}`} />
                    <Card.Body>
                      <Card.Title>{item.namaBarang}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Detail Barang</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedItem && (
                  <>
                    <img
                      src={`http://localhost:8000/storage/${selectedItem.thumbnail}`}
                      alt="Barang"
                      className="img-fluid mb-3"
                    />
                    <p><strong>Nama:</strong> {selectedItem.namaBarang}</p>
                    <p><strong>Deskripsi:</strong> {selectedItem.deskripsi}</p>
                    <p><strong>Status:</strong> {selectedItem.status}</p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Tutup</Button>
                <Button variant="primary" onClick={handleSendItem}>Kirim untuk Donasi</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OwnerDashboard;