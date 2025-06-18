import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

const NotaPenitipan = () => {
  const [barangs, setBarangs] = useState([]);
  const [selectedID, setSelectedID] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedInPegawai, setLoggedInPegawai] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Fetch logged-in pegawai details
    axios.get('http://localhost:8000/api/pegawai/me', { headers })
      .then(res => {
        setLoggedInPegawai(res.data || { nama: 'Gudang' }); 
      })
      .catch(err => {
        console.error('❌ Gagal ambil data pegawai:', err);
        setLoggedInPegawai({ nama: 'Gudang' }); 
      });

    // Fetch barang list
    axios.get('http://localhost:8000/api/gudang', { headers })
      .then(res => setBarangs(res.data || []))
      .catch(err => console.error('❌ Gagal ambil daftar barang:', err));
  }, []);

  useEffect(() => {
    if (!selectedID) return;
    setLoading(true);
    axios.get(`http://localhost:8000/api/gudang/${selectedID}`, { headers })
      .then(res => setData(res.data))
      .catch(err => setData(null))
      .finally(() => setLoading(false));
  }, [selectedID]);

  const handleCetak = () => {
    const element = document.getElementById('nota-penitipan');
    import('html2canvas').then(html2canvas => {
      import('jspdf').then(({ jsPDF }) => {
        html2canvas.default(element).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('nota-penitipan.pdf');
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

      <h4 className="mb-3">🧾 Cetak Nota Penitipan</h4>

      <Form.Group controlId="selectBarang" className="mb-3">
        <Form.Label>Pilih Barang</Form.Label>
        <Form.Select value={selectedID} onChange={(e) => setSelectedID(e.target.value)}>
          <option value="">-- Pilih Barang --</option>
          {barangs.map((b) => (
            <option key={b.idProduk} value={b.idProduk}>
              #{b.idProduk} - {b.namaProduk} (Penitip: {b.namaPenitip})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {loading && <Spinner animation="border" variant="primary" className="mt-2" />}

      {data && (
        <div
          id="nota-penitipan"
          className="p-4 bg-white rounded shadow-sm mt-3 mx-auto"
          style={{ fontFamily: 'Courier New', fontSize: '14px', border: '1px solid #ddd' }}
        >
          <div id="watermark">REUSEMART</div>

          <div className="text-center">
            <img src="/images/reusemart-logo.png" alt="ReUseMart Logo" style={{ width: '80px', marginBottom: '10px' }} />
            <h5 className="mb-1">ReUse Mart</h5>
            <p className="mb-2">Jl. Green Eco Park No. 456 Yogyakarta</p>
          </div>

          <hr />
          <p><strong>No Nota:</strong> {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(data.idProduk).padStart(3, '0')}</p>
          <p><strong>Tanggal penitipan:</strong> {new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
          <p><strong>Masa penitipan selesai:</strong> {new Date(data.tglSelesai).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
          <p><strong>Penitip:</strong> {data.namaPenitip}</p>
          <p>{data.alamat || 'Babarsari'}</p>
          <p><strong>Delivery:</strong> Kurir ReUseMart ({data.kurirNama || 'Tidak ada'})</p>
          <hr />

          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Nama Produk</th>
                <th style={{ textAlign: 'right' }}>Harga</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.namaProduk}</td>
                <td style={{ textAlign: 'right' }}>Rp{Number(data.harga || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <hr />
          <p><strong>Total:</strong> Rp{Number(data.harga || 0).toLocaleString()}</p>
          <p><strong>Garansi:</strong> {data.garansi ? new Date(data.garansi).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'Tidak ada'}</p>
          <br />
          <p><strong>Diterima oleh QC:</strong> {loggedInPegawai?.nama || 'Gudang'}</p>
          <hr />
          <p className="text-end text-muted" style={{ fontSize: '12px' }}>
            Dicetak pada {new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
          </p>
        </div>
      )}

      <Button variant="success" className="mt-3" onClick={handleCetak}>
        Cetak Nota PDF
      </Button>
    </div>
  );
};

export default NotaPenitipan;