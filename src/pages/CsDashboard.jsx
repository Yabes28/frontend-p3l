import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Form, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Utility functions untuk menangani tanggal dengan benar
const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === 'Belum diambil') return dateString;
    
    // Jika sudah dalam format YYYY-MM-DD, return langsung
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }
    
    // Parse tanggal sebagai local date (tidak mengkonversi timezone)
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    
    const date = new Date(dateString + 'T00:00:00'); // Tambahkan waktu untuk mencegah timezone shift
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
};

const formatDateForAPI = (date) => {
    if (!date) return null;
    
    if (date instanceof Date) {
        // Gunakan getFullYear, getMonth, getDate untuk menghindari timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    return date;
};

const parseDate = (dateString) => {
    if (!dateString || dateString === 'Belum diambil') return null;
    
    // Parse sebagai local date untuk menghindari timezone conversion
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    
    return new Date(dateString + 'T00:00:00');
};

const CsDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const [penitip, setPenitip] = useState([]);
    const [transaksi, setTransaksi] = useState([]);
    const [filteredTransaksi, setFilteredTransaksi] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('semua');
    const [editData, setEditData] = useState({
        penukaranID: null,
        pembeli: '',
        merchandise: '',
        jumlahPenukaran: '',
        jumlahPoin: '',
        tanggalClaim: '',
        tanggalAmbil: null,
    });
    const [selectedId, setSelectedId] = useState(null);

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch data untuk Data Penitip
    const getPenitipData = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/penitip', { headers });
            setPenitip(res.data);
        } catch (err) {
            console.error("Gagal ambil data penitip");
        }
    };

    // Fetch data untuk Semua Penukaran Merchandise
    const getTransaksiData = async () => {
        try {
            console.log('Fetching transaction data...');
            console.log('Headers:', headers);
            
            const res = await axios.get('http://localhost:8000/api/transaksimerchandise', { 
                headers,
                timeout: 10000 // 10 second timeout
            });
            
            console.log('Response status:', res.status);
            console.log('Raw Response data:', res.data); // Log raw data for debugging
            
            const processedData = res.data.map(item => {
                return {
                    ...item,
                    tanggalClaim: formatDateForDisplay(item.tanggal_claim),
                    tanggalAmbil: item.tanggal_ambil ? formatDateForDisplay(item.tanggal_ambil) : 'Belum diambil',
                };
            });
            
            console.log('Processed data:', processedData); // Log processed data
            
            setTransaksi(processedData);
            applyFilter(processedData, currentFilter);
            
        } catch (err) {
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                config: err.config
            });
            
            if (err.response?.status === 404) {
                setMessage('Endpoint tidak ditemukan. Periksa konfigurasi route backend.');
            } else if (err.response?.status === 401) {
                setMessage('Unauthorized. Silakan login ulang.');
                // Redirect to login if needed
                // navigate('/login');
            } else {
                setMessage(`Gagal mengambil data transaksi merchandise: ${err.message}`);
            }
        }
    };

    // Filter data berdasarkan status
    const applyFilter = (data, filter) => {
        let filtered = data;
        
        if (filter === 'diambil') {
            filtered = data.filter(item => item.tanggal_ambil && item.tanggal_ambil !== null && item.tanggal_ambil !== 'Belum diambil');
        } else if (filter === 'belum') {
            filtered = data.filter(item => !item.tanggal_ambil || item.tanggal_ambil === null || item.tanggal_ambil === 'Belum diambil');
        }
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter(t => {
                const pembeliNama = t.pembeli?.nama || '';
                const merchandiseNama = t.merchandise?.nama || '';
                return pembeliNama.toLowerCase().includes(search.toLowerCase()) ||
                       merchandiseNama.toLowerCase().includes(search.toLowerCase());
            });
        }
        
        setFilteredTransaksi(filtered);
    };

    // Handle filter change
    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        applyFilter(transaksi, filter);
    };

    // Handle search
    useEffect(() => {
        applyFilter(transaksi, currentFilter);
    }, [search, transaksi, currentFilter]);

    const handleDeletePenitip = async (id) => {
        if (!window.confirm('Yakin ingin menghapus penitip ini?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/penitip/${id}`, { headers });
            setMessage('Penitip berhasil dihapus.');
            getPenitipData();
        } catch (err) {
            setMessage('Gagal menghapus penitip.');
        }
    };

    const handleDeleteTransaksi = async (id) => {
        if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/transaksimerchandise/${id}`, { headers });
            setMessage('Transaksi berhasil dihapus.');
            getTransaksiData();
        } catch (err) {
            setMessage('Gagal menghapus transaksi.');
        }
    };

    const handleEditPenitip = (item) => {
        setEditData({
            nama: item.nama || '',
            nik: item.nik || '',
            email: item.email || '',
            password: '',
            nomorHP: item.nomorHP || '',
            alamat: item.alamat || '',
            foto_ktp: null,
        });
        setSelectedId(item.penitipID);
        setShowModal(true);
    };

    const handleEditTransaksi = (item) => {
        setEditData({
            penukaranID: item.penukaranID,
            pembeli: item.pembeli?.nama || '',
            merchandise: item.merchandise?.nama || '',
            jumlahPenukaran: item.jumlah_penukaran || '',
            jumlahPoin: item.jumlah_poin || '',
            tanggalClaim: formatDateForDisplay(item.tanggal_claim),
            tanggalAmbil: item.tanggal_ambil && item.tanggal_ambil !== 'Belum diambil' 
                ? parseDate(item.tanggal_ambil)
                : null,
        });
        setSelectedId(item.penukaranID);
        setShowModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto_ktp') {
            setEditData({ ...editData, [name]: files ? files[0] : null });
        } else {
            setEditData({ ...editData, [name]: value });
        }
    };

    const handleEditChangeDate = (date) => {
        setEditData({ ...editData, tanggalAmbil: date });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (editData.penukaranID) {
            try {
                const formattedDate = formatDateForAPI(editData.tanggalAmbil);
                
                await axios.put(`http://localhost:8000/api/transaksimerchandise/updateTanggalAmbil/${selectedId}`, {
                    tanggal_ambil: formattedDate,
                }, { headers });
                
                setMessage('Tanggal ambil berhasil diperbarui.');
                setShowModal(false);
                setEditData({
                    penukaranID: null,
                    pembeli: '',
                    merchandise: '',
                    jumlahPenukaran: '',
                    jumlahPoin: '',
                    tanggalClaim: '',
                    tanggalAmbil: null,
                });
                getTransaksiData();
            } catch (err) {
                setMessage(err.response?.data?.message || 'Gagal mengedit tanggal ambil.');
            }
        } else {
            const formData = new FormData();
            Object.entries(editData).forEach(([key, value]) => {
                if (value !== null && value !== '') formData.append(key, value);
            });
            try {
                await axios.post(`http://localhost:8000/api/penitip/${selectedId}?_method=PUT`, formData, {
                    headers: { ...headers, 'Content-Type': 'multipart/form-data' }
                });
                setMessage('Penitip berhasil diperbarui.');
                setShowModal(false);
                setEditData({
                    penukaranID: null,
                    pembeli: '',
                    merchandise: '',
                    jumlahPenukaran: '',
                    jumlahPoin: '',
                    tanggalClaim: '',
                    tanggalAmbil: null,
                });
                getPenitipData();
            } catch (err) {
                setMessage(err.response?.data?.message || 'Gagal mengedit penitip.');
            }
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditData({
            penukaranID: null,
            pembeli: '',
            merchandise: '',
            jumlahPenukaran: '',
            jumlahPoin: '',
            tanggalClaim: '',
            tanggalAmbil: null,
        });
        setSelectedId(null);
    };

    useEffect(() => {
        if (location.pathname === '/data-penitip' || location.pathname === '/cs-dashboard') {
            getPenitipData();
        } else if (location.pathname === '/semua-penukaran-merchandise') {
            getTransaksiData();
        }
    }, [location.pathname]);

    const filteredPenitip = penitip.filter(p =>
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-gradient" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)' }}>
            <Container fluid className="px-0">
                <Row className="g-0">

                    {/* Sidebar */}
                    <Col md={2} className="bg-white border-end p-3 shadow-lg rounded-end" style={{ minHeight: '100vh' }}>
                        <h5 className="fw-bold text-success mb-4 text-center" style={{ fontSize: '1.2rem' }}>Menu</h5>
                        <ul className="list-unstyled">
                            <li className="mb-3">
                                <Button
                                    variant="outline-primary"
                                    className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                                    onClick={() => navigate('/data-penitip')}
                                    style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#007bff')}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                                >
                                    📋 Data Penitip
                                </Button>
                            </li>
                            <li className="mb-3">
                                <Button
                                    variant="outline-success"
                                    className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                                    onClick={() => navigate('/tambah-penitip')}
                                    style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#28a745')}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                                >
                                    ➕ Tambah Penitip
                                </Button>
                            </li>
                            <li className="mb-3">
                                <Button
                                    variant="outline-info"
                                    className="w-100 text-decoration-none fw-semibold text-dark rounded-pill"
                                    onClick={() => navigate('/semua-penukaran-merchandise')}
                                    style={{ transition: 'all 0.3s', padding: '8px 16px' }}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#17a2b8')}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = '')}
                                >
                                    🛒 Semua Penukaran Merchandise
                                </Button>
                            </li>
                        </ul>
                    </Col>

                    {/* Main Content */}
                    <Col md={10} className="p-4">
                        <h3 className="fw-bold text-success" style={{ fontSize: '1.8rem' }}>Customer Service Dashboard</h3>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Selamat datang, <strong>{user?.name}</strong>!</p>

                        {/* Alert Messages */}
                        {message && (
                            <Alert 
                                variant="info" 
                                className="mb-3"
                                dismissible
                                onClose={() => setMessage('')}
                            >
                                {message}
                            </Alert>
                        )}

                        {location.pathname === '/data-penitip' || location.pathname === '/cs-dashboard' ? (
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-light" style={{ borderRadius: '15px' }}>
                                <h5 className="fw-bold mb-3 text-primary" style={{ fontSize: '1.5rem' }}>Data Penitip</h5>

                                <Form.Control
                                    type="text"
                                    placeholder="Cari nama/email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="mb-3 w-50"
                                    style={{ borderRadius: '10px', borderColor: '#ced4da' }}
                                />

                                <Table striped bordered hover responsive className="table-responsive text-center" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                    <thead className="bg-success text-white">
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>NIK</th>
                                            <th>Email</th>
                                            <th>Nomor HP</th>
                                            <th>Alamat</th>
                                            <th>Foto KTP</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPenitip.length > 0 ? (
                                            filteredPenitip.map((item, index) => (
                                                <tr key={item.penitipID} className="align-middle">
                                                    <td>{index + 1}</td>
                                                    <td>{item.nama}</td>
                                                    <td>{item.nik}</td>  
                                                    <td>{item.email}</td>
                                                    <td>{item.nomorHP}</td>
                                                    <td>{item.alamat}</td>
                                                    <td>
                                                        {item.foto_ktp ? (
                                                            <img 
                                                                src={`http://localhost:8000/${item.foto_ktp}`} 
                                                                alt="KTP" 
                                                                width="70" 
                                                                style={{ borderRadius: '5px' }}
                                                                onError={(e) => {
                                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA3MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjM1IiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-muted">No Image</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            className="me-2 rounded-pill"
                                                            onClick={() => handleEditPenitip(item)}
                                                            style={{ padding: '6px 12px', transition: 'all 0.3s' }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="rounded-pill"
                                                            onClick={() => handleDeletePenitip(item.penitipID)}
                                                            style={{ padding: '6px 12px', transition: 'all 0.3s' }}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center text-muted py-4">
                                                    <div style={{ fontSize: '1.1rem' }}>
                                                        Tidak ada data penitip
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        ) : location.pathname === '/semua-penukaran-merchandise' ? (
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-light" style={{ borderRadius: '15px' }}>
                                <h5 className="fw-bold mb-4 text-primary" style={{ fontSize: '1.5rem' }}>Semua Penukaran Merchandise</h5>

                                {/* Search Bar */}
                                <Form.Control
                                    type="text"
                                    placeholder="Cari nama pembeli atau merchandise..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="mb-4"
                                    style={{ borderRadius: '10px', borderColor: '#ced4da', maxWidth: '400px' }}
                                />

                                {/* Filter Buttons - Improved Layout */}
                                <div className="d-flex justify-content-center mb-4">
                                    <div className="btn-group shadow-sm" role="group" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                                        <Button
                                            variant={currentFilter === 'semua' ? 'secondary' : 'outline-secondary'}
                                            className="px-4 py-2 fw-semibold border-0"
                                            onClick={() => handleFilterChange('semua')}
                                            style={{ 
                                                borderRadius: '25px 0 0 25px',
                                                backgroundColor: currentFilter === 'semua' ? '#6c757d' : 'transparent',
                                                color: currentFilter === 'semua' ? 'white' : '#6c757d',
                                                minWidth: '140px'
                                            }}
                                        >
                                            Tampil Semua
                                        </Button>
                                        <Button
                                            variant={currentFilter === 'diambil' ? 'success' : 'outline-success'}
                                            className="px-4 py-2 fw-semibold border-0"
                                            onClick={() => handleFilterChange('diambil')}
                                            style={{ 
                                                backgroundColor: currentFilter === 'diambil' ? '#28a745' : 'transparent',
                                                color: currentFilter === 'diambil' ? 'white' : '#28a745',
                                                minWidth: '140px'
                                            }}
                                        >
                                            Sudah Diambil
                                        </Button>
                                        <Button
                                            variant={currentFilter === 'belum' ? 'warning' : 'outline-warning'}
                                            className="px-4 py-2 fw-semibold border-0"
                                            onClick={() => handleFilterChange('belum')}
                                            style={{ 
                                                borderRadius: '0 25px 25px 0',
                                                backgroundColor: currentFilter === 'belum' ? '#ffc107' : 'transparent',
                                                color: currentFilter === 'belum' ? 'white' : '#ffc107',
                                                minWidth: '140px'
                                            }}
                                        >
                                            Belum Diambil
                                        </Button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="table-responsive" style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                    <Table striped bordered hover className="mb-0 text-center">
                                        <thead className="bg-success text-white">
                                            <tr>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>No</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Pembeli</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Merchandise</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Jumlah Penukaran</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Jumlah Poin</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Tanggal Claim</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Tanggal Ambil</th>
                                                <th style={{ verticalAlign: 'middle', padding: '12px' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransaksi.length > 0 ? (
                                                filteredTransaksi.map((item, index) => (
                                                    <tr key={item.penukaranID} className="align-middle">
                                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                                        <td style={{ padding: '12px' }}>{item.pembeli?.nama || 'N/A'}</td>
                                                        <td style={{ padding: '12px' }}>{item.merchandise?.nama || 'N/A'}</td>
                                                        <td style={{ padding: '12px' }}>{item.jumlah_penukaran}</td>
                                                        <td style={{ padding: '12px' }}>{item.jumlah_poin}</td>
                                                        <td style={{ padding: '12px' }}>{item.tanggalClaim || 'N/A'}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            {item.tanggalAmbil && item.tanggalAmbil !== 'Belum diambil' ? (
                                                                <span className="badge bg-success fs-6">{item.tanggalAmbil}</span>
                                                            ) : (
                                                                <span className="badge bg-warning fs-6">Belum diambil</span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="me-2 rounded-pill"
                                                                onClick={() => handleEditTransaksi(item)}
                                                                style={{ padding: '6px 12px' }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="rounded-pill"
                                                                onClick={() => handleDeleteTransaksi(item.penukaranID)}
                                                                style={{ padding: '6px 12px' }}
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center text-muted py-4">
                                                        <div style={{ fontSize: '1.1rem' }}>
                                                            {transaksi.length === 0 ? 'Tidak ada data transaksi' : 'Tidak ada data yang sesuai dengan filter'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        ) : null}
                    </Col>
                </Row>

                {/* Modal Edit */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton className="bg-success text-white" style={{ borderRadius: '10px 10px 0 0' }}>
                        <Modal.Title>{editData.penukaranID ? 'Edit Tanggal Ambil' : 'Edit Penitip'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4">
                        <Form onSubmit={handleEditSubmit}>
                            {editData.penukaranID ? (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pembeli</Form.Label>
                                        <Form.Control name="pembeli" value={editData.pembeli} disabled readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Merchandise</Form.Label>
                                        <Form.Control name="merchandise" value={editData.merchandise} disabled readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Jumlah Penukaran</Form.Label>
                                        <Form.Control name="jumlahPenukaran" value={editData.jumlahPenukaran} disabled readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Jumlah Poin</Form.Label>
                                        <Form.Control name="jumlahPoin" value={editData.jumlahPoin} disabled readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tanggal Claim</Form.Label>
                                        <Form.Control name="tanggalClaim" value={editData.tanggalClaim} disabled readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tanggal Ambil</Form.Label>
                                        <div>
                                            <DatePicker
                                                selected={editData.tanggalAmbil}
                                                onChange={handleEditChangeDate}
                                                dateFormat="yyyy-MM-dd"
                                                className="form-control"
                                                placeholderText="Pilih tanggal ambil"
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nama</Form.Label>
                                        <Form.Control name="nama" value={editData.nama} onChange={handleEditChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>NIK</Form.Label>
                                        <Form.Control name="nik" value={editData.nik} onChange={handleEditChange} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" value={editData.email} onChange={handleEditChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" value={editData.password} onChange={handleEditChange} placeholder="Kosongkan jika tidak diubah" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nomor HP</Form.Label>
                                        <Form.Control name="nomorHP" value={editData.nomorHP} onChange={handleEditChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Alamat</Form.Label>
                                        <Form.Control name="alamat" value={editData.alamat} onChange={handleEditChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Foto KTP</Form.Label>
                                        <Form.Control type="file" name="foto_ktp" onChange={handleEditChange} accept="image/*" />
                                    </Form.Group>
                                </>
                            )}
                            <Button type="submit" variant="success" className="w-100 rounded-pill" style={{ padding: '10px' }}>
                                Simpan Perubahan
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default CsDashboard;