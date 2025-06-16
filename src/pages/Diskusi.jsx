<<<<<<< Updated upstream
    import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    const Diskusi = ({ produkID, pembeliID }) => {
    const [isi, setIsi] = useState('');
    const [diskusiList, setDiskusiList] = useState([]);

    useEffect(() => {
        fetchDiskusi();
    }, [produkID]);

    const fetchDiskusi = async () => {
        const res = await axios.get('http://localhost:8000/api/diskusi/${produkID}');
        setDiskusiList(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8000/api/diskusi', {
        isi,
        produkID,
        pembeliID,
        });
        setIsi('');
        fetchDiskusi();
    };

    return (
        <div>
        <h4>Diskusi Produk</h4>
        <ul>
            {diskusiList.map((d) => (
            <li key={d.diskusiID}><strong>{d.tanggal}</strong>: {d.isi}</li>
            ))}
        </ul>
        <form onSubmit={handleSubmit}>
            <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            placeholder="Tulis pertanyaan atau komentar..."
            required
            />
            <button type="submit">Kirim</button>
        </form>
        </div>
    );
    };

    export default Diskusi;
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Diskusi = ({ produkID, pembeliID, pegawaiID }) => {
  const [isi, setIsi] = useState('');
  const [diskusiList, setDiskusiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (produkID) {
      fetchDiskusi();
    }
  }, [produkID]);

  const fetchDiskusi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/diskusi/${produkID}`);
      setDiskusiList(res.data);
    } catch (err) {
      setError('Gagal memuat diskusi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isi.trim()) return;  // jangan submit jika kosong
    
    try {
      await axios.post('http://localhost:8000/api/diskusi', {
        isi,
        produkID,
        pembeliID: pembeliID || null,
        pegawaiID: pegawaiID || null,
      });
      setIsi('');
      fetchDiskusi();
    } catch (err) {
      alert('Gagal mengirim diskusi.');
    }
  };

  return (
    <div>
      <h4>Diskusi Produk</h4>
      
      {loading && <p>Memuat diskusi...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {diskusiList.map((d) => (
          <li key={d.diskusiID} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <div>
              <strong>{d.nama}</strong> <em>({d.role})</em> -{' '}
              <small>{new Date(d.tanggal).toLocaleString()}</small>
            </div>
            <p>{d.isi}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder="Tulis pertanyaan atau komentar..."
          required
          rows={4}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit">Kirim</button>
      </form>
    </div>
  );
};

export default Diskusi;
>>>>>>> Stashed changes
