import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Card, Button, Badge, Toast, ToastContainer, Modal, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import NotaPenitipan from './NotaPenitipan'; // Import the NotaPenitipan component

const GudangDashboard = () => {
  const [barangs, setBarangs] = useState([]);
  const [filteredBarangs, setFilteredBarangs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [kurirs, setKurirs] = useState([]);
  const [penitips, setPenitips] = useState([]);
  const [isLoadingPenitips, setIsLoadingPenitips] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingKurirs, setIsLoadingKurirs] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [selectedMenu, setSelectedMenu] = useState('barang-diambil');
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({ penitipID: '', namaProduk: '', deskripsi: '', harga: '', kategoriID: '', garansi: '', kurirID: '', gambar1: null, gambar2: null });
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    namaProduk: '',
    penitipID: '',
    status: '',
    kategoriID: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch functions remain the same
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await axios.get('http://localhost:8000/api/kategori', { headers });
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setToast({ show: true, message: 'Gagal mengambil data kategori.', variant: 'danger' });
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchKurirs = async () => {
    setIsLoadingKurirs(true);
    try {
      const res = await axios.get('http://localhost:8000/api/kurirs', { headers });
      setKurirs(res.data || []);
    } catch (error) {
      console.error('Error fetching kurirs:', error);
      setToast({ show: true, message: 'Gagal mengambil data kurir.', variant: 'danger' });
      setKurirs([]);
    } finally {
      setIsLoadingKurirs(false);
    }
  };

  const fetchPenitips = async () => {
    setIsLoadingPenitips(true);
    try {
      const res = await axios.get('http://localhost:8000/api/penitips', { headers });
      setPenitips(res.data || []);
    } catch (error) {
      console.error('Error fetching penitips:', error);
      setToast({ show: true, message: 'Gagal mengambil data penitip.', variant: 'danger' });
      setPenitips([]);
    } finally {
      setIsLoadingPenitips(false);
    }
  };

  const fetchBarang = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/gudang-barang-diambil', { headers });
      setBarangs(res.data || []);
      setFilteredBarangs(res.data || []);
    } catch (error) {
      console.error('Error fetching barang (diambil):', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal mengambil data barang.', variant: 'danger' });
    }
  };

  const fetchAllBarang = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/gudang', { headers });
      setBarangs(res.data || []);
      setFilteredBarangs(res.data || []);
    } catch (error) {
      console.error('Error fetching all barang:', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal mengambil data barang.', variant: 'danger' });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('penitipID', newItem.penitipID);
    formData.append('namaProduk', newItem.namaProduk);
    formData.append('deskripsi', newItem.deskripsi);
    formData.append('harga', newItem.harga);
    formData.append('kategoriID', newItem.kategoriID);
    formData.append('kurirID', newItem.kurirID || null);
    formData.append('status', 'aktif');
    formData.append('tglMulai', new Date().toISOString().split('T')[0]);
    formData.append('tglSelesai', new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]);
    formData.append('garansi', newItem.garansi);
    formData.append('gambar1', newItem.gambar1);
    formData.append('gambar2', newItem.gambar2);

    try {
      const res = await axios.post('http://localhost:8000/api/gudang', formData, { headers });
      setToast({ show: true, message: 'Barang berhasil ditambahkan.', variant: 'success' });
      if (selectedMenu === 'daftar-barang') {
        fetchAllBarang();
      }
      fetchPenitips();
      setNewItem({ penitipID: '', namaProduk: '', deskripsi: '', harga: '', kategoriID: '', garansi: '', kurirID: '', gambar1: null, gambar2: null });
    } catch (error) {
      console.error('Error creating barang:', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal menambahkan barang.', variant: 'danger' });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('penitipID', editItem.penitipID);
    formData.append('namaProduk', editItem.namaProduk);
    formData.append('deskripsi', editItem.deskripsi);
    formData.append('harga', editItem.harga);
    formData.append('kategoriID', editItem.kategoriID);
    formData.append('kurirID', editItem.kurirID || null);
    formData.append('status', editItem.status);
    formData.append('garansi', editItem.garansi);
    formData.append('tglMulai', editItem.tglMulai);
    formData.append('tglSelesai', editItem.tglSelesai);
    if (editItem.gambar1) formData.append('gambar1', editItem.gambar1);
    if (editItem.gambar2) formData.append('gambar2', editItem.gambar2);

    try {
      const res = await axios.post(`http://localhost:8000/api/gudang/${editItem.idProduk}`, formData, { headers });
      setToast({ show: true, message: 'Barang berhasil diupdate.', variant: 'success' });
      setEditItem(null);
      setBarangs((prevBarangs) =>
        prevBarangs.map((item) => (item.idProduk === res.data.data.idProduk ? res.data.data : item))
      );
      setFilteredBarangs((prevFiltered) =>
        prevFiltered.map((item) => (item.idProduk === res.data.data.idProduk ? res.data.data : item))
      );
      fetchPenitips();
    } catch (error) {
      console.error('Error updating barang:', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal mengupdate barang.', variant: 'danger' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus barang ini?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/gudang/${id}`, { headers });
      setToast({ show: true, message: 'Barang berhasil dihapus.', variant: 'success' });
      setBarangs((prevBarangs) => prevBarangs.filter((item) => item.idProduk !== id));
      setFilteredBarangs((prevFiltered) => prevFiltered.filter((item) => item.idProduk !== id));
      fetchPenitips();
    } catch (error) {
      console.error('Error deleting barang:', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal menghapus barang.', variant: 'danger' });
    }
  };

  const handleClientSearch = () => {
    const filtered = barangs.filter((item) => {
      const searchWords = searchQuery.namaProduk.toLowerCase().trim().split(/\s+/);
      const namaProdukWords = item.namaProduk.toLowerCase().split(/\s+/);
      const matchesNamaProduk = searchQuery.namaProduk
        ? searchWords.every(word => namaProdukWords.some(productWord => productWord.includes(word)))
        : true;

      const matchesPenitip = searchQuery.penitipID
        ? item.penitipID.toString() === searchQuery.penitipID.toString()
        : true;

      const matchesStatus = searchQuery.status ? item.status === searchQuery.status : true;
      
       const matchesKategori = searchQuery.kategoriID
        ? item.kategoriID === parseInt(searchQuery.kategoriID)
        : true;

      return matchesNamaProduk && matchesPenitip && matchesStatus && matchesKategori;
    });
    setFilteredBarangs(filtered);
  };

  const handleShowDetail = async (barang) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/gudang/${barang.idProduk}`, { headers });
      setSelectedItem(res.data);
    } catch (err) {
      console.error('Error fetching item details:', err);
      setToast({
        show: true,
        message: err.response?.data?.message || 'Gagal mengambil detail barang.',
        variant: 'danger',
      });
    }
  };

  const handleAmbil = async (idProduk) => {
    if (!window.confirm('Yakin barang ini telah diambil oleh pemilik?')) return;
    try {
      await axios.put(`http://localhost:8000/api/barang-diterima/${idProduk}`, {}, { headers });
      setToast({ show: true, message: 'Barang ditandai diambil.', variant: 'success' });
      fetchBarang();
    } catch (error) {
      console.error('Error marking barang as diambil:', error);
      setToast({ show: true, message: error.response?.data?.message || 'Gagal mencatat.', variant: 'danger' });
    }
  };

  useEffect(() => {
    if (selectedMenu === 'barang-diambil') {
      fetchBarang();
    }
    if (selectedMenu === 'daftar-barang') {
      fetchAllBarang();
      fetchCategories();
      fetchPenitips();
    }
    if (selectedMenu === 'tambah-barang' || editItem) {
      fetchCategories();
      fetchKurirs();
      fetchPenitips();
    }
  }, [selectedMenu, editItem]);

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
  const [kurirsList, setKurirsList] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [tanggalKirim, setTanggalKirim] = useState('');
  const [selectedKurir, setSelectedKurir] = useState('');
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (selectedMenu === 'pengiriman') {
      axios.get('http://localhost:8000/api/kurirs', { headers })
        .then(res => setKurirsList(res.data))
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

    try {
      await axios.post('http://localhost:8000/api/penjadwalans', {
        transaksiID: selectedTransaksi.idTransaksi,
        pegawaiID: kurirsList.find(k => k.nama === selectedKurir)?.pegawaiID || null,
        tipe: 'pengiriman',
        tanggal: tanggalKirim,
        waktu: selectedTransaksi.jamPembelian
      }, { headers });

      setToast({
        show: true,
        message: `✅ Jadwal pengiriman berhasil disimpan untuk ${selectedKurir} pada ${tanggalKirim}`,
        variant: 'success'
      });

      setTanggalKirim('');
      setSelectedKurir('');
      setSelectedTransaksi(null);
      setErrorMsg('');
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Gagal menyimpan jadwal.';
      setToast({ show: true, message: msg, variant: 'danger' });
    }

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
            {kurirsList.map(k => (
              <option key={k.pegawaiID} value={k.nama}>{k.nama}</option>
            ))}
          </select>
        </div>

        <div className="text-end">
          <Button
            variant="success"
            onClick={handleSimpanJadwal}
            disabled={!valid}
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

  const renderEditForm = () => (
    <Form onSubmit={handleUpdate}>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Label>Penitip</Form.Label>
          <Form.Select
            value={editItem?.penitipID || ''}
            onChange={(e) => setEditItem({ ...editItem, penitipID: e.target.value })}
            required
          >
            <option value="">Pilih Penitip</option>
            {penitips.map(p => (
              <option key={p.penitipID} value={p.penitipID}>{p.nama}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Nama Produk</Form.Label>
          <Form.Control
            type="text"
            value={editItem?.namaProduk || ''}
            onChange={(e) => setEditItem({ ...editItem, namaProduk: e.target.value })}
            required
          />
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Deskripsi</Form.Label>
          <Form.Control
            as="textarea"
            value={editItem?.deskripsi || ''}
            onChange={(e) => setEditItem({ ...editItem, deskripsi: e.target.value })}
          />
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Harga</Form.Label>
          <Form.Control
            type="number"
            value={editItem?.harga || ''}
            onChange={(e) => setEditItem({ ...editItem, harga: e.target.value })}
            required
          />
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Kategori</Form.Label>
          <Form.Select
            value={editItem?.kategoriID || ''}
            onChange={(e) => setEditItem({ ...editItem, kategoriID: e.target.value })}
          >
            <option value="">Pilih Kategori</option>
            {categories.map(c => (
              <option key={c.idKategori} value={c.idKategori}>
                {c.namaKategori}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Kurir</Form.Label>
          <Form.Select
            value={editItem?.kurirID || ''}
            onChange={(e) => setEditItem({ ...editItem, kurirID: e.target.value })}
          >
            <option value="">Pilih Kurir</option>
            {kurirs.map(k => (
              <option key={k.pegawaiID} value={k.pegawaiID}>{k.nama}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Gambar 1</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setEditItem({ ...editItem, gambar1: e.target.files[0] })}
          />
          {editItem?.gambar_url && (
            <img src={editItem.gambar_url} alt="Gambar 1" style={{ maxWidth: '100px', marginTop: '10px' }} />
          )}
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Gambar 2</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setEditItem({ ...editItem, gambar2: e.target.files[0] })}
          />
          {editItem?.gambar2_url && (
            <img src={editItem.gambar2_url} alt="Gambar 2" style={{ maxWidth: '100px', marginTop: '10px' }} />
          )}
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>Garansi (opsional)</Form.Label>
          <Form.Control
            type="date"
            value={editItem?.garansi ? editItem.garansi.split('T')[0] : ''}
            onChange={(e) => setEditItem({ ...editItem, garansi: e.target.value })}
          />
        </Col>
      </Row>
      <Button variant="primary" type="submit">
        Simpan Perubahan
      </Button>
      <Button variant="secondary" onClick={() => setEditItem(null)} className="ms-2">
        Batal
      </Button>
    </Form>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'barang-diambil':
        return (
          <>
            <h4 className="mb-4">Barang Menunggu dan Sudah Diambil</h4>
            <Row>
              {filteredBarangs.length === 0 ? (
                <p className="text-muted">Tidak ada barang.</p>
              ) : (
                filteredBarangs.map(item => (
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
                        <div className="mb-2"><strong>Selesai:</strong> {item.tglSelesai.split('T')[0]}</div>
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
                        <div className="mt-auto d-flex justify-content-between">
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setEditItem(item)}>
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.idProduk)}>
                            Hapus
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </>
        );
      case 'daftar-barang':
        return (
          <>
            <h4 className="mb-4">Daftar Barang</h4>
            <Form className="mb-3">
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Label>Nama Barang</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cari nama barang..."
                    value={searchQuery.namaProduk}
                    onChange={(e) => setSearchQuery({ ...searchQuery, namaProduk: e.target.value })}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Nama Penitip</Form.Label>
                  <Form.Select
                    value={searchQuery.penitipID}
                    onChange={(e) => setSearchQuery({ ...searchQuery, penitipID: e.target.value })}
                  >
                    <option value="">Semua Penitip</option>
                    {penitips.map(p => (
                      <option key={p.penitipID} value={p.penitipID}>
                        {p.nama}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={searchQuery.status}
                    onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}
                  >
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="menunggu diambil">Menunggu Diambil</option>
                    <option value="diambil">Diambil</option>
                    <option value="didonasikan">Didonasikan</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select
                    value={searchQuery.kategoriID}
                    onChange={(e) => setSearchQuery({ ...searchQuery, kategoriID: e.target.value })}
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(c => (
                      <option key={c.idKategori} value={c.idKategori}>
                        {c.namaKategori}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col className="text-end">
                  <Button variant="primary" onClick={handleClientSearch} className="me-2">
                    Cari
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery({ namaProduk: '', penitipID: '', status: '', kategoriID: '' });
                      setFilteredBarangs(barangs);
                    }}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
            <Row>
              {filteredBarangs.length === 0 ? (
                <p className="text-muted">Tidak ada barang.</p>
              ) : (
                filteredBarangs.map(item => (
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
                        <div className="mb-2"><strong>Harga:</strong> Rp {item.harga.toLocaleString()}</div>
                        <Badge
                          bg={
                            item.status === 'aktif' ? 'success' :
                            item.status === 'menunggu diambil' ? 'info' :
                            item.status === 'diambil' ? 'secondary' :
                            item.status === 'didonasikan' ? 'warning' : 'light'
                          }
                          className="mb-3"
                          style={{ width: 'fit-content' }}
                        >
                          {item.status}
                        </Badge>
                        <div className="mt-auto d-flex justify-content-between">
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setEditItem(item)}>
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.idProduk)}>
                            Hapus
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </>
        );
      case 'tambah-barang':
        return (
          <>
            <h4 className="mb-4">Tambah Barang Baru</h4>
            <Form onSubmit={handleCreate}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Penitip</Form.Label>
                  <Form.Select
                    value={newItem.penitipID}
                    onChange={(e) => setNewItem({ ...newItem, penitipID: e.target.value })}
                    required
                  >
                    <option value="">Pilih Penitip</option>
                    {penitips.map(p => (
                      <option key={p.penitipID} value={p.penitipID}>{p.nama}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Nama Produk</Form.Label>
                  <Form.Control
                    type="text"
                    value={newItem.namaProduk}
                    onChange={(e) => setNewItem({ ...newItem, namaProduk: e.target.value })}
                    required
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={newItem.deskripsi}
                    onChange={(e) => setNewItem({ ...newItem, deskripsi: e.target.value })}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Harga</Form.Label>
                  <Form.Control
                    type="number"
                    value={newItem.harga}
                    onChange={(e) => setNewItem({ ...newItem, harga: e.target.value })}
                    required
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select
                    value={newItem.kategoriID}
                    onChange={(e) => setNewItem({ ...newItem, kategoriID: e.target.value })}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => (
                      <option key={c.idKategori} value={c.idKategori}>
                        {c.namaKategori}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Kurir</Form.Label>
                  <Form.Select
                    value={newItem.kurirID}
                    onChange={(e) => setNewItem({ ...newItem, kurirID: e.target.value })}
                  >
                    <option value="">Pilih Kurir</option>
                    {kurirs.map(k => (
                      <option key={k.pegawaiID} value={k.pegawaiID}>{k.nama}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Gambar 1</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewItem({ ...newItem, gambar1: e.target.files[0] })}
                  />
                  {newItem.gambar1 && (
                    <img src={URL.createObjectURL(newItem.gambar1)} alt="Gambar 1" style={{ maxWidth: '100px', marginTop: '10px' }} />
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Gambar 2</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewItem({ ...newItem, gambar2: e.target.files[0] })}
                  />
                  {newItem.gambar2 && (
                    <img src={URL.createObjectURL(newItem.gambar2)} alt="Gambar 2" style={{ maxWidth: '100px', marginTop: '10px' }} />
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Garansi (opsional)</Form.Label>
                  <Form.Control
                    type="date"
                    value={newItem.garansi}
                    onChange={(e) => setNewItem({ ...newItem, garansi: e.target.value })}
                  />
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                Tambah Barang
              </Button>
            </Form>
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
              <p><strong>Delivery:</strong> Kurir ReUseMart (Cahyono)</p>
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
              <p><strong>No Nota:</strong> 25.02.101</p>
              <p><strong>Tanggal Pesan:</strong> 15/2/2025 18:50</p>
              <p><strong>Lunas Pada:</strong> 15/2/2024 19:01</p>
              <p><strong>Tanggal Ambil:</strong> 16/2/2024</p>
              <p><strong>Pembeli:</strong> cath123@gmail.com / Catherine</p>
              <p>Perumahan Griya Persada XII/20, Caturtunggal, Depok, Sleman</p>
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
            <Button variant="primary" className="mt-3" onClick={handleCetakNotaPembeli}>
              Cetak Nota (PDF)
            </Button>
          </div>
        );
      case 'pengiriman':
        return (
          <>
            <h4 className="mb-4">Jadwalkan Pengiriman</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Nama Pembeli</th>
                  <th>Tanggal Pembelian</th>
                  <th>Jam Pembelian</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksis.map(t => (
                  <tr key={t.idTransaksi}>
                    <td>{t.idTransaksi}</td>
                    <td>{t.namaPembeli}</td>
                    <td>{t.tanggalPembelian}</td>
                    <td>{t.jamPembelian}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => setSelectedTransaksi(t)}
                      >
                        Pilih
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {jadwalForm()}
          </>
        );
      case 'jadwal':
        return (
          <>
            <h4 className="mb-4">Jadwal Pengiriman</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID Jadwal</th>
                  <th>Transaksi ID</th>
                  <th>Kurir</th>
                  <th>Tanggal</th>
                  <th>Waktu</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwalList.map(j => (
                  <tr key={j.idPenjadwalan}>
                    <td>{j.idPenjadwalan}</td>
                    <td>{j.transaksiID}</td>
                    <td>{j.pegawai?.nama || 'Tidak ada kurir'}</td>
                    <td>{j.tanggal}</td>
                    <td>{j.waktu}</td>
                    <td>{j.status}</td>
                    <td>
                      {j.status === 'menunggu' && (
                        <Button variant="warning" size="sm" onClick={() => handleUbahStatus(j.idPenjadwalan)} className="me-2">
                          Tandai Dikirim
                        </Button>
                      )}
                      {j.status === 'dikirim' && (
                        <Button variant="success" size="sm" onClick={() => handleKonfirmasiDiterima(j.idPenjadwalan)}>
                          Konfirmasi Diterima
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        );
      case 'nota-penitip':
        return <NotaPenitipan />;
      default:
        return <p className="text-muted">Pilih menu untuk melanjutkan.</p>;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <Nav className="flex-column bg-light p-3 rounded shadow-sm">
            {renderMenuItem('barang-diambil', '📦', 'Barang Diambil')}
            {renderMenuItem('daftar-barang', '📋', 'Daftar Barang')}
            {renderMenuItem('tambah-barang', '➕', 'Tambah Barang')}
            {renderMenuItem('nota-kurir', '📄', 'Nota Kurir')}
            {renderMenuItem('nota-pembeli', '📝', 'Nota Pembeli')}
            {renderMenuItem('pengiriman', '🚚', 'Pengiriman')}
            {renderMenuItem('jadwal', '📅', 'Jadwal')}
            {renderMenuItem('nota-penitip', '📃', 'Nota Penitip')} {/* New menu item */}
          </Nav>
        </Col>
        <Col md={9}>
          {renderContent()}
        </Col>
      </Row>

      <Modal show={selectedItem !== null} onHide={() => setSelectedItem(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <p><strong>Nama Produk:</strong> {selectedItem.namaProduk}</p>
              <p><strong>Penitip:</strong> {selectedItem.namaPenitip || 'Tidak ada'}</p>
              <p><strong>Kategori:</strong> {selectedItem.namaKategori || categories.find(c => c.idKategori === selectedItem.kategoriID)?.namaKategori || 'Tidak ada'}</p>
              <p><strong>Kurir:</strong> {selectedItem.kurirNama || kurirs.find(k => k.pegawaiID === selectedItem.kurirID)?.nama || 'Tidak ada'}</p>
              <p><strong>Harga:</strong> Rp {selectedItem.harga?.toLocaleString() || '0'}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Garansi:</strong> {selectedItem.garansi ? selectedItem.garansi.split('T')[0] : 'Tidak ada'}</p>
              <p><strong>Tanggal Mulai:</strong> {selectedItem.tglMulai.split('T')[0]}</p>
              <p><strong>Tanggal Selesai:</strong> {selectedItem.tglSelesai.split('T')[0]}</p>
              {selectedItem.gambar_url && (
                <img src={selectedItem.gambar_url} alt="Gambar 1" style={{ maxWidth: '100%' }} />
              )}
              {selectedItem.gambar2_url && (
                <img src={selectedItem.gambar2_url} alt="Gambar 2" style={{ maxWidth: '100%' }} className="mt-2" />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedItem(null)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editItem !== null} onHide={() => setEditItem(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderEditForm()}
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          bg={toast.variant}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'danger' ? 'text-white' : ''}>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default GudangDashboard;