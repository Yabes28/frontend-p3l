import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Merchandise = () => {
    const [merchandise, setMerchandise] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const getAuthData = () => {
        return {
            token: localStorage.getItem('token'),
            tipe_akun: localStorage.getItem('tipe_akun'),
            pembeliID: localStorage.getItem('pembeliID')
        };
    };

    useEffect(() => {
        const { token, tipe_akun } = getAuthData();
        
        console.log('Debug - localStorage values:', {
            token: token ? 'exists' : 'missing',
            tipe_akun,
            pembeliID: localStorage.getItem('pembeliID')
        });

        if (!token || !tipe_akun) {
            setToastMessage('❌ Anda harus login terlebih dahulu.');
            setToastVariant('danger');
            setShowToast(true);
            setLoading(false);
            return;
        }

        fetch('http://localhost:8000/api/merchandise', {
            headers: {
                Authorization: `Bearer ${token}`,
                'tipe-akun': tipe_akun,
            },
        })
        .then(res => {
            console.log('Merchandise API Response Status:', res.status);
            if (!res.ok) {
                return res.text().then(text => {
                    console.error('Merchandise API Error:', text);
                    throw new Error(`HTTP error! status: ${res.status}, response: ${text}`);
                });
            }
            return res.json();
        })
        .then(data => {
            console.log('Merchandise data:', data);
            setMerchandise(data);
        })
        .catch(err => {
            console.error('Gagal mengambil merchandise:', err);
            setToastMessage('❌ Gagal memuat merchandise. Periksa koneksi atau server.');
            setToastVariant('danger');
            setShowToast(true);
        });

        fetch('http://localhost:8000/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                'tipe-akun': tipe_akun,
            },
        })
        .then(res => {
            console.log('User API Response Status:', res.status);
            if (!res.ok) {
                return res.text().then(text => {
                    console.error('User API Error:', text);
                    throw new Error(`HTTP error! status: ${res.status}, response: ${text}`);
                });
            }
            return res.json();
        })
        .then(data => {
            console.log('User data:', data);
            const newPembeliID = data.user.pembeliID;
            if (newPembeliID) {
                localStorage.setItem('pembeliID', newPembeliID);
            }
            setUserPoints(data.user.poinLoyalitas || 0);
        })
        .catch(err => {
            console.error('Gagal mengambil poin:', err);
            setToastMessage('❌ Gagal memuat poin pengguna.');
            setToastVariant('danger');
            setShowToast(true);
        })
        .finally(() => setLoading(false));
    }, []);

    const handleClaim = (merchandiseID, jumlahPoin) => {
        const { token, tipe_akun, pembeliID } = getAuthData();
        
        console.log('Claim attempt - Auth Data:', { token: token ? 'exists' : 'missing', tipe_akun, pembeliID });

        if (!token || !tipe_akun) {
            setToastMessage('❌ Anda harus login terlebih dahulu.');
            setToastVariant('danger');
            setShowToast(true);
            return;
        }

        if (!pembeliID) {
            setToastMessage('❌ Pembeli ID tidak ditemukan. Silakan login ulang.');
            setToastVariant('danger');
            setShowToast(true);
            return;
        }

        if (userPoints < jumlahPoin) {
            setToastMessage('❌ Poin Anda tidak cukup.');
            setToastVariant('danger');
            setShowToast(true);
            return;
        }

        const selectedMerchandise = merchandise.find(m => m.merchandiseID === merchandiseID);
        if (!selectedMerchandise || selectedMerchandise.stock <= 0) {
            setToastMessage('❌ Stok merchandise habis.');
            setToastVariant('danger');
            setShowToast(true);
            return;
        }

        fetch('http://localhost:8000/api/merchandise/klaim', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'tipe-akun': tipe_akun,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pembeliID,
                merchandiseID,
            }),
        })
        .then(res => {
            console.log('Klaim API Response Status:', res.status);
            if (!res.ok) {
                return res.text().then(text => {
                    console.error('Klaim API Error Text:', text);
                    throw new Error(text || `HTTP error! status: ${res.status}`);
                });
            }
            return res.json();
        })
        .then(data => {
            setToastMessage(data.message || '✅ Klaim berhasil!');
            setToastVariant('success');
            setShowToast(true);
            
            setUserPoints(prev => prev - jumlahPoin);
            setMerchandise(prev => prev.map(m => 
                m.merchandiseID === merchandiseID 
                    ? { ...m, stock: m.stock - 1 } 
                    : m
            ));
        })
        .catch(err => {
            console.error('Gagal mengklaim merchandise:', err);
            setToastMessage(err.message || '❌ Gagal mengklaim merchandise.');
            setToastVariant('danger');
            setShowToast(true);
        });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
                <p className="mt-2">Loading merchandise...</p>
            </div>
        );
    }

    return (
        <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
            <Container fluid className="px-4 px-md-5">
                <div className="mb-4 text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>
                    <Link to="/profile" className="text-secondary text-decoration-none">Profile</Link> / <span className="text-dark">Merchandise</span>
                </div>

                <div className="d-flex justify-content-end mb-4">
                    <h5 className="text-success fw-bold">Total Poin: {userPoints}</h5>
                </div>

                <Row className="gx-4 gy-4">
                    {merchandise.length > 0 ? (
                        merchandise.map(item => (
                            <Col md={4} key={item.merchandiseID}>
                                <Card className="shadow-sm border-0 h-100">
                                    <Card.Img 
                                        variant="top" 
                                        src={item.foto || '/placeholder.jpg'} 
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                            console.log('Image failed to load:', item.foto);
                                        }}
                                    />
                                    <Card.Body className="text-center">
                                        <Card.Title>{item.nama}</Card.Title>
                                        <Card.Text>Poin: {item.jumlahPoin}</Card.Text>
                                        <Card.Text>Stock: {item.stock}</Card.Text>
                                        <Button
                                            variant={userPoints >= item.jumlahPoin && item.stock > 0 ? 'success' : 'secondary'}
                                            disabled={userPoints < item.jumlahPoin || item.stock <= 0}
                                            onClick={() => handleClaim(item.merchandiseID, item.jumlahPoin)}
                                        >
                                            {item.stock <= 0 ? 'Tidak Tersedia' : userPoints >= item.jumlahPoin ? 'Klaim' : 'Poin Kurang'}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p className="text-center">Tidak ada merchandise tersedia.</p>
                        </Col>
                    )}
                </Row>

                <ToastContainer position="bottom-end" className="p-3">
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
                        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Container>
        </div>
    );
};

export default Merchandise;