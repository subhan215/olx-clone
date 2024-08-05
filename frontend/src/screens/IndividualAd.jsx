import React from 'react';
import { useSelector } from 'react-redux';
import { Carousel, Alert, Card, ListGroup, Button } from 'react-bootstrap';


const IndividualAd = () => {
    const adData = useSelector((state) => state.individualAd.data);

    const renderImages = () => (
        <Carousel>
            {adData.imagesURL.map((url, index) => (
                <Carousel.Item key={index} >
                    <img src={url} alt={`Slide ${index}`} className="d-block w-100" />
                </Carousel.Item>
            ))}
        </Carousel>
    );

    const renderDetails = () => {
        const details = [
            { label: 'Category', value: adData.category },
            { label: 'Brand', value: adData.brand },
            { label: 'Condition', value: adData.condition },
            { label: 'Salary From', value: adData.salaryFrom },
            { label: 'Salary To', value: adData.salaryTo },
            { label: 'Career Level', value: adData.careerLevel },
            { label: 'Salary Period', value: adData.salaryPeriod },
            { label: 'Position Type', value: adData.positionType },
            { label: 'Make', value: adData.make },
            { label: 'Price', value: adData.price },
            { label: 'Owner Name', value: adData.ownerName },
            { label: 'Mobile No', value: adData.mobileNo },
            { label: 'Location', value: `${adData.city}, ${adData.province}` },
        ].filter(detail => detail.value);

        return (
            <Card>
                <Card.Header>Details</Card.Header>
                <ListGroup variant="flush">
                    {details.map((detail, index) => (
                        <ListGroup.Item key={index}>
                            <strong>{detail.label}:</strong> {detail.value}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        );
    };

    return (
        <div className="container mt-5">
            <div className='adNameImagesDiv'>
            <h1 className="mb-3">{adData.adTitle}</h1>
            {adData.price &&<h3 className="text-success mb-4">Rs {adData.price}</h3>}
            {renderImages()}
            </div>
            <div className="mt-4">{renderDetails()}</div>
            <Card className="mt-4">
                <Card.Header>Description</Card.Header>
                <Card.Body>
                    <Card.Text>{adData.description}</Card.Text>
                </Card.Body>
            </Card>
            <Alert variant="info" className="mt-4">
                <strong>Contact:</strong> {adData.ownerName} - {adData.mobileNo}
            </Alert>
            <Button variant="primary" className="mt-3">Contact Seller</Button>
        </div>
    );
};

export default IndividualAd;
