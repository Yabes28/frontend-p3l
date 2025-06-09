    import React from 'react';
    import { Button } from 'react-bootstrap';
    import axios from 'axios';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';

    const LaporanKategori = ({ setToast }) => {
    const downloadPDF = async () => {
        try {
        const token = localStorage.getItem('token');
        console.log('🛡️ TOKEN =>', token);

        const res = await axios.get('http://localhost:8000/api/laporan-penjualan-per-kategori', {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('✅ DATA RESPONSE =>', res.data);
        const data = res.data.kategori;

        if (!data || typeof data !== 'object') {
            throw new Error('❗Response tidak mengandung data kategori');
        }

        const img = new Image();
        img.src = '/images/reusemart-logo.jpg'; // Logo di folder public/images

        img.onload = () => {
            const doc = new jsPDF();
            const today = new Date();

            // ✅ Tambah Logo
            doc.addImage(img, 'JPEG', 14, 10, 25, 25);

            // ✅ Header Text
            doc.setFontSize(12);
            doc.text('ReUse Mart', 50, 15);
            doc.text('Jl. Green Eco Park No. 456 Yogyakarta', 50, 22);

            // ✅ Judul Laporan
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('LAPORAN PENJUALAN PER KATEGORI BARANG', 14, 42);

            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text(`Tahun : ${today.getFullYear()}`, 14, 49);
            doc.text(`Tanggal cetak: ${today.toLocaleDateString('id-ID')}`, 14, 56);

            // ✅ Siapkan Tabel
            const tableBody = [];
            let totalTerjual = 0;
            let totalBelum = 0;

            Object.entries(data).forEach(([kategori, item]) => {
            const jumlahTerjual = item.jumlah_produk || 0;
            const jumlahBelum = item.belum_terjual || 0;
            tableBody.push([kategori, jumlahTerjual, jumlahBelum]);
            totalTerjual += jumlahTerjual;
            totalBelum += jumlahBelum;
            });

            tableBody.push(['Total', totalTerjual, totalBelum]);

            doc.autoTable({
            startY: 62,
            head: [['Kategori', 'Jumlah item terjual', 'Jumlah item belum terjual']],
            body: tableBody,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255 }
            });

            doc.save('laporan-penjualan-kategori.pdf');
        };
        } catch (err) {
        console.error('❌ Gagal ambil data laporan:', err.response?.data || err.message || err);
        if (typeof setToast === 'function') {
            setToast({
            show: true,
            message: '❌ Gagal memuat data laporan.',
            variant: 'danger',
            });
        } else {
            alert('❌ Gagal memuat data laporan.');
        }
        }
    };

    return (
        <div>
        <h4 className="mb-3"></h4>
        <Button variant="success" onClick={downloadPDF}>
            ⬇️ Unduh PDF Laporan
        </Button>
        </div>
    );
    };

    export default LaporanKategori;
