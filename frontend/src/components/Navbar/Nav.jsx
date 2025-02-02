import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCityWithRedux } from '../../redux/slices/locationData';
import { setProvinceWithRedux } from '../../redux/slices/locationData';
import { setSearchFilterWithRedux } from '../../redux/slices/searchFilter';
import  { useRef } from 'react';
import { Menu } from 'primereact/menu';
import './nav.css'
import Notifications from '../Notifications';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import Transaction from '../../screens/Transactions';
import { handleLogOut } from '../../functions/handlesUser/logOut';
import { getCookie } from '../../cookies/getCookie';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faMagnifyingGlass = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlass;
const faMessage = require('@fortawesome/free-solid-svg-icons').faMessage;
const faBell = require('@fortawesome/free-solid-svg-icons').faBell;
const faBox = require('@fortawesome/free-solid-svg-icons').faBox;
const faLocationDot = require('@fortawesome/free-solid-svg-icons').faLocationDot;
const faCircleUser = require('@fortawesome/free-solid-svg-icons').faCircleUser;
const { Link } = require('react-router-dom');

function Nav({showlocationBar=true , showSearchBar=true ,showBechDay=true}) {
  const navigate = useNavigate();
  let user = useSelector((state) => state.userData.data);
  const dispatch = useDispatch();
  let allAds = useSelector((state) => state.adsData.data);
  const [search, setSearch] = useState("");
  const [isLogOutBool , setIsLogOutBool] = useState(true)
  useEffect(()=> {
    let user = getCookie("token")
    if(user) {
      setIsLogOutBool(false)
    }
    else {
      setIsLogOutBool(true)
    }
  })
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
    navigate('/chat', { state: { user } })
  };
  const menuRef = useRef(null);

  const items = [
    { label: 'View and Edit Profile', icon: 'pi pi-user-edit', command: () => navigate('/update-profile',{ state: { user } }) },
    { label: 'My Ads', icon: 'pi pi-list', command: () => navigate('/my-ads',{ state: { user } }) },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: ()=> handleLogOut(dispatch , setIsLogOutBool) }
  ];
  const handleMenuToggle = (event) => {
    menuRef.current.toggle(event);
};
  const [showNotifications , setShowNotifications] = useState(false)
  const turnNotificationsToOff = () => {
    setShowNotifications(false)
  }
 ;

  const [showTransactions, setShowTransactions] = useState(false);
  const turnTransactionsToOff = () => setShowTransactions(false)

  return (
    <>
      <div className="bg-white border-b border-black">
        <nav className="flex flex-wrap items-center justify-between px-2 py-3 max-w-screen-xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link className='block no-underline' to={'/'}>
              <h3 className="text-4xl font-bold text-orange-500 mr-10">K.o.F</h3>
            </Link>

            {showlocationBar && (
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
            )}

            {showSearchBar && (
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
            )}
          </div>

          {!isLogOutBool ? (
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex space-x-6 ">
                <div className="relative">
                  <Menu model={items} popup ref={menuRef} id="popup_menu" my="left" at="left bottom" className="custom-menu" />
                  <FontAwesomeIcon onClick={handleMenuToggle} size='2x' icon={faCircleUser} className="text-black hover:cursor-pointer" />
                </div>
                <FontAwesomeIcon onClick={handleInboxClick} icon={faMessage} size="2x" className="text-black hover:cursor-pointer" />
                <FontAwesomeIcon
                  icon={faExchangeAlt}
                  size="2x"
                  className="text-black hover:cursor-pointer"
                  onClick={() => setShowTransactions(true)}
                />
                <FontAwesomeIcon icon={faBell} size="2x" className="text-black hover:cursor-pointer" onClick={() => setShowNotifications(true)} />
              </div>
              {showBechDay && (
                <div className="flex items-center border-8 border-orange-400 hover:bg-orange-400 rounded-full p-2">
                  <Link to={'/post'} className="flex items-center space-x-2 no-underline">
                    <FontAwesomeIcon className="text-black" icon={faBox} size="lg" />
                    <span className="text-black font-bold">BECH DAY</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/signin" className="no-underline">
                <FontAwesomeIcon icon={faSignInAlt} size="2x" className="text-black hover:cursor-pointer" />
              </Link>
              <Link to="/signup" className="no-underline">
                <FontAwesomeIcon icon={faUserPlus} size="2x" className="text-black hover:cursor-pointer" />
              </Link>
            </div>
          )}
        </nav>
      </div>
      {showNotifications && <Notifications turnNotificationsToOff={turnNotificationsToOff} />}
      {showTransactions && <Transaction turnTransactionsToOff={turnTransactionsToOff} />}
    </>
  );
}

export default Nav;
