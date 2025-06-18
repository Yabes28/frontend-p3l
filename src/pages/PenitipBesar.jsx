import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PenitipBesar = () => {
  const [penitips, setPenitips] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/penitip-saldo-besar')
      .then(res => {
        setPenitips(res.data);
      })
      .catch(err => {
        console.error("Gagal memuat data penitip saldo besar", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Penitip dengan Saldo ≥ Rp500.000</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {penitips.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.nama}</td>
                <td className="px-4 py-2 border">{item.email}</td>
                <td className="px-4 py-2 border">Rp{item.saldo.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PenitipBesar;
<Link to="/penitip-saldo-besar">Penitip Saldo Besar</Link>
