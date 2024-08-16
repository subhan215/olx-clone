import Nav from "../../components/Navbar/Nav";
import React, { useState,useEffect } from "react";
import "../../App.css";
import { Alert, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector,useDispatch } from "react-redux";
import { getCookie } from "../../cookies/getCookie";
import { getAllPosts } from "../../functions/handlesPosts/allPosts";
import { verifyToken } from "../../functions/handlesUser/verifyToken";
import { useLocation } from "react-router-dom";
import adsData from "../../redux/slices/adsData";
import MyAlert from "../../components/MyAlert";
const ServiceAd = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger"); 
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
    "Architect and Interior Design",
    "Camera Installation",
    "Car Rental",
    "Car Services",
    "Catering and Restaurant",
    "Construction Services",
    "Consultancy Services",
    "Domestic Help",
    "Drivers and Taxi",
    "Tuitions and Academics",
    "Electronics and Computer Repair",
    "Event Services",
    "Farm and Fresh Award",
    "Health and Beauty",
    "Home and Office Repair",
    "Insurance Services",
    "Movers and Packers",
    "Renting Services",
    "Tailor Services",
    "Travel and Visa",
    "Video and Photography",
    "Web Development",
    "Other Services",
  ];
  const cities = {
    'Sindh': ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpurkhas", "Badin", "Jacobabad", "Shikarpur", "Khairpur", "Ghotki", "Dadu", "Thatta", "Tando Adam", "Tando Allahyar", "Umerkot", "Sanghar", "Tharparkar", "Kashmore", "Jamshoro"],
    'Punjab': ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Sargodha", "Bahawalpur", "Gujrat", "Sheikhupura", "Mianwali", "Sahiwal", "Rahim Yar Khan", "Kasur", "Jhelum", "Okara", "Bahawalnagar", "Chiniot", "Hafizabad", "Khanewal"],
    'KPK': ["Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat", "Dera Ismail Khan", "Haripur", "Bannu", "Mansehra", "Charsadda", "Nowshera", "Swabi", "Karak", "Buner", "Lakki Marwat", "Hangu", "Lower Dir", "Upper Dir", "Shangla", "Battagram"],
    'Balochistan': ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi", "Zhob", "Chaman", "Dera Murad Jamali", "Pishin", "Nushki", "Kalat", "Jafarabad", "Mastung", "Awaran", "Bela", "Loralai", "Kharan", "Panjgur", "Lasbela", "Kohlu"],
    "Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot", "Bagh", "Kotli", "Pallandri", "Sudhanoti", "Bhimber", "Hattian Bala", "Hajira", "Abbaspur", "Barnala", "Sehnsa", "Chakswari", "Dadyal", "Chinari"]
  };
  const [previewURL,setPreviewUrl] = useState([])
  const [formShow, setFormShow] = useState(false);
  const [vehicleAdData, setVehicleAdData] = useState({
    category:adData?.category || "",
    images: adData?.imagesURL || [],
    adTitle: adData?.adTitle ||"",
    description: adData?.description ||"",
    city: adData?.city ||"" , 
    province: adData?.province ||"",
    ownerName: adData?.ownerName ||"",
    phoneNo: adData?.mobileNo ||"",
  });

  
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
    postData.append("adTitle", vehicleAdData.adTitle);
    postData.append("description", vehicleAdData.description);
    postData.append('city' , vehicleAdData.city)
    postData.append('province' , vehicleAdData.province)
    postData.append("ownerName", vehicleAdData.ownerName);
    postData.append("phoneNo", vehicleAdData.phoneNo);
    postData.append("createdBy"  , user._id)

    console.log(postData);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/posts/services${adId ? `/${adId}` : ""}`,
        {
          method: adId ? "PUT" : "POST",
          body: postData,
        }
      );
      let data = await response.json();
      console.log(data);
      if (data.success) {
        setAlertMessage(adId ? "Ad updated successfully" : "Ad posted successfully");
        
        setAlertVariant("success") 
      }
      else {
        setAlertMessage(data.message)
        setAlertVariant("error")
      }
      setShowAlert(true)
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
      {showAlert && (
       <MyAlert setShowAlert={setShowAlert} alertVariant= {alertVariant} alertMessage = {alertMessage}/>
    )}
    <Nav showSearchBar={false} showlocationBar={false} showBechDay={false}/>
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
                <div  key={index}>
                  <input
                    type="file"
                    id={`file${index + 1}`}
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, index)}
                    className="hidden"
                  />
                  <label htmlFor={`file${index + 1}`} className="block w-full h-32 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center justify-center">
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
          {/* <div>

            <label htmlFor="adTitle">Ad Title</label>
            <textarea
              id="adTitle"
              value={vehicleAdData.adTitle}
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, adTitle: e.target.value })
              }
            ></textarea>
          </div> */}
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
          {/* <div>
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
          </div> */}
          {/* <div>
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
          </div> */}
          {/* <div>
            <label htmlFor="ownerName">Name: </label>
            <input
              id="ownerName"
              value={vehicleAdData.ownerName}
              type="text"
              onChange={(e) =>
                setVehicleAdData({
                  ...vehicleAdData,
                  ownerName: e.target.value,
                })
              }
            />
          </div> */}
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
                  <Dropdown.Item eventKey="Balochistan">Kashmir</Dropdown.Item>
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
                {vehicleAdData.province&& cities[vehicleAdData.province].map((city) => (
                      <Dropdown.Item eventKey={city}>{city}</Dropdown.Item>
                    ))}
                  
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
          {/* <div>
            <label htmlFor="phonoNo">Phone No: </label>
            <input
              id="phonoNo"
              value={vehicleAdData.phoneNo}
              type="text"
              onChange={(e) =>
                setVehicleAdData({ ...vehicleAdData, phoneNo: e.target.value })
              }
            />
          </div> */}
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

export default ServiceAd;
