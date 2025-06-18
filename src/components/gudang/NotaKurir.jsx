    import React, { useEffect, useState } from 'react';
    import { Button, Form, Spinner, Table } from 'react-bootstrap';
    import axios from 'axios';

    const NotaKurir = () => {
    const [transaksiList, setTransaksiList] = useState([]);
    const [selectedID, setSelectedID] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('http://localhost:8000/api/nota-kurir-daftar', { headers })
        .then(res => setTransaksiList(res.data))
        .catch(err => console.error('❌ Gagal ambil daftar transaksi:', err));
    }, []);

    useEffect(() => {
        if (!selectedID) return;
        setLoading(true);
        axios.get(`http://localhost:8000/api/nota-kurir-data/${selectedID}`, { headers })
        .then(res => {
            setData(res.data);
            console.log("📦 DATA TRANSAKSI:", res.data);
        })
        .catch(err => {
            console.error('❌ Gagal ambil detail transaksi:', err);
            setData(null);
        })
        .finally(() => setLoading(false));
    }, [selectedID]);

    const handleCetak = () => {
    const element = document.getElementById('nota-kurir'); // atau 'nota-pembeli'
    import('html2canvas').then(html2canvas => {
        import('jspdf').then(({ jsPDF }) => {
        html2canvas.default(element, {
            scale: 2, // meningkatkan resolusi
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height] // otomatis menyesuaikan tinggi
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('nota-penjualan-kurir.pdf');
        });
        });
    });
    };


    return (
        <div>
        <h4 className="mb-3">🧾 Cetak Nota Penjualan (dibawa oleh kurir)</h4>

        <Form.Group className="mb-3" controlId="selectTransaksi">
            <Form.Label>Pilih Transaksi</Form.Label>
            <Form.Select value={selectedID} onChange={(e) => setSelectedID(e.target.value)}>
            <option value="">-- Pilih Transaksi --</option>
            {transaksiList.map((t) => (
                <option key={t.transaksiID} value={t.transaksiID}>
                #{t.transaksiID} - {t.pembeli?.nama} ({t.status})
                </option>
            ))}
            </Form.Select>
        </Form.Group>

        {loading && <Spinner animation="border" variant="primary" className="mt-2" />}

        {data && (
            <>
            <div
                id="nota-kurir"
                className="p-4 bg-white rounded shadow-sm mt-3 mx-auto"
                style={{ maxWidth: '500px', fontFamily: 'Courier New', fontSize: '14px', border: '1px solid #ccc' }}
            >
                <div className="text-center">
                <img src="/images/reusemart-logo.jpg" alt="ReUseMart Logo" style={{ width: '80px', marginBottom: '10px' }} />
                <h5 className="mb-1">ReUse Mart</h5>
                <p className="mb-2">Jl. Green Eco Park No. 456 Yogyakarta</p>
                </div>

                <hr />
                <p><strong>No Nota:</strong> {new Date().getFullYear().toString().slice(2)}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(data.transaksiID).padStart(3, '0')}</p>
                <p><strong>Tanggal Pesan:</strong> {new Date(data?.waktu_transaksi).toLocaleString()}</p>
                <p><strong>Lunas Pada:</strong> {new Date(data?.waktu_transaksi).toLocaleString()}</p>
                <p><strong>Tanggal Kirim:</strong> {data.penjadwalan?.[0]?.tanggal || '-'}</p>
                <p><strong>Pembeli:</strong> {data.pembeli?.email || '-'} / {data.pembeli?.nama || '-'}</p>
                <p>{data.alamat?.alamat || '-'}</p>
                <p><strong>Delivery:</strong> Kurir ReUseMart ({data.penjadwalan?.pegawai?.nama || '-'})</p>
                <hr />

                <Table bordered size="sm">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Produk</th>
                    <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {data.detail_transaksis?.map((d, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.produk?.namaProduk || '-'}</td>
                        <td>Rp{Number(d.produk?.harga || 0).toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
                </Table>

                <hr />
                <p><strong>Total:</strong> Rp{Number(data.perhitungan?.total || 0).toLocaleString()}</p>
                <p>Potongan dari poin ({data.perhitungan?.poinDigunakan || 0} poin): –Rp{Number(data.perhitungan?.potongan || 0).toLocaleString()}</p>
                <p><strong>Total Bayar:</strong> Rp{Number(data.perhitungan?.totalBayar || 0).toLocaleString()}</p>
                <p>Poin dari pesanan ini: {data.perhitungan?.poinDidapatkan || 0}</p>
                <p>Total poin customer: {data.perhitungan?.poinSebelum || 0}</p>
                <p>Poin akhir setelah transaksi: {data.perhitungan?.poinAkhir || 0}</p>

                <br />
                <p><strong>QC oleh:</strong> GudangQC (P18)</p>
                <p><strong>Diterima oleh:</strong> {data.pembeli?.nama || '-'} </p>
                <p><strong>Tanggal:</strong> __________________</p>
                <p><strong>Dicetak pada:</strong> {new Date().toLocaleString()}</p>
            </div>

            <Button variant="primary" className="mt-3" onClick={handleCetak}>
                Cetak Nota (PDF)
            </Button>
            </>
        )}
        </div>
    );
    };

    export default NotaKurir;
