    import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    const PenitipBesar = () => {
    const [penitips, setPenitips] = useState([]);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('http://localhost:8000/api/penitip-saldo-besar', { headers })
        .then(res => setPenitips(res.data))
        .catch(() => alert('❌ Gagal memuat data penitip.'));
    }, []);

    return (
        <div>
        <h3 className="mb-3">Penitip dengan Saldo ≥ Rp500.000</h3>
        <div className="table-responsive">
            <table className="table table-bordered table-striped">
            <thead className="table-light">
                <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                {penitips.map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.email}</td>
                    <td>Rp{Number(item.saldo).toLocaleString('id-ID')}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    };

    export default PenitipBesar;
