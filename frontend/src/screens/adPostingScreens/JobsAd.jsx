import React, { useState,useEffect } from "react";
import "../../App.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector,useDispatch } from "react-redux";
import { getCookie } from "../../cookies/getCookie";
import { getAllPosts } from "../../functions/allPosts";
import { verifyToken } from "../../functions/verifyToken";
import { useLocation } from "react-router-dom";
import Nav from "../../components/Navbar/Nav";
const JobsAd = () => {
  //ye agar update ad ki request hogi tu ismay data hoga
  const location = useLocation();
  const adId = location.state?.adId;
  const adData = location.state?.adData;
  console.log(adData,adId)
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
  const [previewURL,setPreviewUrl] = useState([])
  const [formShow, setFormShow] = useState(false);
  const [vehicleAdData, setVehicleAdData] = useState({
    category:adData?.category || "",
    images: adData?.imagesURL || [],
    hiringPersonOrCompany: adData?.hiringPersonOrCompany ||"",
    companyName: adData?.companyName ||"",
    typeOfAd: adData?.typeOfAd ||"",
    salaryFrom: adData?.salaryFrom ||"",
    salaryTo: adData?.salaryTo ||"",
    careerLevel: adData?.careerLevel ||"",
    salaryPeriod: adData?.salaryPeriod ||"",
    positionType: adData?.positionType ||"",
    adTitle: adData?.adTitle ||"",
    description: adData?.description ||"",
    city: adData?.city ||"",
    province: adData?.province ||"" , 
    ownerName: adData?.ownerName ||"",
    phoneNo: adData?.mobileNo ||"",
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
    const file = files[0]
    setVehicleAdData((prevState) => {
      const updatedImages = [...prevState.images];
      updatedImages[index] = file;
      // updatedImages[index] = URL.createObjectURL(files[0]); // Create a preview URL for the image
      return { ...prevState, images: updatedImages };
    });
    // const file = event.target.files[0];
    // setVehicleAdData((prevState) => {
    // const updatedImages = [...prevState.images];
    // updatedImages[index] = file;
    // return { ...prevState, images: updatedImages };
    // });

    // Create a preview URL for the image
    const previewURL = URL.createObjectURL(file);
    setPreviewUrl((prevUrls) => {
    const newPreviewUrls = [...prevUrls];
    newPreviewUrls[index] = previewURL;
    return newPreviewUrls;
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
    postData.append("createdBy"  , user._id)
    console.log(postData);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/posts/jobs${adId ? `/${adId}` : ""}`,
        {
          method: adId ? "PUT" : "POST",
          body: postData,
        }
      );
      let data = await response.json();
      console.log(data);
      if (data.success) {
        alert(adId ? "Ad updated successfully" : "Ad posted successfully");
        //dispatch(setUserDataWithRedux({payload: data.userData}))
        //console.log(data.userData)
        //setCookie("token" , data.userData)
        //navigate("/home")
      } else {
        alert("Failed to submit the ad");
        alert(data.message)
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    return () => {
      previewURL.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewURL]);
  return (
    <>
    <Nav/>
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white border border-black  rounded-lg mt-8">
      
      {!formShow && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <h2>Select a Subcategory</h2>
          {categoryData.map((cat) => (
            <li
              key={cat}
              className="p-4  border border-black rounded-lg text-center cursor-pointer hover:bg-orange-300"
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
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="py-4 border-b border-black">
          <h3 className="text-xl font-semibold mb-4">Category  <span className="text-sm pl-24">{vehicleAdData.category}</span></h3>
          </div>
          <div className="upload-container border-b border-black pb-4">
            <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <div key={index}>
                <input
                  type="file"
                  id={`file${index + 1}`}
                  accept="image/*"
                  onChange={(event) => handleFileChange(event, index)}
                  className="hidden"
                />
                <label
                  htmlFor={`file${index + 1}`}
                  className="block w-full h-32 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center"
                >
                  {previewURL[index] ? (
                    <img
                      src={previewURL[index]}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    <i className="upload-icon text-gray-400"></i>
                  )}
                </label>
              </div>
                
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-r border-black">
              <label className="block text font-medium text-gray-700">Hiring Person / Company</label>
              <div className="my-2   mr-14">
                <p
                  className={`cursor-pointer p-2 border border-black rounded-lg ${
                    vehicleAdData.hiringPersonOrCompany === "Hiring as Company"
                      ? "bg-orange-300"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setVehicleAdData({
                      ...vehicleAdData,
                      hiringPersonOrCompany: "Hiring as Company",
                    })
                  }
                >
                  Hiring as Company
                </p>
                <p
                  className={`cursor-pointer  border border-black p-2 rounded-lg ${
                    vehicleAdData.hiringPersonOrCompany === "Hiring as Individual"
                      ? "bg-orange-300"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setVehicleAdData({
                      ...vehicleAdData,
                      hiringPersonOrCompany: "Hiring as Individual",
                    })
                  }
                >
                  Hiring as Individual
                </p>
                <p
                  className={`cursor-pointer border border-black p-2 rounded-lg ${
                    vehicleAdData.hiringPersonOrCompany === "Hiring as Third Party"
                      ? "bg-orange-300"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setVehicleAdData({
                      ...vehicleAdData,
                      hiringPersonOrCompany: "Hiring as Third Party",
                    })
                  }
                >
                  Hiring as Third Party
                </p>
              </div>
            </div>
            <div>
              <label className="block text font-medium text-gray-700">Company Name</label>
              <div className="border border-black rounded-lg mt-1"><input
                value={vehicleAdData.companyName}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setVehicleAdData({ ...vehicleAdData, companyName: e.target.value })
                }
                className="p-3 block w-full rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
              /></div>
            </div>
            <div className="border-r border-black">
              <label className="block text  font-medium text-gray-700">Ad Type</label>
              <div className="my-2 mr-14 ">
                <p
                  className={`cursor-pointer border border-black p-2 rounded-lg ${
                    vehicleAdData.typeOfAd === "Job wanted"
                      ? "bg-orange-300"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setVehicleAdData({...vehicleAdData , typeOfAd: "Job wanted"})}
                >
                  Job Wanted
                </p>
                <p
                  className={`cursor-pointer border border-black p-2 rounded-lg ${
                    vehicleAdData.typeOfAd === "Job offer"
                      ? "bg-orange-300"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setVehicleAdData({...vehicleAdData , typeOfAd: "Job offer"})}
                >
                  Job Offer
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text font-medium text-gray-700">Salary From</label>
                <div className="border border-black mt-1 rounded-md">
                <input
                  value={vehicleAdData.salaryFrom}
                  type="text"
                  placeholder=""
                  onChange={(e) =>
                    setVehicleAdData({ ...vehicleAdData, salaryFrom: e.target.value })
                  }
                  className="p-3 block w-full rounded-md focus:ring focus:ring-indigo-300"
                />
                </div>
              </div>
              <div >
                <label className="block text font-medium text-gray-700">Salary To</label>
                <div className="border border-black mt-1 rounded-md">
                <input
                  value={vehicleAdData.salaryTo}
                  type="text"
                  placeholder=""
                  onChange={(e) =>
                    setVehicleAdData({ ...vehicleAdData, salaryTo: e.target.value })
                  }
                  className="p-3 block w-full rounded-md  focus:ring focus:ring-indigo-300"
                />
                </div>
              </div>
            </div>
            <div className="mt-2 mr-4 border-t border-black">
              <label className="mt-2 block font-medium text-gray-700">Career Level</label>
              <Dropdown onSelect={handleCareerSelect}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-career"
                  className="w-full text-left p-3 mt-1 rounded-md border-black   focus:ring focus:bg-orange-300 focus:ring-white"
                >
                  {vehicleAdData.careerLevel || "Select Career Level"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Junior">Junior</Dropdown.Item>
                  <Dropdown.Item eventKey="Mid-Level">Mid-Level</Dropdown.Item>
                  <Dropdown.Item eventKey="Senior">Senior</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="mt-2 mr-4 border-t border-black">
              <label className="mt-2 block text font-medium text-gray-700">Salary Period</label>
              <Dropdown onSelect={handleSalaryPeriodSelect}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-salary-period"
                  className="w-full text-left p-3 mt-1 rounded-md border-black   focus:ring focus:bg-orange-300 focus:ring-white"
                >
                  {vehicleAdData.salaryPeriod || "Select Salary Period"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Hourly">Hourly</Dropdown.Item>
                  <Dropdown.Item eventKey="Weekly">Weekly</Dropdown.Item>
                  <Dropdown.Item eventKey="Monthly">Monthly</Dropdown.Item>
                  <Dropdown.Item eventKey="Yearly">Yearly</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="mr-4">
              <label className="block textfont-medium text-gray-700">Position Type</label>
              <Dropdown onSelect={handlePosTypeSelect}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-position-type"
                  className="w-full text-left p-3 mt-1 rounded-md border-black   focus:ring focus:bg-orange-300 focus:ring-white"
                >
                  {vehicleAdData.positionType || "Select Position Type"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Permanent">Permanent</Dropdown.Item>
                  <Dropdown.Item eventKey="Contract">Contract</Dropdown.Item>
                  <Dropdown.Item eventKey="Internship">Internship</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-span-2">
              <label className="block text font-medium text-gray-700">Ad Title</label>
              <div className="mt-1 border border-black rounded-md"><input
                value={vehicleAdData.adTitle}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setVehicleAdData({ ...vehicleAdData, adTitle: e.target.value })
                }
                className="p-3 block w-full rounded-md  focus:ring focus:ring-indigo-300"
              /></div>
            </div>
            <div className="col-span-2">
              <label className="block text font-medium text-gray-700">Description</label>
              <div className="mt-1 border border-black rounded-md"><textarea
                value={vehicleAdData.description}
                rows="4"
                placeholder=""
                onChange={(e) =>
                  setVehicleAdData({ ...vehicleAdData, description: e.target.value })
                }
                className=" p-3 block w-full rounded-md  focus:ring focus:ring-indigo-300"
              ></textarea></div>
            </div>
            <div>
              <label className="block text font-medium text-gray-700">Province</label>
              <Dropdown onSelect={handleProvinceSelect}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-province"
                  className="w-full text-left p-3 mt-1 rounded-md border-black  focus:ring focus:bg-orange-300 focus:ring-white"
                >
                  {vehicleAdData.province || "Select Province"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Punjab">Punjab</Dropdown.Item>
                  <Dropdown.Item eventKey="Sindh">Sindh</Dropdown.Item>
                  <Dropdown.Item eventKey="Khyber Pakhtunkhwa">
                    Khyber Pakhtunkhwa
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Balochistan">Balochistan</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div>
              <label className="block text font-medium text-gray-700">City</label>
              <Dropdown onSelect={handleCitySelect}>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-city"
                  className="w-full text-left p-3 mt-1 rounded-md border-black focus:ring focus:bg-orange-300 focus:ring-white"
                >
                  {vehicleAdData.city || "Select City"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Lahore">Lahore</Dropdown.Item>
                  <Dropdown.Item eventKey="Karachi">Karachi</Dropdown.Item>
                  <Dropdown.Item eventKey="Islamabad">Islamabad</Dropdown.Item>
                  <Dropdown.Item eventKey="Peshawar">Peshawar</Dropdown.Item>
                  <Dropdown.Item eventKey="Quetta">Quetta</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-span-2">
              <label className="block text font-medium text-gray-700">Owner Name</label>
              <div className="mt-1 border border-black rounded-md"><input
                value={vehicleAdData.ownerName}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setVehicleAdData({ ...vehicleAdData, ownerName: e.target.value })
                }
                className="p-3 block w-full rounded-md  focus:ring focus:ring-indigo-300"
              /></div>
            </div>
            <div className="col-span-2">
              <label className="block text font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 border border-black rounded-md"><input
                value={vehicleAdData.phoneNo}
                type="text"
                placeholder=""
                onChange={(e) =>
                  setVehicleAdData({ ...vehicleAdData, phoneNo: e.target.value })
                }
                className="p-3 block w-full rounded-md focus:ring focus:ring-indigo-300"
              /></div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded transform hover:scale-105 transition duration-300 ease-in-out"
            >
              {adId ? "Update Ad" : "Post Ad"}
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export default JobsAd;
