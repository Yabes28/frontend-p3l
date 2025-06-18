    import React, { useEffect, useState } from 'react';
    import { Button, Form, Spinner } from 'react-bootstrap';
    import axios from 'axios';

    const NotaPembeli = () => {
    const [transaksis, setTransaksis] = useState([]);
    const [selectedID, setSelectedID] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('http://localhost:8000/api/nota-pembeli-daftar', { headers })
        .then(res => setTransaksis(res.data))
        .catch(err => console.error('❌ Gagal ambil daftar:', err));
    }, []);

    useEffect(() => {
        if (!selectedID) return;
        setLoading(true);
        axios.get(`http://localhost:8000/api/nota-pembeli-data/${selectedID}`, { headers })
        .then(res => setData(res.data))
        .catch(err => setData(null))
        .finally(() => setLoading(false));
    }, [selectedID]);

    const handleCetak = () => {
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
            pdf.save('nota-pembeli.pdf');
            });
        });
        });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        <style>
            {`
            @media print {
                #watermark {
                position: fixed;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-30deg);
                opacity: 0.1;
                font-size: 60px;
                color: #000;
                z-index: -1;
                pointer-events: none;
                }
            }
            `}
        </style>

        <h4 className="mb-3">🧾 Cetak Nota Penjualan (diambil oleh pembeli)</h4>

        <Form.Group controlId="selectTransaksi" className="mb-3">
            <Form.Label>Pilih Transaksi</Form.Label>
            <Form.Select value={selectedID} onChange={(e) => setSelectedID(e.target.value)}>
            <option value="">-- Pilih Transaksi --</option>
            {transaksis.map((t) => (
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
                id="nota-pembeli"
                className="p-4 bg-white rounded shadow-sm mt-3 mx-auto"
                style={{ fontFamily: 'Courier New', fontSize: '14px', border: '1px solid #ddd' }}
            >
                <div id="watermark">REUSEMART</div>

                <div className="text-center">
                <img src="/images/reusemart-logo.jpg" alt="ReUseMart Logo" style={{ width: '80px', marginBottom: '10px' }} />
                <h5 className="mb-1">ReUse Mart</h5>
                <p className="mb-2">Jl. Green Eco Park No. 456 Yogyakarta</p>
                </div>

                <hr />
                <p><strong>No Nota:</strong> 24.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(data.transaksiID).padStart(3, '0')}</p>
                <p><strong>Tanggal Pesan:</strong> {new Date(data.waktu_transaksi).toLocaleString()}</p>
                <p><strong>Lunas Pada:</strong> {new Date(data.waktu_transaksi).toLocaleString()}</p>
                <p><strong>Tanggal Ambil:</strong> {data.penjadwalan?.[0]?.tanggal || '-'}</p>
                <p><strong>Pembeli:</strong> {data.pembeli?.email || '-'} / {data.pembeli?.nama || '-'}</p>
                <p>{data.alamat?.alamat || '-'}</p>
                <p><strong>Delivery:</strong> – (diambil sendiri)</p>
                <hr />

                <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                    <th style={{ textAlign: 'left' }}>Nama Produk</th>
                    <th style={{ textAlign: 'right' }}>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {data.detail_transaksis?.map((item, i) => (
                    <tr key={i}>
                        <td>{item.produk?.namaProduk || '-'}</td>
                        <td style={{ textAlign: 'right' }}>Rp{Number(item.produk?.harga || 0).toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

                <hr />
                <p><strong>Total:</strong> Rp{Number(data.total || 0).toLocaleString()}</p>
                <p>Potongan dari poin ({data.poinDigunakan || 0} poin): –Rp{Number(data.potongan || 0).toLocaleString()}</p>
                <p><strong>Total Bayar:</strong> Rp{Number(data.totalBayar || 0).toLocaleString()}</p>
                <p>Poin dari pesanan ini: {data.poinReward}</p>
                <p>Total poin customer: {data.pembeli?.poinLoyalitas}</p>

                <br />
                <p><strong>QC oleh:</strong> GudangQc (P18)</p>
                <p><strong>Diambil oleh:</strong> {data.pembeli?.nama || '-'}</p>
                <p><strong>Tanggal:</strong> __________________</p>
                <hr />
                <p className="text-end text-muted" style={{ fontSize: '12px' }}>
                Dicetak pada {new Date().toLocaleString()}
                </p>
            </div>

            <Button variant="success" className="mt-3" onClick={handleCetak}>
                Cetak Nota PDF
            </Button>
            </>
        )}
        </div>
    );
    };

    export default NotaPembeli;
