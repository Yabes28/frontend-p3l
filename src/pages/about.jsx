    // src/pages/About.js
    import React from 'react';
    import { Container, Row, Col } from 'react-bootstrap';

    const About = () => {
    return (
        <Container className="py-5">
        <Row>
            <Col>
            <h2 className="mb-4">Tentang ReuseMart</h2>
            <p>
                ReuseMart adalah perusahaan yang bergerak di bidang penjualan barang bekas berkualitas yang berbasis di Yogyakarta. Kami memfasilitasi masyarakat untuk menjual dan membeli barang bekas dalam berbagai kategori, baik elektronik maupun non-elektronik, mulai dari kulkas, TV, oven, meja makan, rak buku, pakaian, buku, sepatu, dan banyak lagi.
            </p>
            <p>
                Platform ini hadir sebagai jembatan bagi masyarakat yang ingin mendapatkan barang berkualitas dengan harga terjangkau, sekaligus berkontribusi dalam upaya pengurangan limbah dan pelestarian lingkungan.
            </p>
            <p>
                Tidak seperti platform marketplace pada umumnya, ReuseMart menghadirkan layanan unggulan berupa sistem penitipan barang. Layanan ini sangat cocok bagi mereka yang tidak ingin repot mengurus penjualan barangnya secara mandiri. Kami menyediakan gudang penyimpanan, tim pemasaran, serta sistem manajemen terpadu yang akan mengelola barang selama periode tertentu. Jika barang tidak terjual, pemilik dapat mengambilnya kembali atau barang tersebut akan disumbangkan ke organisasi sosial atau lembaga amal yang membutuhkan. Dengan cara ini, tidak ada barang yang terbuang sia-sia dan setiap barang memiliki kesempatan untuk memberikan manfaat baru.
            </p>
            <p>
                Dalam upaya menciptakan sistem yang terintegrasi dan ramah pengguna, ReuseMart bekerja sama dengan GreenTech Solutions—sebuah perusahaan pengembang sistem informasi yang berpengalaman dalam membangun platform digital berbasis lingkungan dan e-commerce. GreenTech mengembangkan sistem informasi ReuseMart agar mampu menangani seluruh proses jual beli, penitipan, hingga pengiriman barang secara efisien.
            </p>
            <p>
                Dengan hadirnya ReuseMart, kami berharap masyarakat semakin sadar akan pentingnya penggunaan kembali barang bekas, mendukung pengurangan limbah, dan bersama-sama menciptakan peluang ekonomi baru yang berkelanjutan di sektor barang bekas berkualitas.
            </p>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col md={6}>
            <h3 className="mb-3">Visi Kami</h3>
            <p>
                Menjadi platform terdepan dalam ekosistem ekonomi sirkular di Indonesia dengan mendorong budaya reuse demi masa depan yang lebih hijau dan berkelanjutan.
            </p>
            </Col>
            <Col md={6}>
            <h3 className="mb-3">Misi Kami</h3>
            <ul>
                <li>Meningkatkan kesadaran masyarakat akan pentingnya penggunaan kembali barang bekas.</li>
                <li>Menyediakan sarana transaksi online yang mudah, aman, dan transparan.</li>
                <li>Mendukung pelestarian lingkungan melalui pengurangan sampah konsumsi rumah tangga.</li>
                <li>Menghubungkan penjual dan pembeli barang bekas dalam komunitas reuse yang inklusif.</li>
            </ul>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
            <h3 className="mb-3">Nilai-Nilai Kami</h3>
            <ul>
                <li><strong>Keberlanjutan:</strong> Menjadikan lingkungan sebagai prioritas utama.</li>
                <li><strong>Inovasi:</strong> Mengembangkan solusi digital yang memudahkan proses reuse.</li>
                <li><strong>Komunitas:</strong> Membangun ruang kolaboratif antar pengguna.</li>
                <li><strong>Integritas:</strong> Menjaga kepercayaan dan keamanan transaksi.</li>
            </ul>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
            <p>
                Mari bergabung bersama ReuseMart dalam membentuk gaya hidup berkelanjutan dan menciptakan perubahan positif bagi lingkungan dan masyarakat.
            </p>
            </Col>
        </Row>
        </Container>
    );
    };

    export default About;