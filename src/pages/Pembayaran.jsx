import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner, Form, Badge, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';

// Contoh data bank (bisa dari state, props, atau API jika lebih dinamis)
const AVAILABLE_BANKS = [
    { id: 'bca', name: 'Bank BCA', noRek: '123-456-7890', atasNama: 'PT Toko Anda Maju' },
    { id: 'mandiri', name: 'Bank Mandiri', noRek: '098-765-4321', atasNama: 'PT Toko Anda Maju' },
    // Tambahkan bank lain jika ada
];

const COUNTDOWN_MINUTES = 1; // Durasi countdown
const POIN_VALUE_IN_RUPIAH = 10000;

const Pembayaran = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const authToken = localStorage.getItem('token');
    const currentPembeliID = localStorage.getItem('id'); // 'id' adalah kunci yang Anda gunakan saat menyimpan ID pembeli setelah login

    // Data dari halaman checkout
    const [checkoutData, setCheckoutData] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null); // Objek bank yang dipilih

    const [pembeliPoinLoyalitas, setPembeliPoinLoyalitas] = useState(0); // Poin loyalitas user saat ini
    const [poinInginDitukar, setPoinInginDitukar] = useState(''); // Input dari user (string)
    const [nilaiDiskonPoin, setNilaiDiskonPoin] = useState(0);
    const [errorPoin, setErrorPoin] = useState('');

    // Countdown state
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_MINUTES * 60); // dalam detik
    const [timerActive, setTimerActive] = useState(false);
    const [paymentExpired, setPaymentExpired] = useState(false);

    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [error, setError] = useState(null);

    const api = useMemo(() => {
        return axios.create({
            baseURL: 'http://localhost:8000/api', // Sesuaikan dengan URL API Anda
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json', // Default untuk payload JSON
            }
        });
    }, [authToken]);

    const fetchUserPoin = useCallback(async () => {
        if (authToken) {
            try {
                // Ganti dengan endpoint API Anda untuk mengambil data user/pembeli termasuk poinnya
                const response = await api.get(`/pembeli/${currentPembeliID}`); // Atau /auth/user
                setPembeliPoinLoyalitas(response.data.pembeli?.poinLoyalitas || response.data.user?.poinLoyalitas || response.data.poinLoyalitas || 0);
            } catch (err) {
                console.error("Gagal mengambil data poin pengguna:", err);
                // Tidak set error global agar tidak mengganggu alur utama jika poin hanya fitur tambahan
            }
        }
    }, [api, authToken, currentPembeliID]);


    useEffect(() => {
        if (location.state && location.state.cartItems && location.state.grandTotal !== undefined) {
            setCheckoutData(location.state);
            fetchUserPoin(); 
        } else {
            setError("Detail checkout tidak lengkap. Silakan ulangi dari keranjang.");
            // Pertimbangkan untuk mengarahkan pengguna kembali jika data penting tidak ada
            // setTimeout(() => navigate('/cart'), 3000);
        }
    }, [location.state, navigate]);

    // Countdown Timer Logic
    useEffect(() => {
        if (!timerActive || timeLeft <= 0) {
            if (timeLeft <= 0 && timerActive) { // Timer baru saja habis
                setPaymentExpired(true);
                setTimerActive(false);
            }
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timerActive, timeLeft]);

    const grandTotalSetelahDiskon = useMemo(() => {
        if (!checkoutData) return 0;
        return checkoutData.grandTotal - nilaiDiskonPoin;
    }, [checkoutData, nilaiDiskonPoin]);


    const handlePoinInputChange = (e) => {
        const poin = e.target.value;
        setPoinInginDitukar(poin);
        setErrorPoin(''); // Bersihkan error poin setiap kali input berubah

        if (poin === '' || parseInt(poin, 10) === 0) {
            setNilaiDiskonPoin(0);
            return;
        }

        const numPoin = parseInt(poin, 10);
        if (isNaN(numPoin) || numPoin < 0) {
            setErrorPoin("Jumlah poin tidak valid.");
            setNilaiDiskonPoin(0);
            return;
        }
        if (numPoin > pembeliPoinLoyalitas) {
            setErrorPoin(`Poin Anda tidak cukup (tersedia: ${pembeliPoinLoyalitas} poin).`);
            setNilaiDiskonPoin(0);
            return;
        }

        const diskonPotensial = numPoin * POIN_VALUE_IN_RUPIAH;
        // Diskon poin tidak boleh melebihi subtotal produk (sebelum ongkir)
        if (checkoutData && diskonPotensial > (checkoutData.subtotalProduk || 0) ) {
            const maxPoinBisaDitukar = Math.floor((checkoutData.subtotalProduk || 0) / POIN_VALUE_IN_RUPIAH);
            setErrorPoin(`Maksimal poin yang bisa ditukar untuk diskon adalah ${maxPoinBisaDitukar} poin (Rp ${formatCurrency(maxPoinBisaDitukar * POIN_VALUE_IN_RUPIAH)}).`);
            setNilaiDiskonPoin(maxPoinBisaDitukar * POIN_VALUE_IN_RUPIAH); // Set ke diskon maksimal yang mungkin
            setPoinInginDitukar(String(maxPoinBisaDitukar)); // Sesuaikan input field (opsional)
            return;
        }
        setNilaiDiskonPoin(diskonPotensial);
    };

    const handleBankSelection = (bank) => {
        setSelectedBank(bank);
        setTimeLeft(COUNTDOWN_MINUTES * 60); // Reset dan mulai timer
        setTimerActive(true);
        setPaymentExpired(false); // Reset status expired
        setError(null); // Bersihkan error sebelumnya
    };

    const handleConfirmPaymentAndCreateOrder = async () => {
        if (!checkoutData || !checkoutData.cartItems || checkoutData.cartItems.length === 0) {
            setError("Detail keranjang tidak ditemukan atau keranjang kosong.");
            return;
        }
        if (!selectedBank) {
            setError("Silakan pilih bank tujuan transfer terlebih dahulu.");
            return;
        }
        if (paymentExpired) {
            setError("Waktu untuk melanjutkan pembayaran telah habis. Silakan ulangi proses checkout.");
            return;
        }

        setIsProcessingOrder(true);
        setError(null);

        // Persiapkan payload untuk backend.
        // Asumsi: setiap 'item' dalam 'checkoutData.cartItems' memiliki:
        // - item.product_id (ini adalah idProduk yang sebenarnya)
        // - item.price (ini adalah price_at_add, harga saat item dimasukkan ke keranjang)
        // - item.quantity (selalu 1 untuk kasus Anda)
        const orderPayload = {
            cart_items_details: checkoutData.cartItems.map(item => ({
                product_id: item.produkk.idProduk, // Ini harusnya ID produk yang benar (idProduk)
                quantity: 1,                 // Selalu 1 untuk barang unik
                price_at_add: item.produkk.harga     // Ini adalah harga saat item ditambahkan ke keranjang
            })),
            shipping_method: checkoutData.shippingMethod,
            address_id: checkoutData.addressId, // Akan null jika metode 'ambil_sendiri'
            // Backend akan menghitung ulang total, tapi kita kirim sebagai referensi/validasi awal
            // client_subtotal_produk: checkoutData.subtotalProduk,
            // client_shipping_cost: checkoutData.shippingCost,
            // client_grand_total: checkoutData.grandTotal,
            // selected_bank_name: selectedBank.name, // Informasi bank yang dipilih
            penitipID: parseInt(checkoutData.penitipID),
            metodePembayaran: selectedBank.name, // Atau ID/kode bank jika backend mengharapkan itu
            // Jika ada field diskon atau poin yang ingin dikirim dari frontend:
            diskon: nilaiDiskonPoin,
            poin_ditukar: parseInt(poinInginDitukar, 10) || 0,
        };

        try {
            // PANGGIL API UNTUK MEMBUAT ORDER (Uncomment baris ini)
            const response = await api.post('/orders', orderPayload);
            const createdOrder = response.data.order; // Asumsi backend mengembalikan { order: {...} }
            console.log(response.data.order);

            setTimerActive(false); // Hentikan timer lokal setelah order berhasil dibuat

            // Navigasi ke halaman upload bukti, kirim detail order yang baru dibuat
            // Pastikan 'createdOrder.idTransaksi' atau 'createdOrder.id' adalah ID order yang benar
            navigate(`/upload/${createdOrder.idTransaksi || createdOrder.id}`, {
                state: { order: createdOrder } // Kirim seluruh objek order jika diperlukan di halaman selanjutnya
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat pesanan. Stok mungkin telah berubah atau terjadi kesalahan server. Silakan coba lagi dari keranjang.');
            console.error("Error creating order:", err.response?.data, err);
            setTimerActive(false); // Hentikan timer jika gagal
        } finally {
            setIsProcessingOrder(false);
        }
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

    if (!checkoutData && !error) {
        return <Container className="text-center py-5"><Spinner animation="border" /> Memuat Data Checkout...</Container>;
    }
    if (error && !checkoutData) { // Error karena tidak ada checkoutData dari awal
         return (
            <Container className="py-5">
                <Alert variant="danger">
                    {error} <Alert.Link as={Link} to="/cart">Kembali ke keranjang</Alert.Link>
                </Alert>
            </Container>
        );
    }
    // Jika checkoutData ada tapi error muncul kemudian (misal saat submit)
    // error akan ditampilkan di dalam Card.Body

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4" className="text-center bg-light">Pilih Metode Pembayaran</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                            <ListGroup.Item>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>Poin Loyalitas Anda:</span>
                                    <Badge bg="info">{pembeliPoinLoyalitas} Poin</Badge>
                                </div>
                                {pembeliPoinLoyalitas > 0 && checkoutData.subtotalProduk > 0 && (
                                    <Form.Group className="mt-2">
                                        <Form.Label htmlFor="poinInput">Gunakan Poin (1 Poin = {formatCurrency(POIN_VALUE_IN_RUPIAH)}):</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                   type="number"
                                                    id="poinInput"
                                                    value={poinInginDitukar}
                                                    onChange={handlePoinInputChange}
                                                    placeholder="Jumlah poin"
                                                    min="0"
                                                    max={pembeliPoinLoyalitas}
                                                />
                                            <InputGroup.Text>Poin</InputGroup.Text>
                                            </InputGroup>
                                            {errorPoin && <Form.Text className="text-danger">{errorPoin}</Form.Text>}
                                            {nilaiDiskonPoin > 0 && <Form.Text className="text-success d-block">Anda mendapat diskon: {formatCurrency(nilaiDiskonPoin)}</Form.Text>}
                                        </Form.Group>
                                    )}
                            </ListGroup.Item>
                            {checkoutData && (
                                <ListGroup variant="flush" className="mb-3">
                                    <ListGroup.Item><strong>Total Pembayaran:</strong> <span className="fw-bold text-danger fs-5">{formatCurrency(grandTotalSetelahDiskon)}</span></ListGroup.Item>
                                </ListGroup>
                            )}

                            {!selectedBank && !paymentExpired && checkoutData && (
                                <>
                                    <h5 className="mt-3">Pilih Bank Tujuan Transfer:</h5>
                                    {AVAILABLE_BANKS.map(bank => (
                                        <Button
                                            key={bank.id}
                                            variant="outline-primary"
                                            className="d-block w-100 mb-2"
                                            onClick={() => handleBankSelection(bank)} // Kirim seluruh objek bank
                                        >
                                            {bank.name}
                                        </Button>
                                    ))}
                                </>
                            )}

                            {selectedBank && checkoutData && (
                                <div className="mt-3">
                                    <Alert variant={paymentExpired ? "danger" : "info"}>
                                        {paymentExpired ? (
                                            "Waktu untuk melanjutkan pembayaran telah habis. Silakan ulangi proses checkout dari keranjang jika masih berminat."
                                        ) : (
                                            <>
                                                Anda memilih: <strong>{selectedBank.name}</strong><br />
                                                No. Rekening: <span className="fw-bold">{selectedBank.noRek}</span><br />
                                                Atas Nama: <span className="fw-bold">{selectedBank.atasNama}</span><br />
                                                <hr/>
                                                Mohon transfer sejumlah: <strong className="text-danger">{formatCurrency(grandTotalSetelahDiskon)}</strong>
                                                {/* Nomor transaksi akan dibuat oleh backend setelah tombol di bawah diklik */}
                                            </>
                                        )}
                                    </Alert>

                                    {timerActive && !paymentExpired && (
                                        <div className="text-center my-3 p-3 bg-light border rounded">
                                            Sisa Waktu untuk Konfirmasi Pilihan & Pembayaran:
                                            <h2 className="text-danger my-1">{formatTime(timeLeft)}</h2>
                                        </div>
                                    )}

                                    {!paymentExpired && (
                                        <Button
                                            variant="success"
                                            className="w-100 mt-3"
                                            onClick={handleConfirmPaymentAndCreateOrder}
                                            disabled={isProcessingOrder || paymentExpired}
                                        >
                                            {isProcessingOrder ? <><Spinner as="span" animation="border" size="sm" /> Memproses Pesanan...</> : 'Saya Akan Bayar & Buat Pesanan Ini'}
                                        </Button>
                                    )}
                                    {paymentExpired && (
                                         <Button variant="secondary" className="w-100 mt-3" onClick={() => navigate('/cart')}>
                                            Kembali ke Keranjang
                                        </Button>
                                    )}
                                </div>
                            )}
                             <div className="text-center mt-4">
                                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/checkout')}>Kembali ke Info Pengiriman</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Pembayaran;