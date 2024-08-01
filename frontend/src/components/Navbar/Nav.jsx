import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAdsDataWithRedux } from '../../redux/slices/adsData';
import { setCityWithRedux } from '../../redux/slices/locationData';
import { setProvinceWithRedux } from '../../redux/slices/locationData';
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faMagnifyingGlass = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlass;
const faMagnifyingGlassLocation = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlassLocation;
const faMessage = require('@fortawesome/free-solid-svg-icons').faMessage;
const faBell = require('@fortawesome/free-solid-svg-icons').faBell;
const faBox = require('@fortawesome/free-solid-svg-icons').faBox;
const faLocationDot = require('@fortawesome/free-solid-svg-icons').faLocationDot;
const { Link } = require('react-router-dom');

function Nav() {
  const dispatch = useDispatch();
  let allAds = useSelector((state) => state.adsData.data);
  const [search, setSearch] = useState("");

  //getting data takay dropdown main dekha sakon
  let province = useSelector((state)=>state.locationData.province)
  let city = useSelector((state)=> state.locationData.city)

  // Data for now, will use API in future , mujhay bata dio
  const provinces = ["All Over Pakistan","Sindh", "Punjab", "KPK", "Balochistan", "Kashmir"];
  const sindhCities = ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah"];
  const punjabCities = ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala"];
  const kpkCities = ["Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat"];
  const balochistanCities = ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi"];
  const kashmirCities = ["Muzaffarabad", "Mirpur", "Rawalakot", "Bagh", "Kotli"];

  const cityArrays = {
    Sindh: sindhCities,
    Punjab: punjabCities,
    KPK: kpkCities,
    Balochistan: balochistanCities,
    Kashmir: kashmirCities
  };

  const handleSearch = () => {
    console.log(allAds);
    const result = allAds.filter(ad => 
      ad.category?.toLowerCase().includes(search.toLowerCase()) || 
      ad.adTitle?.toLowerCase().includes(search.toLowerCase()) || 
      ad.description?.toLowerCase().includes(search.toLowerCase()) || 
      ad.make?.toLowerCase().includes(search.toLowerCase()) || 
      ad.companyName?.toLowerCase().includes(search.toLowerCase()) || 
      ad.careerLevel?.toLowerCase().includes(search.toLowerCase()) || 
      ad.salaryPeriod?.toLowerCase().includes(search.toLowerCase()) || 
      ad.positionType?.toLowerCase().includes(search.toLowerCase()) || 
      ad.brand?.toLowerCase().includes(search.toLowerCase()) || 
      ad.condition?.toLowerCase().includes(search.toLowerCase())
    );
    dispatch(setAdsDataWithRedux({ payload: result }));
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


  // useEffect(()=>{
  //   // const getAllPosts = async () => {
  //   //   try {
  //   //     const response = await fetch('http://localhost:8000/api/v1/posts/' , {
  //   //       headers : {
  //   //         'Content-Type' : "application/json"
  //   //       } , 
  //   //       method: "GET"
  //   //     })
  //   //     let data = await response.json()
  //   //     console.log(data)
  //   //     if(data.success) {
  //   //         dispatch(setAdsDataWithRedux({payload:data.adsData })) 
  //   //     }
  //   //     else {
  //   //         alert(data.message)
  //   //     }
  //   //   }
  //   //   catch(err) {
  //   //       console.log(err)
  //   //   }
  //   // }

  //   // getAllPosts()
  //   console.log(selectedCity)
  //   console.log(selectedProvince)
  //   console.log(allAds)
  //   let dataToFilter = allAds

  //   if(selectedProvince!=='All Over Pakistan' && selectedProvince){
  //     dataToFilter = dataToFilter.filter((ad)=> ad.province === selectedProvince)
  //   }
  //   if(selectedCity){
  //     dataToFilter = dataToFilter.filter((ad)=> ad.city === selectedCity)
  //   }

  //   //mobile keliye kar raha abhi
  //   dataToFilter = dataToFilter.filter((ad)=> ad.category === "Mobile Phones")



  //   // const categorizedAds = {
  //   //   MobilePhones: dataToFilter.filter(ad => ad.category === "Mobile Phones"),
  //     // Vehicles: dataToFilter.filter(ad => ad.category === "Cars"),
  //     // Jobs: dataToFilter.filter(ad => ad.category === "Job"),
  //     // Services: dataToFilter.filter(ad => ad.category === "Service")
  //   // };
  //   dispatch(setAdsDataWithRedux({ payload: dataToFilter }));
  // },[selectedProvince,selectedCity,dispatch])

  return (
    <div className="bg-white border-b border-black">
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
          
          <div className="flex space-x-4">
            <FontAwesomeIcon icon={faMessage} size="2x" className="text-black " />
            <FontAwesomeIcon icon={faBell} size="2x" className="text-black " />
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
  );
}

export default Nav;
