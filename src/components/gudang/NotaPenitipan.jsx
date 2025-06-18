    import React, { useEffect, useState } from 'react';
    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';
    import axios from 'axios';
    import { Button, Table } from 'react-bootstrap';

    const NotaPenitipan = () => {
    const [produk, setProduk] = useState([]);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('http://localhost:8000/api/barangs', { headers })
        .then(res => setProduk(res.data))
        .catch(err => console.error('❌ Gagal ambil produk:', err));
    }, []);

    const cetakNota = () => {
        const doc = new jsPDF();
        doc.text("NOTA PENITIPAN BARANG", 14, 14);
        autoTable(doc, {
        head: [['No', 'Nama Produk', 'Penitip', 'Harga', 'Stok']],
        body: produk.map((item, i) => [
            i + 1, item.namaProduk, item.penitip?.nama || '-', `Rp ${item.harga}`, item.stok
        ])
        });
        doc.save("nota-penitipan.pdf");
    };

    return (
        <div>
        <h5 className="mb-3">Cetak Nota Penitipan Barang</h5>
        <Button onClick={cetakNota} variant="primary">Cetak PDF</Button>
        <Table striped bordered hover className="mt-3">
            <thead>
            <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Penitip</th>
                <th>Harga</th>
                <th>Stok</th>
            </tr>
            </thead>
            <tbody>
            {produk.map((item, i) => (
                <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.namaProduk}</td>
                <td>{item.penitip?.nama || '-'}</td>
                <td>{item.harga}</td>
                <td>{item.stok}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        </div>
    );
    };

    export default NotaPenitipan;
