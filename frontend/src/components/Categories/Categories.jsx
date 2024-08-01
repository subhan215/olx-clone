import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCar, faBriefcase, faBroom } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

function Categories() {
  return (
    <div className="bg-white border-b border-gray-300">
      
      <div className='p-2'>
            <p className='ml-10 mt-4 text-gray-700 text-3xl font-bold '>All Categories</p>
      </div>
      <nav className="flex px-4">
        <div className="text-center px-4">
          <NavLink to={''} className="bg-blue-100 rounded-full p-4 inline-block">
            <FontAwesomeIcon icon={faMobileAlt} className="text-4xl text-blue-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Mobile Phones</p>
        </div>
        <div className="text-center px-4">
          <NavLink className="bg-green-100 rounded-full p-4 inline-block">
            <FontAwesomeIcon icon={faCar} className="text-4xl text-green-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Vehicles</p>
        </div>
        <div className="text-center px-4">
          <NavLink className="bg-yellow-100 rounded-full p-4 inline-block">
            <FontAwesomeIcon icon={faBriefcase} className="text-4xl text-yellow-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Jobs</p>
        </div>
        <div className="text-center px-4">
          <NavLink className="bg-red-100 rounded-full p-4 inline-block">
            <FontAwesomeIcon icon={faBroom} className="text-4xl text-red-500" />
          </NavLink>
          <p className="text-sm mt-2 font-bold">Services</p>
        </div>
      </nav>
    </div>
  );
}

export default Categories;
