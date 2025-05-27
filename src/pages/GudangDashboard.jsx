    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import {
    Container, Row, Col, Nav, Card, Button, Badge, Toast, ToastContainer, Modal, Table
    } from 'react-bootstrap';
    import DatePicker from 'react-datepicker';
    import 'react-datepicker/dist/react-datepicker.css';


    const GudangDashboard = () => {
    const [barangs, setBarangs] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [selectedMenu, setSelectedMenu] = useState('barang-diambil');
    const [selectedItem, setSelectedItem] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchBarang = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/gudang-barang-diambil', { headers });
        setBarangs(res.data);
        } catch (error) {
        setToast({ show: true, message: 'Gagal mengambil data barang.', variant: 'danger' });
        }
    };

    const handleAmbil = async (idProduk) => {
        if (!window.confirm('Yakin barang ini telah diambil oleh pemilik?')) return;
        try {
        await axios.put(`http://localhost:8000/api/barang-diterima/${idProduk}`, {}, { headers });
        setToast({ show: true, message: 'Barang ditandai diambil.', variant: 'success' });
        fetchBarang();
        } catch {
        setToast({ show: true, message: 'Gagal mencatat.', variant: 'danger' });
        }
    };

    const handleShowDetail = async (barang) => {
        try {
        const res = await axios.get(`http://localhost:8000/api/barang/${barang.idProduk}`, { headers });
        setSelectedItem(res.data);
        } catch (err) {
        console.error('Gagal ambil detail barang:', err);
        setToast({ show: true, message: 'Gagal ambil detail barang.', variant: 'danger' });
        }
    };

    useEffect(() => {
        if (selectedMenu === 'barang-diambil') fetchBarang();
    }, [selectedMenu]);

    const handleCetakNotaKurir = () => {
        const element = document.getElementById('nota-kurir');
        import('html2canvas').then(html2canvas => {
        import('jspdf').then(({ jsPDF }) => {
            html2canvas.default(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('nota-penjualan-kurir.pdf');
            });
        });
        });
    };

    const handleCetakNotaPembeli = () => {
        const element = document.getElementById('nota-pembeli');
        import('html2canvas').then(html2canvas => {
            import('jspdf').then(({ jsPDF }) => {
            html2canvas.default(element).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('nota-penjualan-pembeli.pdf');
            });
        });
        });
    };

    const renderMenuItem = (key, icon, label) => (
        <Nav.Link
        onClick={() => setSelectedMenu(key)}
        className={`py-2 px-3 mb-2 rounded ${selectedMenu === key ? 'bg-white text-dark border shadow-sm' : 'text-dark bg-light'}`}
        style={{ fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
        >
        <span className="me-2">{icon}</span>{label}
        </Nav.Link>
    );

    const [transaksis, setTransaksis] = useState([]);

    const [kurirs, setKurirs] = useState([]);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const [tanggalKirim, setTanggalKirim] = useState('');
    const [selectedKurir, setSelectedKurir] = useState('');
    const [valid, setValid] = useState(true);

    useEffect(() => {
    if (selectedMenu === 'pengiriman') {
        axios.get('http://localhost:8000/api/kurirs', { headers })
            .then(res => setKurirs(res.data))
            .catch(err => console.error('Gagal ambil kurir:', err));

        axios.get('http://localhost:8000/api/gudang-transaksis', { headers })
            .then(res => setTransaksis(res.data))
            .catch(err => console.error('Gagal ambil transaksi:', err));
    }
    }, [selectedMenu]);

    const [jadwalList, setJadwalList] = useState([]);

    useEffect(() => {
    if (selectedMenu === 'jadwal') {
        axios.get('http://localhost:8000/api/penjadwalans', { headers })
        .then(res => setJadwalList(res.data))
        .catch(err => console.error('Gagal ambil penjadwalan:', err));
    }
    }, [selectedMenu]);


    const [errorMsg, setErrorMsg] = useState('');

    const handleTanggalKirimChange = (e) => {
    const tgl = e.target.value;
    setTanggalKirim(tgl);
    if (!selectedTransaksi) return;

    const jam = parseInt(selectedTransaksi.jamPembelian.split(':')[0]);
    const beli = new Date(selectedTransaksi.tanggalPembelian);
    const kirim = new Date(tgl);
    const sameDay = beli.toDateString() === kirim.toDateString();
    const isInvalid = jam >= 16 && sameDay;
    setValid(!isInvalid);
    };

    const handleKonfirmasiDiterima = async (id) => {
        const yakin = window.confirm("Apakah pembeli sudah menerima barang ini?");
        if (!yakin) return;

        try {
            await axios.put(`http://localhost:8000/api/penjadwalans/${id}/konfirmasi-diterima`, {}, { headers });
            setToast({
            show: true,
            message: '✅ Barang berhasil diterima pembeli.',
            variant: 'success'
            });

            const res = await axios.get('http://localhost:8000/api/penjadwalans', { headers });
            setJadwalList(res.data);
        } catch (err) {
            setToast({
            show: true,
            message: err.response?.data?.message || '❌ Gagal konfirmasi diterima.',
            variant: 'danger'
            });
        }
        };



    const handleUbahStatus = async (id) => {
        const yakin = window.confirm("Yakin ingin menandai jadwal ini sebagai 'dikirim'?");
        if (!yakin) return;

        try {
            await axios.put(`http://localhost:8000/api/penjadwalans/${id}/update-status`, {}, { headers });
            setToast({
            show: true,
            message: '✅ Status penjadwalan berhasil diperbarui.',
            variant: 'success'
            });

            // Refresh data jadwal
            const res = await axios.get('http://localhost:8000/api/penjadwalans', { headers });
            setJadwalList(res.data);
        } catch (err) {
            setToast({
            show: true,
            message: '❌ Gagal memperbarui status.',
            variant: 'danger'
            });
        }
    };

    const handleSimpanJadwal = async () => {
        const yakin = window.confirm(`Apakah Anda yakin ingin menjadwalkan pengiriman untuk ${selectedTransaksi.namaPembeli}?`);
        if (!yakin) return;

        if (!tanggalKirim) {
            setErrorMsg('⚠️ Tanggal pengiriman harus dipilih.');
            return;
        }

        if (!selectedKurir) {
            setErrorMsg('⚠️ Kurir harus dipilih.');
            return;
        }

        const jam = parseInt(selectedTransaksi.jamPembelian.split(':')[0]);
        const beli = new Date(selectedTransaksi.tanggalPembelian);
        const kirim = new Date(tanggalKirim);
        const today = new Date();
        const sameDay = beli.toDateString() === kirim.toDateString();
        const isInvalid = jam >= 16 && sameDay;

        if (isInvalid) {
            setErrorMsg('⚠️ Tidak boleh dikirim hari yang sama karena pembelian di atas jam 4 sore.');
            return;
        }

        if (kirim < new Date(today.setHours(0, 0, 0, 0))) {
            setErrorMsg('⚠️ Tanggal pengiriman tidak boleh sebelum hari ini.');
            return;
        }

        // ✅ Kirim data ke backend
        try {
            await axios.post('http://localhost:8000/api/penjadwalans', {
                transaksiID: selectedTransaksi.idTransaksi,
                pegawaiID: kurirs.find(k => k.nama === selectedKurir)?.pegawaiID || null,
                tipe: 'pengiriman',
                tanggal: tanggalKirim,
                waktu: selectedTransaksi.jamPembelian
            }, { headers });

            setToast({
                show: true,
                message: `✅ Jadwal pengiriman berhasil disimpan untuk ${selectedKurir} pada ${tanggalKirim}`,
                variant: 'success'
            });

            // Reset form
            setTanggalKirim('');
            setSelectedKurir('');
            setSelectedTransaksi(null);
            setErrorMsg('');
        } catch (err) {
            const msg = err.response?.data?.message || '❌ Gagal menyimpan jadwal.';
            setToast({ show: true, message: msg, variant: 'danger' });
        }

        // Panggil ulang data
        axios.get('http://localhost:8000/api/gudang-transaksis', { headers })
        .then(res => setTransaksis(res.data));

    };

    const jadwalForm = () => {
    if (!selectedTransaksi) return <p className="text-muted">Pilih salah satu transaksi.</p>;


    return (
        <div className="bg-white rounded p-4 shadow-sm mt-4" style={{ maxWidth: '600px' }}>
        <h5 className="mb-3">📋 Detail Pengiriman untuk Transaksi #{selectedTransaksi.idTransaksi}</h5>
        
        <div className="mb-2"><strong>Nama:</strong> {selectedTransaksi.namaPembeli}</div>
        <div className="mb-2"><strong>Tanggal Pembelian:</strong> {selectedTransaksi.tanggalPembelian}</div>
        <div className="mb-3"><strong>Jam Pembelian:</strong> {selectedTransaksi.jamPembelian}</div>

        <div className="mb-3">
            <label className="form-label">Tanggal Pengiriman:</label>
            <input
            type="date"
            className="form-control"
            value={tanggalKirim}
            onChange={handleTanggalKirimChange}
            />
            {!valid && (
            <div className="text-danger mt-1">
                ❌ Tidak bisa kirim hari yang sama karena pembelian di atas jam 4 sore.
            </div>
            )}
        </div>

        <div className="mb-3">
            <label className="form-label">Pilih Kurir:</label>
            <select
            className="form-select"
            value={selectedKurir}
            onChange={(e) => setSelectedKurir(e.target.value)}
            >
            <option value="">-- Pilih Kurir --</option>
            {kurirs.map(k => (
                <option key={k.pegawaiID} value={k.nama}>{k.nama}</option>
            ))}
            </select>
        </div>

        <div className="text-end">
            <Button
                variant="success"
                onClick={handleSimpanJadwal}
                >
                Simpan Jadwal
            </Button>

            {errorMsg && (
            <div className="mt-2 text-danger">{errorMsg}</div>
            )}
        </div>
        </div>
    );
    };

    const renderContent = () => {
        switch (selectedMenu) {
        case 'barang-diambil':
            return (
            <>
                <h4 className="mb-4">Barang Menunggu dan Sudah Diambil</h4>
                <Row>
                {barangs.length === 0 ? (
                    <p className="text-muted">Tidak ada barang.</p>
                ) : (
                    barangs.map(item => (
                    <Col lg={4} md={6} sm={12} className="mb-4" key={item.idProduk}>
                        <Card className="border-0 shadow-sm h-100">
                        <Card.Img
                            variant="top"
                            src={item.gambar_url || 'https://via.placeholder.com/300x200'}
                            style={{ height: '200px', objectFit: 'cover' }}
                            onClick={() => handleShowDetail(item)}
                        />
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>{item.namaProduk}</Card.Title>
                            <div className="mb-2 text-muted"><small>Penitip: {item.namaPenitip}</small></div>
                            <div className="mb-2"><strong>Selesai:</strong> {item.tglSelesai}</div>
                            <Badge
                            bg={
                                item.status === 'menunggu diambil' ? 'info' :
                                item.status === 'diambil' ? 'secondary' : 'light'
                            }
                            className="mb-3"
                            style={{ width: 'fit-content' }}
                            >
                            {item.status}
                            </Badge>
                            {item.status === 'menunggu diambil' && (
                            <Button variant="outline-success" size="sm" onClick={() => handleAmbil(item.idProduk)}>
                                Tandai Diambil
                            </Button>
                            )}
                        </Card.Body>
                        </Card>
                    </Col>
                    ))
                )}
                </Row>
            </>
            );
        case 'nota-kurir':
            return (
            <div>
                <h4 className="mb-3">Cetak Nota Penjualan (dibawa oleh kurir)</h4>
                <div id="nota-kurir" className="p-4 bg-white rounded shadow-sm" style={{ width: '600px', fontFamily: 'Arial', fontSize: '14px' }}>
                <h5 className="text-center mb-2">ReUse Mart</h5>
                <p className="text-center">Jl. Green Eco Park No. 456 Yogyakarta</p>
                <hr />
                <p><strong>No Nota:</strong> 25.02.101</p>
                <p><strong>Tanggal Pesan:</strong> 15/2/2025 18:50</p>
                <p><strong>Lunas Pada:</strong> 15/2/2024 19:01</p>
                <p><strong>Tanggal Kirim:</strong> 16/2/2024</p>
                <p><strong>Pembeli:</strong> cath123@gmail.com / Catherine</p>
                <p>Perumahan Griya Persada XII/20, Caturtunggal, Depok, Sleman</p>
                <p>Delivery: Kurir ReUseMart (Cahyono)</p>
                <hr />
                <p>Kompor tanam 3 tungku: Rp2.000.000</p>
                <p>Hair Dryer Ion: Rp500.000</p>
                <p><strong>Total:</strong> Rp2.500.000</p>
                <p>Potongan 200 poin: –Rp20.000</p>
                <p><strong>Total Bayar:</strong> Rp2.480.000</p>
                <p>Poin dari pesanan ini: 297</p>
                <p>Total poin customer: 300</p>
                <br />
                <p><strong>QC oleh:</strong> Farida (P18)</p>
                <p><strong>Diterima oleh:</strong> __________________________</p>
                <p><strong>Tanggal:</strong> __________________</p>
                </div>
                <Button variant="primary" className="mt-3" onClick={handleCetakNotaKurir}>
                Cetak Nota (PDF)
                </Button>
            </div>
            );
        case 'nota-pembeli':
            return (
                <div>
                <h4 className="mb-3">Cetak Nota Penjualan (diambil oleh pembeli)</h4>
                <div id="nota-pembeli" className="p-4 bg-white rounded shadow-sm" style={{ width: '600px', fontFamily: 'Arial', fontSize: '14px' }}>
                    <h5 className="text-center mb-2">ReUse Mart</h5>
                    <p className="text-center">Jl. Green Eco Park No. 456 Yogyakarta</p>
                    <hr />
                    <p><strong>No Nota:</strong> 24.02.101</p>
                    <p><strong>Tanggal Pesan:</strong> 15/2/2025 18:50</p>
                    <p><strong>Lunas Pada:</strong> 15/2/2024 19:01</p>
                    <p><strong>Tanggal Ambil:</strong> 16/2/2024</p>
                    <p><strong>Pembeli:</strong> cath123@gmail.com / Catherine</p>
                    <p>Perumahan Griya Persada XII/20, Caturtunggal, Depok, Sleman</p>
                    <p>Delivery: - (diambil sendiri)</p>
                    <hr />
                    <p>Kompor tanam 3 tungku: Rp2.000.000</p>
                    <p>Hair Dryer Ion: Rp500.000</p>
                    <p><strong>Total:</strong> Rp2.500.000</p>
                    <p>Ongkos Kirim: Rp0</p>
                    <p><strong>Total:</strong> Rp2.500.000</p>
                    <p>Potongan 200 poin: –Rp20.000</p>
                    <p><strong>Total Bayar:</strong> Rp2.480.000</p>
                    <p>Poin dari pesanan ini: 297</p>
                    <p>Total poin customer: 300</p>
                    <br />
                    <p><strong>QC oleh:</strong> Farida (P18)</p>
                    <p><strong>Diambil oleh:</strong> __________________________</p>
                    <p><strong>Tanggal:</strong> __________________</p>
                </div>
                <Button variant="primary" className="mt-3" onClick={handleCetakNotaPembeli}>
                    Cetak Nota (PDF)
                </Button>
                </div>
            );

            case 'pengiriman':
                return (
                    <div>
                    <h4 className="mb-3">Penjadwalan Pengiriman</h4>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pembeli</th>
                            <th>Tanggal</th>
                            <th>Jam</th>
                            <th>Alamat</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transaksis.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                            Tidak ada transaksi pengiriman yang sedang diproses.
                            </td>
                        </tr>
                        ) : (
                        transaksis.map((trx) => (
                            <tr key={trx.idTransaksi}>
                            <td>{trx.idTransaksi}</td>
                            <td>{trx.namaPembeli}</td>
                            <td>{trx.tanggalPembelian}</td>
                            <td>{trx.jamPembelian}</td>
                            <td>{trx.alamat}</td>
                            <td>
                                <Button size="sm" onClick={() => {
                                setSelectedTransaksi(trx);
                                setTanggalKirim('');
                                setSelectedKurir('');
                                setValid(true);
                                }}>
                                Jadwalkan
                                </Button>
                            </td>
                            </tr>
                        ))
                        )}

                        </tbody>
                    </Table>
                    {jadwalForm()}
                    </div>
                );
                case 'jadwal':
                    return (
                        <div>
                        <h4 className="mb-3">📅 Jadwal Pengiriman & Pengambilan</h4>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tanggal</th>
                                <th>Waktu</th>
                                <th>Tipe</th>
                                <th>Status</th>
                                <th>Kurir</th>
                                <th>Pembeli</th>
                                <th>Alamat</th>
                                <th>Produk</th>
                                <th>Diterima</th>

                            </tr>
                            </thead>
                            <tbody>
                            {jadwalList.length === 0 ? (
                                <tr><td colSpan="9" className="text-center text-muted">Belum ada jadwal.</td></tr>
                            ) : (
                                jadwalList.map(j => (
                                <tr key={j.penjadwalanID}>
                                    <td>{j.penjadwalanID}</td>
                                    <td>{j.tanggal}</td>
                                    <td>{j.waktu}</td>
                                    <td>{j.tipe}</td>
                                    <td>
                                        {j.status === 'diproses' ? (
                                            <Button size="sm" variant="outline-success" onClick={() => handleUbahStatus(j.penjadwalanID)}>
                                            Tandai Dikirim
                                            </Button>
                                        ) : j.status === 'dikirim' ? (
                                            <Button size="sm" variant="outline-primary" onClick={() => handleKonfirmasiBerhasil(j.penjadwalanID)}>
                                            Berhasil Dikirim
                                            </Button>
                                        ) : (
                                            <Badge bg="secondary">{j.status}</Badge>
                                        )}
                                        </td>
                                    <td>{j.namaKurir}</td>
                                    <td>{j.namaPembeli}</td>
                                    <td>{j.alamat}</td>
                                    <td>{j.produk.join(', ')}</td>
                                    <td>
                                    {j.status === 'berhasil dikirim' ? (
                                        <Button size="sm" variant="outline-success" onClick={() => handleKonfirmasiDiterima(j.penjadwalanID)}>
                                        Berhasil Diterima
                                        </Button>
                                    ) : j.status === 'selesai' ? (
                                        <Badge bg="success">Selesai</Badge>
                                    ) : (
                                        <Badge bg="light" text="dark">-</Badge>
                                    )}
                                    </td>

                                </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                        </div>
                    );


        default:
            return <p className="text-muted">Pilih menu di sidebar.</p>;
        }
    };

    return (
        <Container fluid>
        <Row>
            <Col md={2} className="bg-white border-end shadow-sm min-vh-100 p-3">
            <h5 className="mb-4 text-success">Menu Gudang</h5>
            <Nav className="flex-column">
                {renderMenuItem('barang-diambil', '📦', 'Barang Diambil')}
                {renderMenuItem('pengiriman', '🚚', 'Penjadwalan Pengiriman')}
                {renderMenuItem('pengambilan', '📥', 'Penjadwalan Pengambilan')}
                {renderMenuItem('nota-kurir', '🧾', 'Cetak Nota (Kurir)')}
                {renderMenuItem('nota-pembeli', '🧾', 'Cetak Nota (Pembeli)')}
                {renderMenuItem('konfirmasi', '✅', 'Konfirmasi Diterima')}
                {renderMenuItem('hangus', '🚫', 'Transaksi Hangus')}
                {renderMenuItem('jadwal', '📅', 'Lihat Jadwal')}

            </Nav>
            </Col>
            <Col md={10} className="p-4 bg-light min-vh-100">
            {renderContent()}
            </Col>
        </Row>

        <Modal show={!!selectedItem} onHide={() => setSelectedItem(null)} size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Detail Barang</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {selectedItem && (
                <>
                <h5>{selectedItem.namaProduk}</h5>
                <p><strong>Penitip:</strong> {selectedItem.namaPenitip || 'Tidak diketahui'}</p>
                <p><strong>Kategori:</strong> {selectedItem.kategori || 'Tidak ada kategori'}</p>
                <p><strong>Harga:</strong> {selectedItem.harga ? `Rp${Number(selectedItem.harga).toLocaleString()}` : 'Tidak ada harga'}</p>
                <p><strong>Deskripsi:</strong> {selectedItem.deskripsi || 'Tidak ada deskripsi.'}</p>
                <p><strong>Garansi:</strong> {selectedItem.garansi || 'Tidak ada garansi.'}</p>
                <p><strong>Tanggal Mulai:</strong> {selectedItem.tglMulai}</p>
                <p><strong>Tanggal Selesai:</strong> {selectedItem.tglSelesai}</p>
                <Row>
                    <Col md={6}><img src={selectedItem.gambar_url} className="img-fluid rounded" alt="Foto 1" /></Col>
                    <Col md={6}><img src={selectedItem.gambar2_url} className="img-fluid rounded" alt="Foto 2" /></Col>
                </Row>
                </>
            )}
            </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </Container>
    );
    };

    export default GudangDashboard;
