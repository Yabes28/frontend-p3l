import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Komponen placeholder untuk form tambah alamat baru
const AddNewAddressForm = ({ authToken, api, onAddressAdded }) => {
    const [alamatLengkap, setAlamatLengkap] = useState('');
    const [kota, setKota] = useState(''); // Asumsi Yogya saja, atau bisa dropdown
    const [namaPenerima, setNamaPenerima] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const [labelAlamat, setLabelAlamat] = useState('Rumah');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            // Sesuaikan field dengan yang diharapkan backend Anda
            const response = await api.post('/pembeli/addresses', {
                label_alamat: labelAlamat,
                nama_penerima: namaPenerima,
                nomor_telepon: nomorTelepon,
                alamat_lengkap: alamatLengkap,
                kota: kota || 'Yogyakarta', // Default atau validasi
                provinsi: 'DI Yogyakarta', // Default atau validasi
                is_utama: false, // Default, bisa ada pilihan
            });
            onAddressAdded(response.data.data || response.data); // Panggil callback dengan alamat baru
            // Reset form
            setAlamatLengkap(''); setKota(''); setNamaPenerima(''); setNomorTelepon(''); setLabelAlamat('Rumah');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan alamat.');
            console.error("Error saving address:", err.response || err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>Tambah Alamat Baru</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label>Label Alamat (Rumah/Kantor)</Form.Label>
                        <Form.Control type="text" value={labelAlamat} onChange={e => setLabelAlamat(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Nama Penerima</Form.Label>
                        <Form.Control type="text" value={namaPenerima} onChange={e => setNamaPenerima(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Nomor Telepon</Form.Label>
                        <Form.Control type="tel" value={nomorTelepon} onChange={e => setNomorTelepon(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Alamat Lengkap</Form.Label>
                        <Form.Control as="textarea" rows={3} value={alamatLengkap} onChange={e => setAlamatLengkap(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Kota</Form.Label>
                        <Form.Control type="text" value={kota} onChange={e => setKota(e.target.value)} placeholder="Contoh: Yogyakarta" required />
                         {/* Anda bisa ganti dengan dropdown jika ada daftar kota terbatas */}
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Alamat'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};


const Checkout = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('token');
    const pembeliID = localStorage.getItem('id'); // Untuk validasi atau data lain jika perlu

    const [cartItems, setCartItems] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(''); // ID alamat yang dipilih
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(''); // 'kurir' atau 'ambil_sendiri'

    const [subtotalProduk, setSubtotalProduk] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    // Poin (jika diimplementasikan)
    // const [userPoints, setUserPoints] = useState(0);
    // const [pointsToRedeem, setPointsToRedeem] = useState(0);
    // const [discountFromPoints, setDiscountFromPoints] = useState(0);


    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [loadingTotals, setLoadingTotals] = useState(false); // Untuk kalkulasi ongkir
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState(null);

    const api = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:8000/api',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }, [authToken]);

    const calculateSubtotal = useCallback((items) => {
        return items.reduce((sum, item) => sum + (item.produkk.harga || 0), 0);
    }, []);

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            if (authToken) {
                setLoadingCart(true);
                try {
                    const response = await api.get('/active-cart');
                    const items = response.data;
                    setCartItems(items);
                    setSubtotalProduk(calculateSubtotal(items));
                    console.log(items);
                } catch (err) {
                    setError('Gagal memuat keranjang belanja.');
                    console.error("Error fetching cart:", err.response || err);
                } finally {
                    setLoadingCart(false);
                }
            } else {
                 navigate('/login'); // Redirect jika tidak ada token
            }
        };
        fetchCart();
    }, [api, authToken, calculateSubtotal, navigate]);

    // Fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (authToken) {
                setLoadingAddresses(true);
                try {
                    const response = await api.get('/alamat');
                    const addresses = response.data.data || response.data || [];
                    setSavedAddresses(addresses);
                    const defaultAddress = addresses.find(addr => addr.is_utama);
                    if (defaultAddress) {
                        setSelectedAddressId(String(defaultAddress.id)); // Pastikan string jika value radio string
                    } else if (addresses.length > 0) {
                        setSelectedAddressId(String(addresses[0].id)); // Pilih alamat pertama jika tidak ada default
                    }
                } catch (err) {
                    console.error("Error fetching addresses:", err.response || err);
                    // Tidak set error global agar tidak menimpa error keranjang
                } finally {
                    setLoadingAddresses(false);
                }
            }
        };
        fetchAddresses();
    }, [api, authToken]);

    // Recalculate shipping and total when selections change

    useEffect(() => {
        let calculatedShippingCost = 0;

        if (selectedShippingMethod === 'kurir') {
            // Aturan: Kurir hanya untuk Yogyakarta.
            // Untuk kesederhanaan tugas ini, kita asumsikan jika pengguna memilih 'kurir',
            // maka pengiriman valid untuk Yogyakarta dan kita terapkan aturan ongkirnya.
            // Validasi alamat lebih detail bisa ditambahkan jika diperlukan.

            if (subtotalProduk >= 1500000) {
                calculatedShippingCost = 0; // Ongkir gratis
            } else if (subtotalProduk > 0 && subtotalProduk < 1500000) { // Pastikan ada subtotal sebelum kenakan ongkir
                calculatedShippingCost = 100000; // Ongkir Rp 100.000
            } else {
                calculatedShippingCost = 0; // Jika subtotal 0, ongkir 0
            }
        } else if (selectedShippingMethod === 'ambil_sendiri') {
            calculatedShippingCost = 0; // Tidak ada ongkir untuk ambil sendiri
        }
        // Jika tidak ada metode pengiriman dipilih, ongkir tetap 0

        setShippingCost(calculatedShippingCost);

        // Hitung ulang grand total
        // Asumsi pajak 1.32% dari subtotal produk (seperti di summary sebelumnya)
        // Anda bisa memindahkan logika pajak ini ke sini atau menghitungnya terpisah
        const tax = Math.round(subtotalProduk * 0.0132);
        // const calculatedGrandTotal = subtotalProduk + calculatedShippingCost + tax;
        const calculatedGrandTotal = subtotalProduk + calculatedShippingCost;
        setGrandTotal(calculatedGrandTotal);

        // Dependensi useEffect ini akan memicu kalkulasi ulang jika salah satu nilai ini berubah.
        // selectedAddressId dihapus dari dependensi karena kita tidak lagi memanggil API
        // yang bergantung padanya untuk kalkulasi ongkir di sini.
        // Namun, selectedAddressId tetap penting untuk proses checkout final.
    }, [selectedShippingMethod, subtotalProduk, cartItems]);

    const handleAddressAdded = (newAddress) => {
        setSavedAddresses(prev => [...prev, newAddress]);
        setSelectedAddressId(String(newAddress.id));
        setShowNewAddressForm(false);
    };

    const handlePlaceOrder = async () => {
        if (selectedShippingMethod === 'kurir' && !selectedAddressId) {
            setError('Silakan pilih alamat pengiriman.');
            return;
        }
        if (cartItems.length === 0) {
            setError('Keranjang Anda kosong.');
            return;
        }

        setIsPlacingOrder(true);
        setError(null);

        let determinedPenitipID = null;

        if (cartItems.length > 0) {
            const firstItem = cartItems[0];
            // Mencoba mengambil penitipID dari beberapa kemungkinan struktur di dalam item.produkk
            // Sesuaikan ini dengan struktur data PASTI dari API /active-cart Anda
            if (firstItem && firstItem.produkk) {
                if (firstItem.produkk.penitip_id) {
                    determinedPenitipID = firstItem.produkk.penitip_id;
                } else if (firstItem.produkk.penitip && firstItem.produkk.penitip.penitipID) {
                    determinedPenitipID = firstItem.produkk.penitip.penitipID;
                } else if (firstItem.produkk.penitipID) { // Jika penitipID ada langsung di produkk
                    determinedPenitipID = firstItem.produkk.penitipID;
                }
                // Anda bisa menambahkan console.log di sini untuk melihat apa isi firstItem.produkk
                // console.log("First item product details for penitipID:", firstItem.produkk);
            }
        }

        navigate('/pembayaran', {
            state: {
                cartItems: cartItems, // Kirim item keranjang aktual
                subtotalProduk: subtotalProduk,
                shippingCost: shippingCost,
                grandTotal: grandTotal,
                shippingMethod: selectedShippingMethod,
                addressId: selectedAddressId, // Kirim ID alamat jika ada
                penitipID: determinedPenitipID
                // Anda juga bisa mengirim objek alamat lengkap jika perlu ditampilkan ulang
                // selectedAddress: savedAddresses.find(addr => addr.id == selectedAddressId)
            }
        });

        // try {
        //     const response = await api.post('/orders', orderData); // Endpoint untuk membuat order
        //     alert(`Order berhasil dibuat! Nomor Transaksi: ${response.data.order.nomor_transaksi || response.data.nomor_transaksi}`); // Sesuaikan respons
        //     // Kosongkan keranjang di frontend (opsional, backend juga harusnya sudah mengosongkan)
        //     setCartItems([]);
        //     // Arahkan ke halaman sukses order atau detail order
        //     navigate(`/order-success/${response.data.order.id || response.data.id}`); // Sesuaikan
        // } catch (err) {
        //     setError(err.response?.data?.message || 'Gagal membuat pesanan. Silakan coba lagi.');
        //     console.error("Error placing order:", err.response || err);
        // } finally {
        //     setIsPlacingOrder(false);
        // }
    };

    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

    if (loadingCart || loadingAddresses) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Spinner animation="border" variant="success" /> <span className="ms-2 fs-5">Memuat Data Checkout...</span>
            </div>
        );
    }

    return (
        <div className="py-5">
        <Container className="py-5">
            <h2 className="mb-4">Checkout</h2>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            <Row>
                <Col md={7} lg={8}>
                    {/* --- Metode Pengiriman --- */}
                    <Card className="mb-4">
                        <Card.Header as="h5">Metode Pengiriman</Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Form.Check
                                    type="radio"
                                    label="Kurir (Pengiriman Khusus Yogyakarta)"
                                    name="shippingMethod"
                                    value="kurir"
                                    checked={selectedShippingMethod === 'kurir'}
                                    onChange={(e) => setSelectedShippingMethod(e.target.value)}
                                    id="shippingKurir"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Ambil Sendiri di Gudang"
                                    name="shippingMethod"
                                    value="ambil_sendiri"
                                    checked={selectedShippingMethod === 'ambil_sendiri'}
                                    onChange={(e) => setSelectedShippingMethod(e.target.value)}
                                    id="shippingAmbilSendiri"
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* --- Alamat Pengiriman (jika kurir) --- */}
                    {selectedShippingMethod === 'kurir' && (
                        <Card className="mb-4">
                            <Card.Header as="h5">Alamat Pengiriman</Card.Header>
                            <Card.Body>
                                {savedAddresses.length > 0 ? (
                                    <Form.Group>
                                        {savedAddresses.map(address => (
                                            <Card key={address.alamatID} className={`mb-2 address-card ${selectedAddressId === String(address.alamatID) ? 'selected' : ''}`} onClick={() => setSelectedAddressId(String(address.alamatID))}>
                                                <Card.Body className="d-flex align-items-start">
                                                     <Form.Check
                                                        type="radio"
                                                        name="shippingAddress"
                                                        value={String(address.alamatID)}
                                                        checked={selectedAddressId === String(address.alamatID)}
                                                        onChange={() => setSelectedAddressId(String(address.alamatID))}
                                                        id={`address-${address.alamatID}`}
                                                        className="me-2"
                                                    />
                                                    <label htmlFor={`address-${address.alamatID}`} className="w-100" style={{cursor: 'pointer'}}>
                                                        <strong>{address.label_alamat}</strong> ({address.namaPenerima})<br />
                                                        <small>{address.alamat}</small><br />
                                                        <small>Telp: {address.noHpPenerima}</small>
                                                    </label>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Form.Group>
                                ) : (
                                    <p>Tidak ada alamat tersimpan.</p>
                                )}
                                <Button variant="outline-primary" size="sm" className="mt-2" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                                    {showNewAddressForm ? 'Sembunyikan Form' : '+ Tambah Alamat Baru'}
                                </Button>
                                {showNewAddressForm && <AddNewAddressForm api={api} authToken={authToken} onAddressAdded={handleAddressAdded} />}
                            </Card.Body>
                        </Card>
                    )}
                     {/* Anda bisa menambahkan bagian untuk input poin di sini jika sudah siap */}
                </Col>

                {/* --- Ringkasan Pesanan --- */}
                <Col md={5} lg={4}>
                    <Card className="sticky-top" style={{top: '20px'}}>
                        <Card.Header as="h5">Ringkasan Pesanan</Card.Header>
                        <ListGroup variant="flush">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.produkk.idProduk} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="fw-medium">{item.produkk.namaProduk}</small><br/>
                                        <small className="text-muted">1 x {formatCurrency(item.produkk.harga)}</small>
                                    </div>
                                    <small>{formatCurrency(item.produkk.harga)}</small>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>Subtotal Produk</span>
                                <span>{formatCurrency(subtotalProduk)}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>Ongkos Kirim</span>
                                <span>{loadingTotals ? <Spinner size="sm"/> : formatCurrency(shippingCost)}</span>
                            </ListGroup.Item>
                            {/* Jika ada diskon poin
                            <ListGroup.Item className="d-flex justify-content-between text-danger">
                                <span>Diskon Poin</span>
                                <span>-{formatCurrency(discountFromPoints)}</span>
                            </ListGroup.Item>
                            */}
                            <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total</span>
                                <span>{loadingTotals ? <Spinner size="sm"/> : formatCurrency(grandTotal)}</span>
                            </ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Button 
                                variant="success" 
                                size="lg" 
                                className="w-100" 
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || cartItems.length === 0 || (selectedShippingMethod === 'kurir' && !selectedAddressId)}
                            >
                                {isPlacingOrder ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
    );
};

export default Checkout;