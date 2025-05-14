    import React, { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import Card from 'react-bootstrap/Card';
    import Button from 'react-bootstrap/Button';
    import axios from 'axios';
    import { Alert } from 'react-bootstrap';

    const AdminDashboard = () => {
    const navigate = useNavigate();
    const [pegawai, setPegawai] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios
        .get('http://localhost:8000/api/pegawai', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            setPegawai(res.data);
        })
        .catch((err) => {
            console.error('Gagal ambil data pegawai', err);
            setError('Gagal ambil data pegawai. Cek token atau otorisasi.');
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Pilih Tipe Data yang Ingin Ditambahkan</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="flex gap-4 flex-wrap justify-center">
            <Card className="p-4 flex flex-col items-center gap-3 shadow-md w-64">
            <h2 className="text-lg font-medium text-gray-700">Tambah Pegawai</h2>
            <Button onClick={() => navigate('/pegawai')}>Pilih</Button>
            </Card>

            <Card className="p-4 flex flex-col items-center gap-3 shadow-md w-64">
            <h2 className="text-lg font-medium text-gray-700">Tambah Organisasi</h2>
            <Button onClick={() => navigate('/tambah-organisasi')}>Pilih</Button>
            </Card>
        </div>

        {/* Optional: Tampilkan jumlah pegawai yang berhasil diambil */}
        {pegawai.length > 0 && (
            <p className="text-gray-600 mt-4">Jumlah pegawai: {pegawai.length}</p>
        )}
        </div>
    );
    };

    export default AdminDashboard;
        