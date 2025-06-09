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

const PenjadwalanPengambilan = () => {
  const [transaksis, setTransaksis] = useState([]);
  const [gudangList, setGudangList] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [tanggalAmbil, setTanggalAmbil] = useState('');
  const [waktuAmbil, setWaktuAmbil] = useState('');
  const [selectedGudang, setSelectedGudang] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const trxRes = await axios.get('http://localhost:8000/api/gudang-transaksis-ambil', { headers });
      setTransaksis(trxRes.data);
    } catch (err) {
      console.error("❌ Gagal ambil transaksi:", err);
    }

    try {
      const pegawaiRes = await axios.get('http://localhost:8000/api/gudangs', { headers });
      setGudangList(pegawaiRes.data);
    } catch (err) {
      console.error("❌ Gagal ambil gudang:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimpanPengambilan = async (transaksiID, pegawaiID, tanggal, waktu) => {
    if (!transaksiID || !pegawaiID || !tanggal || !waktu) {
      setErrorMsg("⚠️ Semua data harus diisi.");
      return;
    }

    const yakin = window.confirm(`Apakah Anda yakin ingin menjadwalkan pengambilan?`);
    if (!yakin) return;

    const data = {
      transaksiID,
      pegawaiID,
      tanggal,
      waktu,
    };

    try {
      await axios.post('http://localhost:8000/api/penjadwalans', data, { headers });
      setToast({
        show: true,
        message: '✅ Jadwal pengambilan berhasil disimpan',
        variant: 'success',
      });
      setSelectedTransaksi(null);
      setTanggalAmbil('');
      setWaktuAmbil('');
      setSelectedGudang('');
      setErrorMsg('');
      fetchData();
    } catch (err) {
      console.error("❌ Gagal simpan:", err.response?.data);
      setToast({
        show: true,
        message: err.response?.data?.message || '❌ Gagal menyimpan pengambilan',
        variant: 'danger',
      });
    }
  };

  const jadwalForm = () => {
    if (!selectedTransaksi) return <p className="text-muted">Pilih salah satu transaksi.</p>;

    return (
      <div className="bg-white rounded p-4 shadow-sm mt-4" style={{ maxWidth: '600px' }}>
        <h5 className="mb-3">📋 Detail Pengambilan untuk Transaksi #{selectedTransaksi.transaksiID}</h5>
        <div className="mb-2"><strong>Pembeli:</strong> {selectedTransaksi.namaPembeli}</div>
        <div className="mb-2"><strong>Penitip:</strong> {selectedTransaksi.namaPenitip}</div>
        <div className="mb-3"><strong>Waktu Transaksi:</strong> {selectedTransaksi.waktu_transaksi}</div>
        <div className="mb-3">
          <label className="form-label">Tanggal Pengambilan:</label>
          <input type="date" className="form-control" value={tanggalAmbil} onChange={(e) => setTanggalAmbil(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Waktu Pengambilan:</label>
          <input type="time" className="form-control" value={waktuAmbil} onChange={(e) => setWaktuAmbil(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Pilih Pegawai Gudang:</label>
          <select className="form-select" value={selectedGudang} onChange={(e) => setSelectedGudang(e.target.value)}>
            <option value="">-- Pilih Pegawai Gudang --</option>
            {gudangList.map(g => (
              <option key={g.pegawaiID} value={g.pegawaiID}>{g.nama}</option>
            ))}
          </select>
        </div>
        <div className="text-end">
          <Button variant="success" onClick={() => handleSimpanPengambilan(selectedTransaksi.transaksiID, selectedGudang, tanggalAmbil, waktuAmbil)}>
            Simpan Jadwal Pengambilan
          </Button>
          {errorMsg && <div className="mt-2 text-danger">{errorMsg}</div>}
        </div>
      </div>
    );
  };

  const filteredTransaksis = transaksis.filter(trx =>
    trx.namaPembeli.toLowerCase().includes(search.toLowerCase()) ||
    trx.namaPenitip.toLowerCase().includes(search.toLowerCase()) ||
    trx.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h4 className="mb-3">📥 Penjadwalan Pengambilan Barang</h4>

      <InputGroup className="mb-3">
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          placeholder="Cari nama pembeli, penitip, atau status..."
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
              <th>Penitip</th>
              <th>Waktu</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransaksis.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted">Tidak ada transaksi pengambilan.</td></tr>
            ) : (
              filteredTransaksis.map(trx => (
                <tr key={trx.transaksiID}>
                  <td>{trx.transaksiID}</td>
                  <td>{trx.namaPembeli}</td>
                  <td>{trx.namaPenitip}</td>
                  <td>{trx.waktu_transaksi}</td>
                  <td>{trx.status}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTransaksi(trx);
                        setTanggalAmbil('');
                        setWaktuAmbil('');
                        setSelectedGudang('');
                      }}
                    >
                      Jadwalkan
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {jadwalForm()}

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toast.variant}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default PenjadwalanPengambilan;
