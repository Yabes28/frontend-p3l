    // src/components/NewArrivalSection.jsx
    import React, { useEffect, useState } from 'react';
    import { Container, Row, Col, Spinner } from 'react-bootstrap';
    import axios from 'axios';
    import ProductCard from './productCard';

    const NewArrivalSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8000/api/produk')
        .then(res => {
            setProducts(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching produk:', err);
            setLoading(false);
        });
    }, []);

    return (
        <section className="py-5 bg-white">
        <Container fluid className="px-4 px-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">NEW ARRIVAL</h4>
            <a href="#" className="text-decoration-none fw-semibold small">View All</a>
            </div>
            {loading ? (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
            ) : (
            <Row xs={1} sm={2} md={3} lg={5} className="g-4">
                {products.map((product, idx) => (
                <Col key={idx}>
                    <ProductCard
                    image={`/images/${product.namaProduk.toLowerCase().replace(/\s/g, '-')}.png`}
                    title={product.namaProduk}
                    price={product.harga.toLocaleString('id-ID')}
                    discount={null}
                    status={product.status}
                    />
                </Col>
                ))}
            </Row>
            )}
        </Container>
        </section>
    );
    };

    export default NewArrivalSection;
