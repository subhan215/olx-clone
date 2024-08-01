import React, { useState } from "react";
import "../../App.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const MobileAd = () => {
  const user = useSelector((state) => state.userData.data);

  const categoryData = [
    "Tablets",
    "Smart Watches",
    "Mobile Phones",
  ];
  

  const [formShow, setFormShow] = useState(false);
  const [vehicleAdData, setVehicleAdData] = useState({
    category: "",
    images: [],
    brand: "",
    condition: "",
    adTitle: "",
    description: "",
    city: "",
    province: "" , 
    price: "",
    ownerName: "",
    phoneNo: "",
  });

  const handleBrandSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, brand: eventKey });
  };
  const handleCondSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, condition: eventKey });
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
    e.preventDefault();
    console.log(vehicleAdData)
    const postData = new FormData();
    postData.append("category", vehicleAdData.category);
    vehicleAdData.images.forEach((file, index) => {
      postData.append(`images`, file);
    });
    postData.append("brand", vehicleAdData.brand);
    postData.append("condition", vehicleAdData.condition);
    postData.append("adTitle", vehicleAdData.adTitle);
    postData.append("description", vehicleAdData.description);
    postData.append("province", vehicleAdData.province);
    postData.append("city", vehicleAdData.city);
    postData.append("price", vehicleAdData.price);
    postData.append("ownerName", vehicleAdData.ownerName);
    postData.append("phoneNo", vehicleAdData.phoneNo);
    console.log(postData);
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/posts/mobile",
        {
          method: "POST",
          body: postData,
        }
      );
      let data = await response.json();
      console.log(data);
      if (data.success) {
        //dispatch(setUserDataWithRedux({payload: data.userData}))
        //console.log(data.userData)
        //setCookie("token" , data.userData)
        //navigate("/home")
      } else {
      }
      alert(data.message);
    } catch (err) {
      console.log(err);
    }
  };
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
          <label>Brand:</label>
          <Dropdown onSelect={handleBrandSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Brand
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Samsung">Samsung</Dropdown.Item>
              <Dropdown.Item eventKey="Real Me">Real Me</Dropdown.Item>
              <Dropdown.Item eventKey="Oppo">Oppo</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div>
            <label>Condition: </label>
            <Dropdown onSelect={handleCondSelect}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select Condition
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="New">New</Dropdown.Item>
              <Dropdown.Item eventKey="Used">Used</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </div>
          <div>
            <label htmlFor="adTitle">Ad Title</label>
            <textarea
              id="adTitle"
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, adTitle: e.target.value })
              }
            ></textarea>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
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
              value={user?.fullName}
              onChange={(e) =>
                setVehicleAdData({
                  ...vehicleAdData,
                  ownerName: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="phonoNo">Phone No: </label>
            <input
              id="phonoNo"
              placeholder="Enter Phone No..."
              type="text"
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

export default MobileAd;