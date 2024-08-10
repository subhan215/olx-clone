import React, { useState,useEffect } from "react";
import "../../App.css";
import { Dropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../functions/verifyToken";
import { getCookie } from "../../cookies/getCookie";
import { getAllPosts } from "../../functions/allPosts";
import { useLocation } from "react-router-dom";
const VehicleAd = () => {
  //ye agar update ad ki request hogi tu ismay data hoga
  const location = useLocation();
  const adId = location.state?.adId;
  const adData = location.state?.adData;
  
  console.log(adId,adData)

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
  const categoryData = [
    "Cars",
    "Cars Accessories",
    "Spare Parts",
    "Buses, Vans,Trucks",
    "Rickshaw & Chingchi",
    "Other Vehicles",
    "Boats",
    "Tractors & Trailors",
  ];

  const [formShow, setFormShow] = useState(false);
  const [vehicleAdData, setVehicleAdData] = useState({
    category:adData?.category || "",
    images: adData?.imagesURL || [],
    make: adData?.make || "",
    adTitle: adData?.adTitle || "",
    description:adData?.description || "",
    city:adData?.city || "" , 
    province: adData?.province ||"" , 
    price: adData?.price ||"",
    ownerName: adData?.ownerName ||"",
    phoneNo: adData?.mobileNo ||"",
  });

  const handleMakeSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, make: eventKey });
  };

  const handleProvinceSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, province: eventKey });
  };
  const handleCitySelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, city: eventKey });
  };

  const handleFileChange = (event, index) => {
    const files = Array.from(event.target.files);
    setVehicleAdData((prevState) => {
      const updatedImages = [...prevState.images];
      updatedImages[index] = files[0];
      return { ...prevState, images: updatedImages };
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const postData = new FormData()
    postData.append('category' , vehicleAdData.category)
    vehicleAdData.images.forEach((file, index) => {
      postData.append(`images`, file);
  });
    postData.append('make' , vehicleAdData.make)
    postData.append('adTitle' , vehicleAdData.adTitle)
    postData.append('description' , vehicleAdData.description)
    postData.append('city' , vehicleAdData.city)
    postData.append('province' , vehicleAdData.province)
    postData.append('price' , vehicleAdData.price)
    postData.append('ownerName' , vehicleAdData.ownerName)
    postData.append('phoneNo' , vehicleAdData.phoneNo)
    postData.append("createdBy"  , user._id)
    console.log(postData)
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/posts/vehicle${adId ? `/${adId}` : ""}`,
        {
          method: adId ? "PUT" : "POST",
          body: postData,
        }
      );
      // const response = await fetch('http://localhost:8000/api/v1/posts/vehicle' , {
      //   method: "POST" , 
      //   body: postData
      // })
      let data = await response.json()
      console.log(data)
      if(data.success) {
        alert(adId ? "Ad updated successfully" : "Ad posted successfully");
          //dispatch(setUserDataWithRedux({payload: data.userData}))
          //console.log(data.userData)
          //setCookie("token" , data.userData)
          //navigate("/home")
   
      }
      else {
        alert("Failed to submit the ad");
        alert(data.message)
      }
      //alert(data.message)
    }
    catch(err) {
        console.log(err)
    }
  }
  return (
    <div>
      {!formShow && (
        <ul>
          {categoryData.map((cat) => (
            <li
              key={cat}
              onClick={() => {
                setFormShow(true);
                setVehicleAdData({ ...vehicleAdData, category: cat });
              }}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
      {formShow && (
        <form className="upload-form" onSubmit={handleFormSubmit}>
          <div className="upload-container">
            <h3>Upload Images</h3>
            <div className="upload-grid">
              {[...Array(12)].map((_, index) => (
                <div className="upload-item" key={index}>
                  <input
                    type="file"
                    id={`file${index + 1}`}
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, index)}
                  />
                  <label htmlFor={`file${index + 1}`} className="upload-label">
                    <i className="upload-icon"></i>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <label>Make:</label>
          <Dropdown onSelect={handleMakeSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Make
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Suzuki">Suzuki</Dropdown.Item>
              <Dropdown.Item eventKey="Toyota">Toyota</Dropdown.Item>
              <Dropdown.Item eventKey="Honda">Honda</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div>
            <label htmlFor="adTitle">Ad Title</label>
            <textarea
              id="adTitle"
              value={vehicleAdData.adTitle}
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, adTitle: e.target.value })
              }
            ></textarea>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={vehicleAdData.description}
              onChange={(e) =>
                setVehicleAdData({
                  ...vehicleAdData,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>
          <div>
            <label>City:</label>
            <Dropdown onSelect={handleCitySelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select City
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Karachi">Karachi</Dropdown.Item>
                <Dropdown.Item eventKey="Lahore">Lahore</Dropdown.Item>
                <Dropdown.Item eventKey="Islamabad">Islamabad</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <label>Province:</label>
            <Dropdown onSelect={handleProvinceSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select Province
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Sindh">Sindh</Dropdown.Item>
                <Dropdown.Item eventKey="Punjab">Punjab</Dropdown.Item>
                <Dropdown.Item eventKey="KPK">KPK</Dropdown.Item>
                <Dropdown.Item eventKey="Balochistan">Balochistan</Dropdown.Item>
                <Dropdown.Item eventKey="Kashmir">Kashmir</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <label htmlFor="price">Price: </label>
            <input
              id="price"
              value={vehicleAdData.price}
              placeholder="Enter Price..."
              type="text"
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, price: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="ownerName">Name: </label>
            <input
              id="ownerName"
              placeholder="Enter Name..."
              type="text"
              value={vehicleAdData.ownerName}
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, ownerName: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="phonoNo">Phone No: </label>
            <input
              id="phonoNo"
              placeholder="Enter Phone No..."
              type="text"
              value={vehicleAdData.phoneNo}
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, phoneNo: e.target.value })
              }
            />
          </div>
          <button type="Submit">Post Ad</button>
        </form>
      )}
    </div>
  );
};

export default VehicleAd;
