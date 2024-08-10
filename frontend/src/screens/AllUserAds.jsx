import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPhone, faCommentDots, faHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Nav from '../components/Navbar/Nav';
function AllUserAds() {
    const navigate = useNavigate()
    const location = useLocation();
    const user = location.state?.user;
    const [adsData, setAdsData] = useState({
        mobileAds: [],
        vehicleAds: [],
        jobAds: [],
        serviceAds: []
      });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      };
    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const response = await fetch(`http://localhost:8000/api/v1/users/getUserAds?id=${user._id}`, {
                  method: "GET",
                });
                const data = await response.json();
                if (data.success) {
                setAdsData(data.userAds);
                  console.log(data)
                } else {
                  console.log("cannot fetch data")
                }
              } catch (error) {
                console.error('Error updating profile:', error);
                
              }    
        }
        fetchData()
},[user])


const handleUpdate = (adId,adData,type) => {
  console.log(adId,adData,type)
  if(type==='Vehicle'){
    navigate(`/update-vehicle-ad/${adId}`, { state: { adId, adData } });
  }else if(type==='Mobile'){

  }else if(type==='Job'){
    
  }else if(type==='Service'){

  }else{
    console.error('Invalid ad type while navigating to update page')
  }
  };

  
  const handleDelete = async (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/users/deleteUserAd/${adId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          // Re-fetch data to reflect the deletion
          const fetchData = async () => {
            try {
              const response = await fetch(`http://localhost:8000/api/v1/users/getUserAds?id=${user._id}`, {
                method: 'GET',
              });
              const data = await response.json();
              if (data.success) {
                setAdsData(data.userAds);
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
          fetchData();
        } else {
          alert('Failed to delete ad');
        }
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const renderAdList = (ads, type) => (
    <div className="my-4 w-full">
      <h2 className="text-xl font-bold mb-2">{type} Ads</h2>
      <ul className="list-none">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <li key={ad._id} className="border p-4 mb-2 rounded flex items-center justify-between w-full">
              <div className="flex items-center w-full">
                <img
                  src={ad.imagesURL[0] || 'placeholder.jpg'}
                  alt={ad.adTitle}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{ad.adTitle} - in {type}</h3>
                  <p className="text-gray-600">Rs {ad.price}</p>
                  <p className="text-gray-600">Posted on {formatDate(ad.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                {/* <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faEye} />
                  <span>{ad.views || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{ad.tel || 0}</span>
                </div> */}
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCommentDots} />
                  <span>{ad.chatCount || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>{ad.likes.length}</span>
                </div>
                <button
                  onClick={() => handleUpdate(ad._id,ad,type)}
                  className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No ads available.</li>
        )}
      </ul>
    </div>
);  return (
    <div>
        <Nav/>
      <div className="w-screen ">
      <h1 className="text-2xl font-bold mb-4">Your Ads</h1>
      {renderAdList(adsData.mobileAds, 'Mobile')}
      {renderAdList(adsData.vehicleAds, 'Vehicle')}
      {renderAdList(adsData.jobAds, 'Job')}
      {renderAdList(adsData.serviceAds, 'Service')}
    </div>
    </div>
  )
}

export default AllUserAds
