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