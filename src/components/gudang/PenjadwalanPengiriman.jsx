    import React, { useEffect, useState } from 'react';
    import {
    Table,
    Button,
    Toast,
    ToastContainer,
    InputGroup,
    Form,
    Spinner,
    } from 'react-bootstrap';
    import axios from 'axios';

    const PenjadwalanPengiriman = () => {
    const [transaksis, setTransaksis] = useState([]);
    const [kurirs, setKurirs] = useState([]);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const [tanggalKirim, setTanggalKirim] = useState('');
    const [selectedKurir, setSelectedKurir] = useState('');
    const [valid, setValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        setLoading(true);
        try {
        const [kurirRes, trxRes] = await Promise.all([
            axios.get('http://localhost:8000/api/kurirs', { headers }),
            axios.get('http://localhost:8000/api/gudang-transaksis', { headers }),
        ]);
        setKurirs(kurirRes.data);
        setTransaksis(trxRes.data);
        } catch (err) {
        console.error('❌ Gagal ambil data:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleSimpanJadwal = async () => {
        if (!selectedTransaksi || !tanggalKirim || !selectedKurir) {
        setErrorMsg('⚠️ Semua kolom harus diisi.');
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

        const pegawaiID = kurirs.find(k => k.nama === selectedKurir)?.pegawaiID;
        if (!pegawaiID) {
        setErrorMsg('⚠️ Kurir tidak valid.');
        return;
        }

        try {
        await axios.post('http://localhost:8000/api/penjadwalans', {
            transaksiID: selectedTransaksi.idTransaksi,
            pegawaiID,
            tipe: 'pengiriman',
            tanggal: tanggalKirim,
            waktu: selectedTransaksi.jamPembelian
        }, { headers });

        setToast({
            show: true,
            message: `✅ Jadwal pengiriman disimpan untuk ${selectedKurir}`,
            variant: 'success'
        });

        setTanggalKirim('');
        setSelectedKurir('');
        setSelectedTransaksi(null);
        setErrorMsg('');

        fetchData();
        } catch (err) {
        const msg = err.response?.data?.message || '❌ Gagal menyimpan jadwal.';
        setToast({ show: true, message: msg, variant: 'danger' });
        }
    };

    const jadwalForm = () => {
        if (!selectedTransaksi) return null;

        return (
        <div className="bg-white rounded p-4 shadow-sm mt-4" style={{ maxWidth: '600px' }}>
            <h5 className="mb-3">📋 Detail Pengiriman untuk Transaksi #{selectedTransaksi.idTransaksi}</h5>
            <div className="mb-2"><strong>Nama:</strong> {selectedTransaksi.namaPembeli}</div>
            <div className="mb-2"><strong>Tanggal Pembelian:</strong> {selectedTransaksi.tanggalPembelian}</div>
            <div className="mb-3"><strong>Jam Pembelian:</strong> {selectedTransaksi.jamPembelian}</div>

            <Form.Group className="mb-3">
            <Form.Label>Tanggal Pengiriman:</Form.Label>
            <Form.Control type="date" value={tanggalKirim} onChange={handleTanggalKirimChange} />
            {!valid && <div className="text-danger mt-1">❌ Tidak bisa kirim hari yang sama karena pembelian di atas jam 4 sore.</div>}
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Pilih Kurir:</Form.Label>
            <Form.Select value={selectedKurir} onChange={(e) => setSelectedKurir(e.target.value)}>
                <option value="">-- Pilih Kurir --</option>
                {kurirs.map(k => (
                <option key={k.pegawaiID} value={k.nama}>{k.nama}</option>
                ))}
            </Form.Select>
            </Form.Group>

            <div className="text-end">
            <Button variant="success" onClick={handleSimpanJadwal}>Simpan Jadwal</Button>
            {errorMsg && <div className="mt-2 text-danger">{errorMsg}</div>}
            </div>
        </div>
        );
    };

    const filteredTransaksis = transaksis.filter(trx =>
        trx.namaPembeli?.toLowerCase().includes(search.toLowerCase()) ||
        trx.alamat?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
        <h4 className="mb-3">Penjadwalan Pengiriman</h4>

        <InputGroup className="mb-3">
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
            placeholder="Cari nama pembeli atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </InputGroup>

        {loading ? (
            <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div>Memuat data...</div>
            </div>
        ) : (
            <Table striped bordered hover responsive>
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
                {filteredTransaksis.length === 0 ? (
                <tr>
                    <td colSpan="6" className="text-center text-muted">Tidak ada transaksi yang cocok dengan pencarian.</td>
                </tr>
                ) : (
                filteredTransaksis.map((trx) => (
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
                        }}>Jadwalkan</Button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </Table>
        )}

        {jadwalForm()}

        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </div>
    );
    };

    export default PenjadwalanPengiriman;
