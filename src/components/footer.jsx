    import React from 'react';
    import { Container, Row, Col } from 'react-bootstrap';
    import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from 'react-icons/fa';

    const Footer = () => {
    return (
        <footer className="bg-light py-5 border-top mt-5">
        <Container fluid className="px-4 px-md-5">
            <Row className="gy-4 justify-content-between text-start">
            <Col md={3}>
                <h6 className="fw-bold mb-3">REUSEMART - 1ST YOGYAKARTA ONLINE MARKET</h6>
                <div className="d-flex gap-3 fs-5">
                <FaTwitter /> <FaFacebookF /> <FaInstagram /> <FaYoutube /> <FaPinterest />
                </div>
            </Col>
            <Col md={2}>
                <h6 className="fw-bold mb-2">CONTACT</h6>
                <small className="text-muted">HOTLINE 24/7</small>
                <p className="fw-bold mt-1 mb-0">(0274) 2987-6543</p>
            </Col>
            <Col md={3}>
                <h6 className="fw-bold mb-2">LOCATIONS</h6>
                <p className="mb-0">Jl. Tugu Pal Putih No. 1, Jetis, Kota Yogyakarta, Yogyakarta 55233</p>
                <small>contact@reusemart.com</small>
            </Col>
            <Col md={2}>
                <h6 className="fw-bold mb-2">COMPANY</h6>
                <p className="mb-1">About Reusemart</p>
            </Col>
            <Col md={2}>
                <h6 className="fw-bold mb-2">HELP CENTER</h6>
                <p className="mb-1">Customer Service</p>
                <p className="mb-1">My Account</p>
            </Col>
            </Row>
        </Container>
        </footer>
    );
    };

    export default Footer;
