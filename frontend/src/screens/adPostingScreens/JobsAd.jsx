import React, { useState } from "react";
import "../../App.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const JobsAd = () => {
  const user = useSelector((state) => state.userData.data);

  const categoryData = [
    "Accounting and Finance",
    "Advertising and PR",
    "Architect and Interior Design",
    "Clierical and Administration",
    "Content Writing",
    "Customer Service",
    "Delivery Riders",
    "Domestic Staff",
    "Education",
    "Engineering",
    "Graphic Design",
    "Hotels and Tourism",
    "Human Resources",
    "Internships",
    "IT and Networking",
    "Manufacuring",
    "Marketing",
    "Medical",
    "Online",
    "Other Jobs",
    "Part Time",
    "Real Estate",
    "Restaurants and Hospitality",
    "Sales",
    "Security",
  ];

  const [formShow, setFormShow] = useState(false);
  const [vehicleAdData, setVehicleAdData] = useState({
    category: "",
    images: [],
    hiringPersonOrCompany: "",
    companyName: "",
    typeOfAd: "",
    salaryFrom: "",
    salaryTo: "",
    careerLevel: "",
    salaryPeriod: "",
    positionType: "",
    adTitle: "",
    description: "",
    city: "",
    province: "" , 
    ownerName: "",
    phoneNo: "",
  });

  const handleCareerSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, careerLevel: eventKey });
  };
  const handleSalaryPeriodSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, salaryPeriod: eventKey });
  };
  const handlePosTypeSelect = (eventKey) => {
    setVehicleAdData({ ...vehicleAdData, positionType: eventKey });
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
    console.log(vehicleAdData);
    const postData = new FormData();
    postData.append("category", vehicleAdData.category);
    vehicleAdData.images.forEach((file, index) => {
      postData.append(`images`, file);
    });
    postData.append("hiringPersonOrCompany", vehicleAdData.hiringPersonOrCompany);
    postData.append("companyName", vehicleAdData.companyName);
    postData.append("typeOfAd", vehicleAdData.typeOfAd);
    postData.append("salaryFrom", vehicleAdData.salaryFrom);
    postData.append("salaryTo", vehicleAdData.salaryTo);
    postData.append("salaryPeriod", vehicleAdData.salaryPeriod);
    postData.append("careerLevel", vehicleAdData.careerLevel);
    postData.append("positionType", vehicleAdData.positionType);
    postData.append("adTitle", vehicleAdData.adTitle);
    postData.append("description", vehicleAdData.description);
    postData.append("city", vehicleAdData.city);
    postData.append("province", vehicleAdData.province);
    postData.append("ownerName", vehicleAdData.ownerName);
    postData.append("phoneNo", vehicleAdData.phoneNo);
    console.log(postData);
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/posts/jobs",
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
          <div>
            <label>Hiring Person / Company</label>
            <p onClick={() => setVehicleAdData({...vehicleAdData , hiringPersonOrCompany: "Hiring as Company"}) }>Hiring as Company</p>
            <p onClick={() => setVehicleAdData({...vehicleAdData , hiringPersonOrCompany: "Hiring as Individual"}) }>Hiring as Individual</p>
            <p onClick={() => setVehicleAdData({...vehicleAdData , hiringPersonOrCompany: "Hiring as Third Party"}) }>Hiring as Third Party</p>
          </div>
          <div>
            <label htmlFor="">Company Name</label>
            <input type="text" placeholder="Enter Company Name" onChange={(e)=> setVehicleAdData({...vehicleAdData , companyName: e.target.value})}/>
          </div>
          <div>
          <label htmlFor="">Type of Ad</label>
            <p onClick={() => setVehicleAdData({...vehicleAdData , typeOfAd: "Job Wanted"})}>Job Wanted</p>
            <p  onClick={() => setVehicleAdData({...vehicleAdData , typeOfAd: "Job Offer"})}>Job Offer</p>
          </div>
          <div>
          <label htmlFor="">Salary from</label>
            <input type="text" placeholder="Enter salary from" onChange={(e)=> setVehicleAdData({...vehicleAdData , salaryFrom: e.target.value})}/>
          </div>
          <div>
          <label htmlFor="">Salary to</label>
            <input type="text" placeholder="Enter salary to" onChange={(e) => setVehicleAdData({...vehicleAdData , salaryTo: e.target.value})}/>
          </div>
          <div>
            <label htmlFor="">Career level*</label>
          <Dropdown onSelect={handleCareerSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select career level
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Entry Level">Entry Level</Dropdown.Item>
                <Dropdown.Item eventKey="Associate">Associate </Dropdown.Item>
                <Dropdown.Item eventKey="Mid Senior Level">Mid Senior Level</Dropdown.Item>
                <Dropdown.Item eventKey="Director">Director</Dropdown.Item>
                <Dropdown.Item eventKey="Executive">Executive</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
         
          <div>
            <label htmlFor="">Salary Period*</label>
          <Dropdown onSelect={handleSalaryPeriodSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select salary period
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Monthly">Monthly </Dropdown.Item>
                <Dropdown.Item eventKey="Hourly">Hourly</Dropdown.Item>
                <Dropdown.Item eventKey="Weekly">Weekly</Dropdown.Item>
                <Dropdown.Item eventKey="Yearly">Yearly</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <label htmlFor="">Position Type*</label>
          <Dropdown onSelect={handlePosTypeSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select position type
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="Full Time">Full Time</Dropdown.Item>
                <Dropdown.Item eventKey="Part Time">Part Time</Dropdown.Item>
                <Dropdown.Item eventKey="Contract">Contract </Dropdown.Item>
                <Dropdown.Item eventKey="Temporary">Temporary</Dropdown.Item>
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

export default JobsAd;