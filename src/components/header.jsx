    import React from 'react';
    import {
    Navbar, Nav, Container, Form, FormControl, Button, NavDropdown, Row, Col, Badge,
    } from 'react-bootstrap';
    import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
    import { Link } from 'react-router-dom';


    const Header = () => {
    return (
        <>
        <Navbar bg="light" expand="lg" className="border-bottom py-3 shadow-sm">
            <Container fluid className="px-4 px-md-5">
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img
                src="/Logo ReUseMart.png"
                alt="ReUseMart Logo"
                width="75"
                height="75"
                style={{ objectFit: 'contain' }}
            />
            <span className="fw-bold text-success fs-4">ReUseMart</span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar" />
            <Navbar.Collapse id="main-navbar">
                <Nav className="me-auto ms-5 gap-3">
                <NavDropdown title="HOMES"><NavDropdown.Item href="#">Home 1</NavDropdown.Item></NavDropdown>
                <NavDropdown title="PAGES"><NavDropdown.Item href="#">About</NavDropdown.Item></NavDropdown>
                <NavDropdown title="PRODUCTS"><NavDropdown.Item href="#">All Products</NavDropdown.Item></NavDropdown>
                <Nav.Link href="#">CONTACT</Nav.Link>
                </Nav>
                <Nav className="ms-auto align-items-center gap-3">
                <Nav.Link><FaHeart className="fs-5 text-dark" /></Nav.Link>
                <div className="text-end">
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>WELCOME</div>
                    <div className="d-flex gap-2 mt-1">
                <Button
                    as={Link}
                    to="/login"
                    variant="outline-success"
                    className="px-3 py-1 fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                >
                    LOG IN
                </Button>
                <Button
                    as={Link}
                    to="/register"
                    variant="outline-success"
                    className="px-3 py-1 fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                >
                    REGISTER
                </Button>
                </div>

                </div>
                <Nav.Link href="#" className="position-relative d-flex align-items-center">
                    <FaShoppingCart className="fs-5 text-dark" />
                    <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">5</Badge>
                    <span className="ms-2 fw-bold text-dark">$1,689.00</span>
                </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>

        <div className="bg-success text-white py-3">
            <Container fluid className="px-4 px-md-5">
            <Row className="align-items-center g-3">
                <Col md={6}>
                <Form className="d-flex bg-white rounded-3 overflow-hidden shadow-sm">
                    <Form.Select className="border-0 bg-light text-dark" style={{ maxWidth: '150px' }}>
                    <option>All Categories</option>
                    <option>Electronics</option>
                    </Form.Select>
                    <FormControl type="text" placeholder="Search anything..." className="border-0 px-3 text-dark" />
                    <Button variant="success" className="px-4"><FaSearch /></Button>
                </Form>
                </Col>
                <Col md={6}>
                <div className="d-flex justify-content-md-end text-center text-md-end flex-wrap gap-4 fw-semibold">
                    <span>FREE SHIPPING OVER $199</span>
                    <span>30 DAYS MONEY BACK</span>
                    <span>100% SECURE PAYMENT</span>
                </div>
                </Col>
            </Row>
            </Container>
        </div>
        </>
    );
    };

    export default Header;