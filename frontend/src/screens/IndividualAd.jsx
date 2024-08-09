import React from 'react';
import { useSelector } from 'react-redux';
import { Carousel, Alert, Card, ListGroup, Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { getCookie } from "../cookies/getCookie";
import { getAllPosts } from "../functions/allPosts";
import { verifyToken } from "../functions/verifyToken";
import { setChat, setChatId, setChatMessages } from '../redux/slices/chatsData';

const IndividualAd = () => {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const token = getCookie("token");
    useEffect(() => {
        getAllPosts(dispatch);
        if (token) {
        verifyToken(dispatch);
        }
    }, [token, dispatch]);
    const user = useSelector((state) => state.userData.data);
    console.log(user)
    const adData = useSelector((state) => state.individualAd.data);
    const handleChat= async (adId , adCategory , createdBy)=>{
        if(createdBy == user._id) {
            alert("You can't create an ad with yourself!")
            return 
        }
        try {
            const response = await fetch('http://localhost:8000/api/v1/chat/new',{
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ 
                adId:adId,
                user:user._id , 
                createdBy
              }),
            })
            const data = await response.json()
            console.log(data)
            if(data.success){
                dispatch(setChat(data.chat))
                dispatch(setChatId(data.chat._id))
                dispatch(setChatMessages(data.chat.messages))
              navigate(`/chat`, { state: { user } }) //isko change karna hoga
            }else{
              alert(data.message)
            }
            
        } catch (error) {
          console.log(error)
        }
      }
    const renderImages = () => (
        adData && adData.imagesURL ? (
            <Carousel>
                {adData.imagesURL.map((url, index) => (
                    <Carousel.Item key={index}>
                        <img src={url} alt={`Slide ${index}`} className="d-block w-100" />
                    </Carousel.Item>
                ))}
            </Carousel>
        ) : null
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
            <Button variant="primary" className="mt-3" onClick={()=>{handleChat(adData._id,adData.category , adData.createdBy)}}>Contact Seller</Button>
        </div>
    );
};

export default IndividualAd;
