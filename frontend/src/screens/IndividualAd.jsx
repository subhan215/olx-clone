import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Carousel, Alert, Card, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { setChat, setChatId, setChatMessages } from '../redux/slices/chatsData';
import { getCookie } from "../cookies/getCookie";
import { getAllPosts } from "../functions/handlesPosts/allPosts";
import { verifyToken } from "../functions/handlesUser/verifyToken";
import Nav from '../components/Navbar/Nav';
import { setIndividualAdData } from '../redux/slices/individualAd';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const IndividualAd = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = getCookie("token");
    const user = useSelector((state) => state.userData.data);
    const adData = useSelector((state) => state.individualAd.data);

    const [transactionStatus, setTransactionStatus] = useState(null);
    const [rating, setRating] = useState(0);
    const [transaction, setTransaction] = useState(null); // Store full transaction details
    const fetchTransaction = async (adId) => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/transaction/getSpecificTransaction', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({ adId}),
            });
            const data = await response.json();
            if (data.success) {
                setTransactionStatus(data.t.status);
                setTransaction(data.t); // Save full transaction details
                if (data.t.rating) {
                    setRating(data.t.rating); // Set rating if already provided
                }
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching transaction:', error);
        }
    };
    useEffect(() => {
        getAllPosts(dispatch);
        if (token) {
            verifyToken(dispatch);
        }
    }, [token, dispatch]);
    useEffect(()=> {
        let ad = getCookie("ad")
        console.log(ad)
        if(ad) {
            dispatch(setIndividualAdData({payload: ad}))
        }
    } , [])

    useEffect(() => {
        fetchTransaction(adData?._id);
    }, [adData?._id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/transaction/${adData._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, userId: user._id }),
            });
            const result = await response.json();
            if (result.success) {
                setTransactionStatus(newStatus);
                console.log(result)
                setTransaction(result.t)
               // fetchTransaction(result.ad._id)
                dispatch(setIndividualAdData({ payload: result.ad }))
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error updating transaction status:', error);
        }
    };

    const handleRating = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/transaction/${transaction._id}/rate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, userId: user._id }),
            });
            const result = await response.json();
            if (result.success) {
                setRating(rating); // Update rating in state
                setTransaction(result.t)
                console.log(result.t)
                dispatch(setIndividualAdData({payload: result.ad}))
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error updating transaction rating:', error);
        }
    };

    const handleCreateTransaction = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/transaction/create', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    adId: adData._id,
                    sellerId: adData.createdBy,
                    buyerId: user._id,
                    adTitle: adData.adTitle,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setTransaction(data.t); // Store the created transaction
                setTransactionStatus(data.t.status);
                console.log(data.t)
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChat = async (adId, adCategory, createdBy) => {
        if (createdBy === user._id) {
            alert("You can't create an ad with yourself!");
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/v1/chat/new', {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    adId: adId,
                    user: user._id,
                    createdBy,
                }),
            });
            const data = await response.json();
            if (data.success) {
                dispatch(setChat(data.chat));
                dispatch(setChatId(data.chat._id));
                dispatch(setChatMessages(data.chat.messages));

                try {
                    const response = await fetch(`http://localhost:8000/api/v1/chat/${data.chat._id}`, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({ userId: user._id }),
                    });
                    const data1 = await response.json();
                    if (data1.success) {
                        dispatch(setChatMessages(data1.messages));
                    } else {
                        alert(data1.message);
                    }
                } catch (error) {
                    console.log(error);
                }

                navigate(`/chat`, { state: { user } });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

        const renderImages = () => (

            adData && adData.imagesURL ? (
                <Carousel className="h-full">
                    {adData.imagesURL.map((url, index) => (
                        <Carousel.Item key={index}>
                            <img
                                src={url}
                                alt={`Slide ${index}`}
                                className="object-cover w-full h-[80vw] "
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <div>No images</div>
            )
        );

    const renderDetails = () => {
        const details = [
            { label: 'Category', value: adData?.category },
            { label: 'Brand', value: adData?.brand },
            { label: 'Condition', value: adData?.condition },
            { label: 'Salary From', value: adData?.salaryFrom },
            { label: 'Salary To', value: adData?.salaryTo },
            { label: 'Career Level', value: adData?.careerLevel },
            { label: 'Salary Period', value: adData?.salaryPeriod },
            { label: 'Position Type', value: adData?.positionType },
            { label: 'Make', value: adData?.make },
            { label: 'Price', value: adData?.price },
            { label: 'Owner Name', value: adData?.ownerName },
            { label: 'Mobile No', value: adData?.mobileNo },
            { label: 'Location', value: `${adData?.city}, ${adData?.province}` },
        ].filter(detail => detail.value);
        
        return (
            // <Card className="bg-white shadow-md rounded-md">
            //     <Card.Header className="bg-orange-400 text-white">Details</Card.Header>
            //     <ListGroup variant="flush">
            //         {details.map((detail, index) => (
            //             <ListGroup.Item key={index} className="py-2 px-3">
            //                 <strong>{detail.label}:</strong> {detail.value}
            //             </ListGroup.Item>
            //         ))}
            //     </ListGroup>
            // </Card>
            <div className="bg-white  rounded border border-black mt-4">
            <div className="bg-white text-black font-bold p-4 rounded-t-md border-b border-black">Details</div>
            <ul className="p-4">
                {details.map((detail, index) => (
                    <li key={index} className="py-2 ">
                        <strong>{detail.label}:</strong> {detail.value}
                    </li>
                ))}
            </ul>
        </div>
        );
    };

    let userRating = adData?.userRating
    // const fullStars = Math.floor(adData?.userRating);
    // const hasHalfStar = adData?.userRating % 1 >= 0.5;
    // const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    if (userRating === undefined || userRating === null) {
    userRating = 0; // Default value if userRating is not provided
    }
    
    // Ensure userRating is between 0 and 5
    userRating = Math.max(0, Math.min(userRating, 5));

    // Round down the rating to get the number of full stars
    const fullStars = Math.floor(userRating);
    const hasHalfStar = userRating - fullStars >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
        <>
            <Nav showBechDay={false} showSearchBar={false} showlocationBar={false} />
            <div className='border border-black my-10 mx-36 rounded-2xl px-4'>
            <div className='flex justify-center mx-auto mt-10 '>
                <div >
                {transactionStatus?.toLowerCase() === 'pending' && user?._id == transaction?.seller && (
                    <div
                        
                        className=" w-[25vw] text-center bg-yellow-100 border mt-2 border-black hover:bg-yellow-200 hover:cursor-pointer rounded p-3 font-semibold text-black"   onClick={() => handleStatusUpdate('In Progress')}
                    >
                        Mark as In Progress
                    </div>
                )}

                </div>
                

                <div>
                {(transactionStatus && user._id !== adData?.createdBy) ? (
                    <>
                        
                        {transactionStatus.toLowerCase() === 'in progress' && user?._id == transaction?.buyer && (
                            <div
                                
                                className="w-[25vw] text-center bg-green-300 border mt-2 border-black hover:bg-green-400 hover:cursor-pointer rounded p-3 font-semibold text-black"
                                onClick={() => handleStatusUpdate('Completed')}
                            >
                                Mark as Completed
                            </div>
                        )}

                        {transactionStatus.toLowerCase() === 'completed' && !transaction?.rating && user._id !== adData?.createdBy && (
                            <div className="mt-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    placeholder="Rate (1-5)"
                                    className="border border-gray-300 p-2 rounded mr-2"
                                />
                                <Button
                                    variant="warning"
                                    className="bg-yellow-500 text-white"
                                    onClick={handleRating}
                                >
                                    Submit Rating
                                </Button>
                            </div>
                        )}
                        {transaction?.rating && (
                            <p>Rating: {transaction.rating}</p>
                        )}
                    </>
                ) : (
                    adData?.createdBy !== user._id && (
                        <div
                            
                            className="w-[25vw] text-center bg-blue-200 border mt-2 border-black hover:bg-blue-300 hover:cursor-pointer rounded p-3 font-semibold text-black"
                            onClick={handleCreateTransaction}
                        >
                            Create Transaction
                        </div>
                    )
                )}
                </div>
                {(user?._id == transaction?.seller || user?._id == transaction?.buyer) && <div className='ml-4 w-[15vw] text-center bg-orange-300 border mt-2 border-black  hover:cursor-pointer rounded font-semibold p-3 text-black'>Status: {transactionStatus} </div>}
                <div className=" ml-4 mt-2 p-3 border border-black bg-white rounded-lg  flex items-center space-x-2">
                <div className="text-yellow-500 flex">
                    {Array(fullStars).fill().map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-xl" />
                    ))}
                    {hasHalfStar && <FaStarHalfAlt className="text-xl" />}
                    {Array(emptyStars).fill().map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-xl" />
                    ))}
                </div>
                <span className="text-gray-700">User Rating: {adData?.userRating} / 5</span>
                
                </div>
                </div>
                
            <div className="max-w-7xl mx-auto p-5 ">
                {/* <div className="flex justify-center mx-16 mb-4 flex-col md:flex-row  gap-4 md:gap-4"> */}
                    <div className="w-full flex item-center justify-center mb-4 bg-gray-200 rounded-lg">
                        {renderImages()}
                    </div>
                    {/* <div className="flex-none md:w-[25vw]">
                        <div className='border border-black p-2 rounded-lg m-1'><h1 className="text-xl font-semibold mb-2">{adData?.adTitle}</h1>
                        {adData?.price && <h3 className="text-orange-600 text-2xl mb-4">{`Rs ${adData?.price}`}</h3>}
                        <p className="text-gray-600 mb-4">{adData?.city}, {adData?.province}</p></div>
                        <div className="border border-black p-2 rounded-lg m-1">
                            <h4 className="text-lg font-bold mb-2">Contact Info</h4>
                            <p className="text-base mb-2">Phone: {adData?.mobileNo}</p>
                            <div
                                className="item-center bg-orange-600 border-orange-600 hover:bg-orange-500 hover:cursor-pointer rounded p-2 hover:border-orange-500 text-white"
                                onClick={() => handleChat(adData?._id, adData?.category, adData?.createdBy)}
                            >
                                Contact Seller
                            </div>
                        </div>
                    </div> */}

                    
                    {/* Alert Section
                    <div className="mt-4 bg-blue-100 text-blue-800 p-4 rounded-md">
                        <strong>Contact:</strong> {adData.ownerName} - {adData.mobileNo}
                    </div> */}
                {/* </div> */}
                
                <div className='flex justify-between'>
                <div className='border w-[50vw] border-black p-3 rounded-lg m-1 text-center'><h1 className="text-xl font-semibold mb-2">{adData?.adTitle}</h1>
                        {adData?.price && <h3 className="text-orange-600 text-2xl mb-4">{`Rs ${adData?.price}`}</h3>}
                        <p className="text-gray-600 mb-4">{adData?.city}, {adData?.province}</p>
                </div>
                <div className="w-[34vw] border border-black p-3 rounded-lg m-1 text-center flex flex-col items-center">
                <h4 className="text-lg font-bold mb-2">Contact Info</h4>
                <p className="text-base mb-2">Phone: {adData?.mobileNo}</p>
                <div
                    className="bg-orange-300 border mt-2 border-black hover:bg-orange-400 hover:cursor-pointer rounded p-3 font-semibold text-black"
                    onClick={() => handleChat(adData?._id, adData?.category, adData?.createdBy)}
                >
                    Contact Seller
                </div>
                </div>
                

                {/* <div>
                <div className="m-2 p-4 border border-black bg-white rounded-lg  flex items-center space-x-2">
                <div className="text-yellow-500 flex">
                    {Array(fullStars).fill().map((_, i) => (
                    <FaStar key={`full-${i}`} className="text-xl" />
                    ))}
                    {hasHalfStar && <FaStarHalfAlt className="text-xl" />}
                    {Array(emptyStars).fill().map((_, i) => (
                    <FaRegStar key={`empty-${i}`} className="text-xl" />
                    ))}
                </div>
                <span className="text-gray-700">User Rating: {adData?.userRating} / 5</span>
                
                </div>

                </div> */}

                
                </div>

                <div className='border border-black rounded-lg my-4 mx-1'>
                <div className="bg-white text-black font-bold p-4 rounded-t-md border-b border-black">Description</div>
                        <p className='p-4'>{adData?.description}</p>
                </div>
                <div className="mt-4">{renderDetails()}</div>
                {/* {transactionStatus?.toLowerCase() === 'pending' && user?._id == transaction?.seller && (
                            <Button
                                variant="primary"
                                className="mt-3 bg-blue-500 text-white"
                                onClick={() => handleStatusUpdate('In Progress')}
                            >
                                Mark as In Progress
                            </Button>
                        )}
                        {(user?._id == transaction?.seller || user?._id == transaction?.buyer) && <p>{transactionStatus}</p>}
                {(transactionStatus && user._id !== adData?.createdBy) ? (
                    <>
                        
                        {transactionStatus.toLowerCase() === 'in progress' && user?._id == transaction?.buyer && (
                            <Button
                                variant="primary"
                                className="mt-3 bg-blue-500 text-white"
                                onClick={() => handleStatusUpdate('Completed')}
                            >
                                Mark as Completed
                            </Button>
                        )}

                        {transactionStatus.toLowerCase() === 'completed' && !transaction?.rating && user._id !== adData?.createdBy && (
                            <div className="mt-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    placeholder="Rate (1-5)"
                                    className="border border-gray-300 p-2 rounded mr-2"
                                />
                                <Button
                                    variant="warning"
                                    className="bg-yellow-500 text-white"
                                    onClick={handleRating}
                                >
                                    Submit Rating
                                </Button>
                            </div>
                        )}
                        {transaction?.rating && (
                            <p>Rating: {transaction.rating}</p>
                        )}
                    </>
                ) : (
                    adData?.createdBy !== user._id && (
                        <Button
                            variant="primary"
                            className="mt-3 bg-blue-500 text-white"
                            onClick={handleCreateTransaction}
                        >
                            Create Transaction
                        </Button>
                    )
                )} */}
                {/* <div>user rating: {adData?.userRating}</div> */}
            </div>
            </div>
        </>
    );
};

export default IndividualAd;
