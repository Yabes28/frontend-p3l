    // src/pages/Cart.jsx
    import React, { useState, useMemo } from 'react';
    import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
    import { FaTimes } from 'react-icons/fa';

    const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
        id: 1,
        name: 'SROK Smart Phone 128GB, Oled Retina',
        price: 5500000,
        img: '/product-1.jpg',
        shipping: 0,
        shippingLabel: 'FREE SHIPPING',
        stock: 'In stock',
        },
        {
        id: 2,
        name: 'iPad Pro Tablet 2023 LTE + WiFi, GPS Cellular 12.9 Inch, 512GB',
        price: 6250000,
        img: '/product-3.jpg',
        shipping: 25000,
        shippingLabel: 'Rp 25.000,00 SHIPPING',
        stock: 'In stock',
        },
        {
        id: 3,
        name: 'Samsung Galaxy X6 Ultra LTE 4G/128 GB, Black Smartphone',
        price: 4350000,
        img: '/product-2.jpg',
        shipping: 0,
        shippingLabel: 'FREE SHIP',
        stock: 'In stock',
        },
    ]);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

    const summary = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
        const shipping = cartItems.reduce((sum, item) => sum + item.shipping, 0);
        const tax = Math.round(subtotal * 0.0132); // asumsi 1.32% tax
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    }, [cartItems]);

    return (
        <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
        <Container fluid className="px-4 px-md-5">
            <div className="mb-4 text-muted fw-semibold">
            <span className="text-secondary">Home</span> / <span className="text-secondary">pages</span> /{' '}
            <span className="text-dark">cart</span>
            </div>

            <Row className="gx-4 gy-4">
            <Col lg={8}>
                {cartItems.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
                ) : (
                cartItems.map((item) => (
                    <Card className="mb-3 shadow-sm position-relative" key={item.id}>
                        <Button
                            variant="link"
                            className="position-absolute top-0 end-0 p-2"
                            style={{ color: 'rgba(0, 0, 0, 0.3)', transition: 'color 0.2s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0, 0, 0, 0.3)'}
                            onClick={() => handleRemove(item.id)}
                            >
                            <FaTimes />
                        </Button>
                    <Card.Body className="d-flex flex-wrap gap-4 align-items-center">
                        <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                        />
                        <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{item.name}</h6>
                        <p className="text-success fw-semibold mb-2">{formatCurrency(item.price)}</p>
                        <div className="d-flex gap-3 align-items-center">
                            <Badge bg="success" className="text-uppercase">{item.shippingLabel}</Badge>
                            <Badge bg="light" text="success" className="border border-success">{item.stock}</Badge>
                        </div>
                        </div>
                    </Card.Body>
                    </Card>
                ))
                )}
            </Col>

            <Col lg={4}>
                <Card className="shadow-sm border border-success">
                <Card.Header className="bg-white fw-bold text-success">Order Summary</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                    <span>Sub Total:</span>
                    <span>{formatCurrency(summary.subtotal)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                    <span>Shipping estimate:</span>
                    <span>{formatCurrency(summary.shipping)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                    <span>Tax estimate:</span>
                    <span>{formatCurrency(summary.tax)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between fw-bold text-success">
                    <span>ORDER TOTAL:</span>
                    <span>{formatCurrency(summary.total)}</span>
                    </ListGroup.Item>
                </ListGroup>
                <Card.Footer className="bg-white">
                    <Button
                    variant="success"
                    className="w-100 fw-semibold"
                    disabled={cartItems.length === 0}
                    >
                    CHECKOUT
                    </Button>
                </Card.Footer>
                </Card>
            </Col>
            </Row>
        </Container>
        </div>
    );
    };

    export default Cart;