    import React from 'react';
    import { Card, Badge } from 'react-bootstrap';

    const ProductCard = ({ image, title, price, status, discount = null }) => {
    return (
        <Card className="border-0 shadow-sm h-100">
        <div className="position-relative">
            {discount && (
            <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                SAVE Rp {Number(discount).toLocaleString('id-ID')}
            </Badge>
            )}
            <Card.Img
            variant="top"
            src={image}
            style={{ objectFit: 'contain', height: '180px' }}
            />
        </div>
        <Card.Body className="px-3 py-2">
            <Card.Title style={{ fontSize: '1rem' }}>{title}</Card.Title>
            <Card.Text className="fw-bold text-danger mb-1">
            Rp {Number(price).toLocaleString('id-ID')}
            </Card.Text>
            {status && (
            <Card.Text className="small text-muted mb-0">{status}</Card.Text>
            )}
        </Card.Body>
        </Card>
    );
    };

    export default ProductCard;