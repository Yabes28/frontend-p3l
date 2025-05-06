    import React from 'react';
    import { Container, Row, Col } from 'react-bootstrap';
    import ProductCard from './productCard';

    const products = [
    {
        image: '/products/headphone.png',
        title: 'BOSO 2 Wireless On Ear Headphone',
        price: '359.00',
        discount: null,
        status: 'Free Shipping · In Stock',
    },
    {
        image: '/products/ipad.png',
        title: 'QPod Pro 12.9 Inch M1 2023, 64GB + WiFi, GPS',
        price: '569.00',
        discount: 190,
        status: 'Free Shipping · In Stock',
    },
    {
        image: '/products/mini-pc.png',
        title: 'uLock Mini case 2.0, 32GB / 1TB',
        price: '1,729.00',
        discount: 58,
        status: 'Free Shipping · Out of Stock',
    },
    {
        image: '/products/applewatch.png',
        title: 'Apple Watch Series 6 GPS + Cellular',
        price: '979.00',
        discount: null,
        status: '$2.39 Shipping · Pre Order',
    },
    {
        image: '/products/charger.png',
        title: 'iSmart 24V Charger',
        price: '9.00',
        discount: 3,
        status: '$1.31 Shipping · Contact',
    },
    ];

    const NewArrivalSection = () => {
    return (
        <section className="py-5 bg-white">
        <Container fluid className="px-4 px-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">NEW ARRIVAL</h4>
            <a href="#" className="text-decoration-none fw-semibold small">View All</a>
            </div>
            <Row xs={1} sm={2} md={3} lg={5} className="g-4">
            {products.map((product, idx) => (
                <Col key={idx}><ProductCard {...product} /></Col>
            ))}
            </Row>
        </Container>
        </section>
    );
    };

    export default NewArrivalSection;