    import React, { useEffect, useState } from 'react';
    import { Table, Button, Badge, Toast, ToastContainer, Form, InputGroup, Spinner } from 'react-bootstrap';
    import axios from 'axios';

    const JadwalList = () => {
    const [jadwalList, setJadwalList] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchJadwal = async () => {
        setLoading(true);
        try {
        const res = await axios.get('http://localhost:8000/api/penjadwalans', { headers });
        setJadwalList(res.data);
        } catch (err) {
        setToast({
            show: true,
            message: '❌ Gagal mengambil data penjadwalan.',
            variant: 'danger',
        });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJadwal();
    }, []);

    const handleUbahStatus = async (id) => {
        if (!window.confirm("Yakin ingin menandai jadwal ini sebagai 'dikirim' atau 'diambil'?")) return;
        try {
        await axios.put(`http://localhost:8000/api/penjadwalans/${id}/update-status`, {}, { headers });
        setToast({
            show: true,
            message: '✅ Status penjadwalan berhasil diperbarui.',
            variant: 'success',
        });
        fetchJadwal();
        } catch (err) {
        setToast({
            show: true,
            message: '❌ Gagal memperbarui status.',
            variant: 'danger',
        });
        }
    };

    const handleKonfirmasiBerhasil = async (id) => {
        if (!window.confirm("Yakin ingin menandai pengiriman ini sebagai 'berhasil dikirim'?")) return;
        try {
        await axios.put(`http://localhost:8000/api/penjadwalans/${id}/berhasil-dikirim`, {}, { headers });
        setToast({
            show: true,
            message: '✅ Status diubah menjadi berhasil dikirim.',
            variant: 'success',
        });
        fetchJadwal();
        } catch (err) {
        setToast({
            show: true,
            message: '❌ Gagal mengkonfirmasi pengiriman.',
            variant: 'danger',
        });
        }
    };

    const handleKonfirmasiDiterima = async (id) => {
        if (!window.confirm("Apakah pembeli sudah menerima barang ini?")) return;
        try {
        await axios.post(`http://localhost:8000/api/penjadwalans/${id}/konfirmasi-diterima`, {}, { headers });
        const jadwal = jadwalList.find(j => j.penjadwalanID === id);
        const transaksiID = jadwal?.transaksiID;
        if (transaksiID) {
            const resKomisi = await axios.get(`http://localhost:8000/api/uji-komisi/${transaksiID}`, { headers });
            const msg = resKomisi.data?.message || '✅ Komisi dihitung.';
            setToast({ show: true, message: msg, variant: 'success' });
        } else {
            setToast({ show: true, message: '⚠️ Komisi tidak dihitung (transaksiID tidak ditemukan).', variant: 'warning' });
        }
        fetchJadwal();
        } catch (err) {
        setToast({
            show: true,
            message: err.response?.data?.message || '❌ Gagal konfirmasi atau hitung komisi.',
            variant: 'danger',
        });
        }
    };

    const filteredJadwal = jadwalList.filter(j =>
        j.status.toLowerCase().includes(search.toLowerCase()) ||
        j.tipe.toLowerCase().includes(search.toLowerCase()) ||
        j.namaKurir?.toLowerCase().includes(search.toLowerCase()) ||
        j.namaPembeli?.toLowerCase().includes(search.toLowerCase()) ||
        j.alamat?.toLowerCase().includes(search.toLowerCase()) ||
        j.produk?.join(', ').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
        <h4 className="mb-3">📅 Jadwal Pengiriman & Pengambilan</h4>

        <InputGroup className="mb-3">
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
            placeholder="Cari status, tipe, pegawai, pembeli, alamat, atau produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </InputGroup>

        {loading ? (
            <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div>Memuat data penjadwalan...</div>
            </div>
        ) : (
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Tipe</th>
                <th>Status</th>
                <th>Pegawai</th>
                <th>Pembeli</th>
                <th>Alamat</th>
                <th>Produk</th>
                <th>Diterima</th>
                </tr>
            </thead>
            <tbody>
                {filteredJadwal.length === 0 ? (
                <tr><td colSpan="10" className="text-center text-muted">Tidak ada jadwal.</td></tr>
                ) : (
                filteredJadwal.map(j => (
                    <tr key={j.penjadwalanID}>
                    <td>{j.penjadwalanID}</td>
                    <td>{j.tanggal}</td>
                    <td>{j.waktu}</td>
                    <td>{j.tipe}</td>
                    <td>
                        {j.status === 'diproses' ? (
                        <Button size="sm" variant="outline-success" onClick={() => handleUbahStatus(j.penjadwalanID)}>
                            {j.tipe === 'pengiriman' ? 'Tandai Dikirim' : 'Tandai Diambil'}
                        </Button>
                        ) : j.status === 'dikirim' || j.status === 'diambil' ? (
                        <Button size="sm" variant="outline-primary" onClick={() => handleKonfirmasiBerhasil(j.penjadwalanID)}>
                            {j.tipe === 'pengiriman' ? 'Berhasil Dikirim' : 'Berhasil Diambil'}
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
                        {(j.status === 'berhasil dikirim' || j.status === 'berhasil diambil') ? (
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
        )}

        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        </div>
    );
    };

    export default JadwalList;
