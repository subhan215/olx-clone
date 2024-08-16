import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setIndividualAdData } from '../redux/slices/individualAd';
import Nav from '../components/Navbar/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { handleLike } from '../functions/handlesPosts/handleLike';
function ViewAll() {
  const specificAds = useSelector((state) => state.viewAll.data);
  const specificType = useSelector((state) => state.viewAll.type);
  const user = useSelector((state) => state.userData.data);
  const dispatch = useDispatch();
  

  const provinces = ["All Over Pakistan" , "Sindh", "Punjab", "KPK", "Balochistan", "Kashmir"];
  const cities = {
    'Sindh' : ["All Cities" , "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpurkhas", "Badin", "Jacobabad", "Shikarpur", "Khairpur", "Ghotki", "Dadu", "Thatta", "Tando Adam", "Tando Allahyar", "Umerkot", "Sanghar", "Tharparkar", "Kashmore", "Jamshoro"] ,
    'Punjab' :  ["All Cities" ,"Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Sargodha", "Bahawalpur", "Gujrat", "Sheikhupura", "Mianwali", "Sahiwal", "Rahim Yar Khan", "Kasur", "Jhelum", "Okara", "Bahawalnagar", "Chiniot", "Hafizabad", "Khanewal"] , 
    'KPK' : ["All Cities"  , "Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat", "Dera Ismail Khan", "Haripur", "Bannu", "Mansehra", "Charsadda", "Nowshera", "Swabi", "Karak", "Buner", "Lakki Marwat", "Hangu", "Lower Dir", "Upper Dir", "Shangla", "Battagram"] , 
    'Balochistan': ["All Cities"  , "Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi", "Zhob", "Chaman", "Dera Murad Jamali", "Pishin", "Nushki", "Kalat", "Jafarabad", "Mastung", "Awaran", "Bela", "Loralai", "Kharan", "Panjgur", "Lasbela", "Kohlu"] , 
    "Kashmir" : ["All Cities"  , "Muzaffarabad", "Mirpur", "Rawalakot", "Bagh", "Kotli", "Pallandri", "Sudhanoti", "Bhimber", "Hattian Bala", "Hajira", "Abbaspur", "Barnala", "Sehnsa", "Chakswari", "Dadyal", "Chinari"]
  };
  const categoryData = {
    'Mobile': [
      "Tablets",
      "Smart Watches",
      "Mobile Phones",
    ] , 
    'Jobs' : [
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
    ] , 
    'Service': [
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
    ] , 
    'Vehicle' : [
      "Cars",
      "Cars Accessories",
      "Spare Parts",
      "Buses, Vans,Trucks",
      "Rickshaw & Chingchi",
      "Other Vehicles",
      "Boats",
      "Tractors & Trailors",
    ]
  }

  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [category ,setCategory] = useState("")
  const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(10000000);
  const [filteredAds, setFilteredAds] = useState(specificAds[0].ads);

  const addAdDataToRedux = (ad) => {
    dispatch(setIndividualAdData({ payload: ad }));
  };

  // Filter ads when province or city changes
  useEffect(() => {
    let ads = specificAds[0].ads;
    if (province && province !== "All Over Pakistan") {
      ads = ads.filter(ad => ad.province === province);
    }
    if (city && city !== "All Cities") {
      ads = ads.filter(ad => ad.city === city);
    }
    if(category) {
      ads = ads.filter(ad=> ad.category === category)
    }
    if (specificType === 'Vehicle' || specificType === 'Mobile' || specificType === 'Service') {
      ads = ads.filter(
        (ad) => ad.price >= minPrice && ad.price <= maxPrice
      );
    }
    setFilteredAds(ads);
  }, [province, city, specificAds , category , minPrice , maxPrice , specificType]);

  const renderAdList = (ads, type) => (
    <div className="w-full">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{type} Ads</h2>
      </div>
      <ul className="list-none">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <NavLink 
              key={ad._id} 
              to="/individualAd" 
              onClick={() => addAdDataToRedux(ad)} 
              className="no-underline text-gray-700 hover:text-gray-900"
            >
              <li className="border p-4 flex items-center justify-between w-full relative hover:bg-gray-100 transition-colors duration-200">
                {/* Heart Icon */}
                <div 
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleLike(dispatch, ad, user);
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faHeart} 
                    size="xl" 
                    style={ad.likes.includes(user._id) ? { color: "red" } : {}} 
                  />
                </div>
                
                {/* Ad Content */}
                <div className="flex items-center w-full">
                  <img
                    src={ad?.imagesURL[0] || 'placeholder.jpg'}
                    alt={ad.adTitle}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <span className="text-lg font-bold text-gray-800">{ad.adTitle} - </span>
                    <span className="text-gray-600">in {type}</span>
                    <p className="text-gray-600">Rs {ad.price}</p>
                    <p className="text-gray-600">
                      Posted on {ad.createdAt ? format(new Date(ad.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
              </li>
            </NavLink>
          ))
        ) : (
          <li>No ads available.</li>
        )}
      </ul>
    </div>
  );
  
  return (
    <div>
      <Nav showBechDay = {false} showSearchBar = {false} showlocationBar = {false}/>
      <div className="container mx-auto flex flex-col lg:flex-row p-4">
        <div className="w-full lg:w-1/4 p-4 bg-gray-50 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categoryData[specificType].map((cat) => (
                <li 
                  key={cat} 
                  className="cursor-pointer hover:text-green-600"
                  onClick={() => setCategory(cat)}>
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Location</h2>
            <ul className="space-y-2">
              {provinces.map((pro) => (
                <li 
                  key={pro} 
                  className="cursor-pointer hover:text-green-600"
                  onClick={() => setProvince(pro)}>
                  {pro}
                </li>
              ))}
            </ul>
            {province && cities[province] && (
              <ul className="space-y-2 mt-4">
                {cities[province].map((cit) => (
                  <li 
                    key={cit} 
                    className="cursor-pointer hover:text-green-600"
                    onClick={() => setCity(cit)}>
                    {cit}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {(specificType === 'Vehicle' || specificType === 'Mobile' || specificType === 'Service') && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Price</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6">
  <div className="flex justify-between mb-4">
    <input
      type="number"
      className="w-1/2 p-2 border rounded-md text-center"
      placeholder="Min Price"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
    />
    <input
      type="number"
      className="w-1/2 p-2 border rounded-md text-center ml-2"
      placeholder="Max Price"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>
  <div className="relative pt-1">
    <input
      type="range"
      className="form-range w-full h-2 p-0 bg-gray-200 rounded-lg"
      min="0"
      max="10000000"
      step="5000"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
    />
    <input
      type="range"
      className="form-range w-full h-2 p-0 bg-gray-200 rounded-lg mt-2"
      min="0"
      max="10000000"
      step="5000"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
    />
  </div>
  <div className="text-center mt-4">
    <p className="text-sm text-gray-500">
      PKR {minPrice} - PKR {maxPrice}
    </p>
  </div>
</div>

          </div>
        )}
        </div>
  
        <div className="w-full lg:w-3/4 p-4">
          {filteredAds.length > 0 ? renderAdList(filteredAds, specificType) : 'No ads to display'}
        </div>
      </div>
    </div>
  );
  
}

export default ViewAll;
