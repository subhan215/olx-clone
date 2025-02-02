import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCar, faBriefcase, faBroom } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setViewAllWithRedux } from '../../redux/slices/viewAll';
import { setCookie } from '../../cookies/setCookie';
function Categories() {
  const dispatch = useDispatch()
  const ads = useSelector((state) => state.adsData.data);
  console.log(ads)
  return (
    <div className="bg-white border-b border-gray-300   pb-4 ">
      
      <div className='p-2'>
            <p className='ml-10 mt-4 text-gray-700 text-3xl font-bold '>All Categories</p>
      </div>
      <nav className="flex px-4">
        <div className="text-center px-6">
          <NavLink to='/view-all' className="bg-blue-100 rounded-full p-4 inline-block" onClick={()=> {
            dispatch(setViewAllWithRedux({data: ads.filter((ad) => ad.model === "mobile")[0].ads , type: "Mobile"}))
            setCookie("specificAds" , "Mobile")
          }}>
            <FontAwesomeIcon icon={faMobileAlt} className="text-4xl text-blue-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Mobile Phones</p>
        </div>
        <div className="text-center px-6">
          <NavLink to = "/view-all" className="bg-green-100 rounded-full p-4 inline-block" onClick={()=> {
            dispatch(setViewAllWithRedux({data: ads.filter((ad) => ad.model === "vehicle")[0].ads , type: "Vehicle"}))
            setCookie("specificAds" , "Vehicle")
          }}>
            <FontAwesomeIcon icon={faCar} className="text-4xl text-green-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Vehicles</p>
        </div>
        <div className="text-center px-6">
          <NavLink to = "/view-all" className="bg-yellow-100 rounded-full p-4 inline-block" onClick={()=> {
            dispatch(setViewAllWithRedux({data: ads.filter((ad) => ad.model === "jobs")[0].ads , type: "Jobs"}))
            setCookie("specificAds" , "Jobs")
          }}>
            <FontAwesomeIcon icon={faBriefcase} className="text-4xl text-yellow-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Jobs</p>
        </div>
        <div className="text-center px-6">
          <NavLink to = "/view-all" className="bg-red-100 rounded-full p-4 inline-block" onClick={()=> {
             dispatch(setViewAllWithRedux({data: ads.filter((ad) => ad.model === "service")[0].ads , type: "Service"}))
             setCookie("specificAds" , "Service")
            }}>
            <FontAwesomeIcon icon={faBroom} className="text-4xl text-red-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Services</p>
        </div>
      </nav>
    </div>
  );
}

export default Categories;
