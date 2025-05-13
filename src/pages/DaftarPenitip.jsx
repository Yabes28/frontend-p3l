    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { Table, Form, Button, Container, Alert } from 'react-bootstrap';

    const DaftarPenitip = () => {
    const [penitip, setPenitip] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');

    const getData = async () => {
        try {
        const res = await axios.get('http://localhost:8000/api/penitip', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPenitip(res.data);
        } catch (err) {
        console.error("Gagal ambil data penitip");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus penitip ini?')) return;

        try {
        await axios.delete(`http://localhost:8000/api/penitip/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Penitip berhasil dihapus.');
        getData();
        } catch (err) {
        setMessage('Gagal menghapus penitip.');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const filtered = penitip.filter(p =>
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container className="my-5">
        <h3 className="mb-4 text-success">Daftar Penitip</h3>
        {message && <Alert variant="info">{message}</Alert>}

        <Form.Control
            type="text"
            placeholder="Cari nama/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
        />

        <Table striped bordered hover responsive>
            <thead>
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
            {filtered.map((item, index) => (
                <tr key={item.penitipID}>
                <td>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{item.nik}</td>
                <td>{item.email}</td>
                <td>{item.nomorHP}</td>
                <td>{item.alamat}</td>
                <td>
                    <img src={`http://localhost:8000/${item.foto_ktp}`} alt="KTP" width="70" />
                </td>
                <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.penitipID)}>Hapus</Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
        </Container>
    );
    };

    export default DaftarPenitip;
