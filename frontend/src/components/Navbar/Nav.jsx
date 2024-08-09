import { setChatData } from '../../redux/slices/chatsData';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdsDataWithRedux } from '../../redux/slices/adsData';
import { setCityWithRedux } from '../../redux/slices/locationData';
import { setProvinceWithRedux } from '../../redux/slices/locationData';
import { setSearchFilterWithRedux } from '../../redux/slices/searchFilter';
import Notifications from '../Notifications';
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faMagnifyingGlass = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlass;
const faMagnifyingGlassLocation = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlassLocation;
const faMessage = require('@fortawesome/free-solid-svg-icons').faMessage;
const faBell = require('@fortawesome/free-solid-svg-icons').faBell;
const faBox = require('@fortawesome/free-solid-svg-icons').faBox;
const faLocationDot = require('@fortawesome/free-solid-svg-icons').faLocationDot;
const { Link } = require('react-router-dom');

function Nav() {
  const navigate = useNavigate();
  let user = useSelector((state) => state.userData.data);
  const dispatch = useDispatch();
  let allAds = useSelector((state) => state.adsData.data);
  const [search, setSearch] = useState("");

  //getting data takay dropdown main dekha sakon
  let province = useSelector((state)=>state.locationData.province)
  let city = useSelector((state)=> state.locationData.city)

  // Data for now, will use API in future , mujhay bata dio
  const provinces = ["All Over Pakistan","Sindh", "Punjab", "KPK", "Balochistan", "Kashmir"];
  const sindhCities = ["All Cities" , "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpurkhas", "Badin", "Jacobabad", "Shikarpur", "Khairpur", "Ghotki", "Dadu", "Thatta", "Tando Adam", "Tando Allahyar", "Umerkot", "Sanghar", "Tharparkar", "Kashmore", "Jamshoro"];
  const punjabCities = ["All Cities" ,"Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Sargodha", "Bahawalpur", "Gujrat", "Sheikhupura", "Mianwali", "Sahiwal", "Rahim Yar Khan", "Kasur", "Jhelum", "Okara", "Bahawalnagar", "Chiniot", "Hafizabad", "Khanewal"];
  const kpkCities = ["All Cities"  , "Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat", "Dera Ismail Khan", "Haripur", "Bannu", "Mansehra", "Charsadda", "Nowshera", "Swabi", "Karak", "Buner", "Lakki Marwat", "Hangu", "Lower Dir", "Upper Dir", "Shangla", "Battagram"];
  const balochistanCities = ["All Cities"  , "Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi", "Zhob", "Chaman", "Dera Murad Jamali", "Pishin", "Nushki", "Kalat", "Jafarabad", "Mastung", "Awaran", "Bela", "Loralai", "Kharan", "Panjgur", "Lasbela", "Kohlu"];
  const kashmirCities = ["All Cities"  , "Muzaffarabad", "Mirpur", "Rawalakot", "Bagh", "Kotli", "Pallandri", "Sudhanoti", "Bhimber", "Hattian Bala", "Hajira", "Abbaspur", "Barnala", "Sehnsa", "Chakswari", "Dadyal", "Chinari"];

  const cityArrays = {
    Sindh: sindhCities,
    Punjab: punjabCities,
    KPK: kpkCities,
    Balochistan: balochistanCities,
    Kashmir: kashmirCities
  };

  const handleSearch = () => {
    console.log(allAds);
    dispatch(setSearchFilterWithRedux({ payload: search}));
  };
  const handleCityChange = (e)=>{
    const cityy=e.target.value
    dispatch(setCityWithRedux(cityy))
  }
  const handleProvinceChange = (e)=>{
    const provincee=e.target.value
    dispatch(setProvinceWithRedux(provincee))
    dispatch(setCityWithRedux(''));
  }
  const handleInboxClick = () => {
    // try {
    //   const response = await fetch("http://localhost:8000/api/v1/chat", {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({ user: user._id }),
    //   });
    //   const chatData = await response.json();
    //   console.log(chatData);
    //   console.log(chatData.chat)
    //   if (chatData.success) {
    //     dispatch(setChatData(chatData.chat));
    navigate('/chat', { state: { user } });
    //   } else {
    //     alert(chatData.message);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const [showNotifications , setShowNotifications] = useState(false)
  const turnNotificationsToOff = () => {
    setShowNotifications(false)
  }

  return (
    <>
    <div className="bg-white border-b border-gray-900">
      <nav className="flex flex-wrap items-center justify-between p-2 max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-4">
          <h3 className="text-4xl font-bold text-orange-500 mr-10">Xlo</h3>
          <div className="flex items-center bg-white rounded border-2 border-black p-[0.1rem]">
            <FontAwesomeIcon className="text-orange-500 ml-2 mr-2" icon={faLocationDot} />
            <select
              className="p-2"
              value={province}
              onChange={handleProvinceChange}
            >
              <option value="" disabled>Select Province</option>
              {provinces.map((province) => (
                <option className='' key={province} value={province}>{province}</option>
              ))}
            </select>
            {province && province !== "All Over Pakistan" && (
              <select
                className="p-2 ml-2"
                value={city}
                onChange={handleCityChange}
              >
                <option value="" disabled>Select City (optional)</option>
                {cityArrays[province].map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>
          <div className=" flex items-center bg-white rounded border-2 border-black p-2">
            <input
              type="text"
              className="p-[0.1rem] ml-2 w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72"
              placeholder="Search in all Categories"
              onChange={(e) => setSearch(e.target.value)}
            />
            <FontAwesomeIcon
              className="text-orange-500 hover:cursor-pointer mr-2 ml-2"
              icon={faMagnifyingGlass}
              onClick={handleSearch}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center space-x-4">
          
          <div className="flex space-x-6 ">
            <FontAwesomeIcon onClick={handleInboxClick} icon={faMessage} size="2x" className="text-black hover:cursor-pointer" />
            <FontAwesomeIcon icon={faBell} size="2x" className="text-black hover:cursor-pointer" onClick={()=> setShowNotifications(true)}/>
          </div>
          <div className="flex items-center border-8 border-orange-400 hover:bg-orange-400 rounded-full p-2">
            <Link to={'/post'} className="flex items-center space-x-2 no-underline">
              <FontAwesomeIcon className="text-black " icon={faBox} size="lg" />
              <span className="text-black font-bold">BECH DAY</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
    {showNotifications && <Notifications turnNotificationsToOff = {turnNotificationsToOff}/>}
    </>
  );
}

export default Nav;
