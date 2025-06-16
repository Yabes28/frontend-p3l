// src/pages/Cart.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaTimes, FaShoppingCart } from 'react-icons/fa'; // Tambahkan FaShoppingCart untuk keranjang kosong
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Pastikan axios sudah diinstal

// Asumsi Anda memiliki cara untuk mendapatkan token autentikasi dan ID pengguna saat ini
// import { useAuth } from './AuthContext'; // Contoh jika menggunakan Auth Context

const Cart = () => {
    // const { authToken, user } = useAuth(); // Contoh mendapatkan token dan user
    // Untuk contoh ini, kita akan hardcode sementara atau Anda bisa implementasikan cara Anda sendiri
    // const currentUserId = 1; // GANTI DENGAN ID PENGGUNA AKTUAL ATAU DAPATKAN DARI OBJEK USER
    const authToken = localStorage.getItem('token'); // Assuming token saved here on login
    const currentUserId = localStorage.getItem('id');  
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api', // Ganti dengan URL base API Laravel Anda
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
        }
    });

    // Fungsi untuk mengambil data keranjang dari backend
    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/active-cart');
            setCartItems(response.data);
            console.log(response);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load cart items. Please try again.';
            setError(errorMessage);
            console.error("Error fetching cart items:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    // Ambil data keranjang saat komponen dimuat pertama kali
    useEffect(() => {
        if (authToken) { // Hanya fetch jika ada token
            fetchCartItems();
        } else {
            setError("Authentication required to view cart.");
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken]); // Jalankan ulang jika authToken berubah

    const handleRemove = async (idProduk) => { // Menerima idProduk
        setError(null); // Bersihkan error sebelumnya
        try {
            await api.delete(`/active-cart/item/${idProduk}`); // Kirim idProduk
            // Setelah berhasil menghapus di backend, fetch ulang data keranjang
            // untuk mendapatkan state terbaru dari server.
            fetchCartItems();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to remove item. Please try again.';
            setError(errorMessage);
            console.error("Error removing item:", err.response || err);
        }
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

   const summary = useMemo(() => {
        // Subtotal dihitung dengan menjumlahkan harga setiap item.
        // Kita asumsikan item.price adalah harga per item (price_at_add dari backend).
        const subtotal = cartItems.reduce((sum, item) => sum + (item.produkk.harga || 0), 0);

        // Asumsi shipping cost per item sudah ada di data item.
        // Jika shipping dihitung per total keranjang, logikanya mungkin berbeda.
        const shipping = cartItems.reduce((sum, item) => sum + (item.shipping || 0), 0);

        // Asumsi pajak 1.32% dari subtotal (idealnya ini juga dihitung atau dikonfirmasi oleh backend)
        const tax = Math.round(subtotal * 0.0132);

        // const total = subtotal + shipping + tax;
        const total = subtotal + shipping;

        return { subtotal, shipping, tax, total };
    }, [cartItems]);

    // Contoh fungsi untuk checkout (perlu implementasi lebih lanjut)
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        // Navigasi ke halaman checkout atau panggil API untuk membuat order
        // alert('Proceeding to Checkout (implementation needed).');
        navigate('/checkout');

        // Contoh: history.push('/checkout'); atau panggil fungsi API checkout
    };


    if (!authToken) { // Jika tidak ada token, tampilkan pesan
        return (
             <div className="bg-light py-5" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Container className="text-center py-5">
                    <Alert variant="warning">Please log in to view your cart.</Alert>
                    {/* Tambahkan tombol login jika perlu */}
                </Container>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Spinner animation="border" variant="success" />
                <span className="ms-2 fs-5">Loading your cart...</span>
            </div>
        );
    }

    return (
        <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
            <Container fluid className="px-lg-5 px-md-4 px-3">
                <div className="mb-4 text-muted fw-semibold fs-sm">
                    <span className="text-secondary">Home</span> / <span className="text-dark">Shopping Cart</span>
                </div>

                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">{error}</Alert>}

                <Row className="gx-lg-5 gy-4">
                    <Col lg={8}>
                        <h4 className="mb-4 fw-bold">Your Cart ({cartItems.length} items)</h4>
                        {cartItems.length === 0 && !loading ? (
                            <Card className="shadow-sm text-center">
                                <Card.Body className="py-5">
                                    <FaShoppingCart size={50} className="text-muted mb-3" />
                                    <h5 className="text-muted">Your cart is currently empty.</h5>
                                    <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
                                    {/* Ganti dengan Link dari react-router-dom jika menggunakan SPA routing */}
                                    <Button variant="outline-success" href="/">Continue Shopping</Button>
                                </Card.Body>
                            </Card>
                        ) : (
                            cartItems.map((item) => (
                                // 'item.id' di sini adalah ID dari tabel 'user_active_cart_items'
                                // 'item.product_id' adalah ID dari tabel 'produks' (idProduk)
                                <Card className="mb-3 shadow-sm position-relative" key={item.id}>
                                    <Button
                                        variant="link"
                                        className="position-absolute top-0 end-0 p-2 text-danger"
                                        style={{ fontSize: '0.8rem', zIndex: 1, lineHeight: 1 }}
                                        title="Remove item"
                                        onClick={() => handleRemove(item.product_id)} // Kirim product_id (idProduk)
                                    >
                                        <FaTimes size={18}/>
                                    </Button>
                                    <Card.Body className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                                        <img
                                            src={item.produkk.img || '/placeholder.jpg'} // item.img dari backend
                                            alt={item.name} // item.name dari backend
                                            className="rounded"
                                            style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #eee' }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">{item.produkk?.namaProduk}</h6>
                                            <p className="text-success fw-semibold mb-1">
                                                {formatCurrency(item.produkk?.harga)}
                                                {/* item.quantity dari backend (selalu 1 untuk kasus ini) */}
                                                {item.quantity > 1 && <span className="text-muted ms-2">x {item.quantity}</span>}
                                            </p>
                                            <div className="d-flex gap-2 align-items-center mt-1 flex-wrap">
                                                {/* item.shippingLabel dari backend */}
                                                {item.shippingLabel && <Badge pill bg="info" className="text-uppercase" style={{fontSize: '0.7rem'}}>{item.shippingLabel}</Badge>}
                                                {/* item.stock_status dari backend (status produk: available, in_cart, sold) */}
                                                {item.produkk.status === 'in_cart' ? (
                                                    // Anda perlu menambahkan cart_holder_user_id ke respons API item keranjang
                                                    // dan membandingkannya dengan ID pengguna saat ini di frontend.
                                                    // Untuk contoh ini, kita anggap jika 'in_cart' maka itu milik user ini.
                                                    <Badge pill bg="warning" text="dark" style={{fontSize: '0.7rem'}}>IN YOUR CART</Badge>
                                                ) : (
                                                    <Badge pill bg={item.produkk.status === 'ada' ? 'primary' : 'danger'} style={{fontSize: '0.7rem'}}>{item.produkk.status?.toUpperCase()}</Badge>
                                                )}
                                                 {/* Menampilkan kategori jika ada */}
                                                {item.produkk.kategori && <Badge pill bg="secondary" style={{fontSize: '0.7rem'}}>{item.produkk.kategori}</Badge>}
                                            </div>
                                            {/* Menampilkan deskripsi singkat jika ada */}
                                            {item.produkk.deskripsi && <p className="text-muted small mt-2 mb-0 d-none d-sm-block">{item.produkk.deskripsi.substring(0,100)}{item.produkk.deskripsi.length > 100 ? '...' : ''}</p>}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </Col>

                    <Col lg={4}>
                        {cartItems.length > 0 && (
                            <Card className="shadow-sm border-success sticky-top" style={{top: '20px'}}>
                                <Card.Header className="bg-transparent py-3">
                                    <h5 className="mb-0 fw-bold text-success">Order Summary</h5>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span>Subtotal:</span>
                                        <span className="fw-medium">{formatCurrency(summary.subtotal)}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span>Shipping:</span>
                                        <span className="fw-medium">{formatCurrency(summary.shipping)}</span>
                                    </ListGroup.Item>
                                    {/* <ListGroup.Item className="d-flex justify-content-between">
                                        <span>Est. Tax (1.32%):</span>
                                        <span className="fw-medium">{formatCurrency(summary.tax)}</span>
                                    </ListGroup.Item> */}
                                    <ListGroup.Item className="d-flex justify-content-between fw-bold text-success fs-5 py-3">
                                        <span>ORDER TOTAL:</span>
                                        <span>{formatCurrency(summary.total)}</span>
                                    </ListGroup.Item>
                                </ListGroup>
                                <Card.Body>
                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="w-100 fw-semibold"
                                        disabled={cartItems.length === 0 || loading}
                                        onClick={handleCheckout}
                                    >
                                        PROCEED TO CHECKOUT
                                    </Button>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Cart;