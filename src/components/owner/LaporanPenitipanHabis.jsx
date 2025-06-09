    import React from 'react';
    import { Button } from 'react-bootstrap';
    import axios from 'axios';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';

    const LaporanPenitipanHabis = () => {
    const downloadPDF = async () => {
        try {
        const token = localStorage.getItem('token');
        console.log('🛡️ TOKEN =>', token);

        const res = await axios.get('http://localhost:8000/api/laporan-penitipan-habis', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data.data;
        console.log('📦 DATA =>', data);
        console.log('📌 Cek data[0] =>', data[0]);

        if (!Array.isArray(data) || data.length === 0) {
            alert('❌ Tidak ada data penitipan habis untuk ditampilkan.');
            return;
        }

        const img = new Image();
        img.src = '/images/reusemart-logo.jpg'; // logo dari folder public/images

        img.onload = () => {
            const doc = new jsPDF();
            const today = new Date();

            // ✅ Tambah Logo
            doc.addImage(img, 'JPEG', 14, 10, 25, 25); // kiri atas

            // ✅ Header teks di kanan logo
            doc.setFontSize(12);
            doc.text('ReUse Mart', 50, 15);
            doc.text('Jl. Green Eco Park No. 456 Yogyakarta', 50, 22);

            // ✅ Judul laporan
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('LAPORAN Barang yang Masa Penitipannya Sudah Habis', 14, 42);

            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text(`Tanggal cetak: ${today.toLocaleDateString('id-ID')}`, 14, 49);

            // ✅ Mapping data ke format tabel
            const tableData = data.map(item => [
            item.kode_produk || '-',
            item.nama_produk || '-',
            item.penitip_id || '-',
            item.nama_penitip || '-',
            item.tgl_masuk || '-',
            item.tgl_akhir || '-',
            item.batas_ambil || '-'
            ]);

            // ✅ AutoTable
            doc.autoTable({
            startY: 55,
            head: [[
                'Kode Produk', 'Nama Produk', 'ID Penitip',
                'Nama Penitip', 'Tanggal Masuk', 'Tanggal Akhir', 'Batas Ambil'
            ]],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255 }
            });

            doc.save('laporan-penitipan-habis.pdf');
        };
        } catch (err) {
        console.error('❌ Gagal ambil data laporan:', err);
        alert('❌ Gagal memuat data laporan.');
        }
    };

    return (
        <div>
        <h4 className="mb-3"></h4>
        <Button variant="danger" onClick={downloadPDF}>
            ⬇️ Unduh PDF Laporan
        </Button>
        </div>
    );
    };

    export default LaporanPenitipanHabis;
