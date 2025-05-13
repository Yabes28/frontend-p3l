    import React from 'react';
    import { Container } from 'react-bootstrap';

    const Banner = () => {
    return (
        <div className="bg-light py-4">
        <Container fluid className="px-4 px-md-5">
            <div className="rounded overflow-hidden shadow-sm">
            <img
                src="/banner-headphone.jpg"
                alt="Noise Cancelling Headphone"
                className="img-fluid w-100"
                style={{
                height: '150px',          
                objectFit: 'cover',       
                borderRadius: '10px'
                }}
            />
            </div>
        </Container>
        </div>
    );
    };

    export default Banner;