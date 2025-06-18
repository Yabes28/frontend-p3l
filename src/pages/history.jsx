    import React, { useState, useEffect } from 'react';
    import { Container, Card, Table, Spinner } from 'react-bootstrap';

    const dummyHistory = [
    {
        idTransaksi: 101,
        tanggalTransaksi: "2025-05-14",
        status: "Selesai",
        totalHarga: 150000,
        metodePengiriman: "Kurir",
        detail_transaksi: [
        {
            namaProduk: "Kulkas",
            jumlah: 1,
            harga: 100000
        },
        {
            namaProduk: "Setrika",
            jumlah: 1,
            harga: 50000
        }
        ]
    },
    {
        idTransaksi: 102,
        tanggalTransaksi: "2025-05-12",
        status: "Selesai",
        totalHarga: 95000,
        metodePengiriman: "Pickup",
        detail_transaksi: [
        {
            namaProduk: "Sepatu",
            jumlah: 1,
            harga: 95000
        }
        ]
    }
    ];

    const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
        setHistory(dummyHistory);
        setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
        <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p>Loading history transaksi...</p>
        </div>
        );
    }

    return (
        <Container className="py-4">
        <h4 className="mb-4">Riwayat Transaksi</h4>
        {history.map((trx, idx) => (
            <Card key={idx} className="mb-4 shadow-sm">
            <Card.Header>
                <strong>ID Transaksi: #{trx.idTransaksi}</strong> | {trx.tanggalTransaksi} | Status: <em>{trx.status}</em>
            </Card.Header>
            <Card.Body>
                <p><strong>Metode Pengiriman:</strong> {trx.metodePengiriman}</p>
                <p><strong>Total Harga:</strong> Rp{trx.totalHarga.toLocaleString()}</p>

                <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Nama Produk</th>
                    <th>Jumlah</th>
                    <th>Harga Satuan</th>
                    </tr>
                </thead>
                <tbody>
                    {trx.detail_transaksi.map((item, index) => (
                    <tr key={index}>
                        <td>{item.namaProduk}</td>
                        <td>{item.jumlah}</td>
                        <td>Rp{item.harga.toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            </Card.Body>
            </Card>
        ))}
        </Container>
    );
    };

    export default History;
