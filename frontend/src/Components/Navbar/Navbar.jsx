import React from 'react';
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faMagnifyingGlass = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlass;
const faMagnifyingGlassLocation = require('@fortawesome/free-solid-svg-icons').faMagnifyingGlassLocation;
const faMessage = require('@fortawesome/free-solid-svg-icons').faMessage;
const faBell = require('@fortawesome/free-solid-svg-icons').faBell;
const faBox = require('@fortawesome/free-solid-svg-icons').faBox;
const faLocationDot = require('@fortawesome/free-solid-svg-icons').faLocationDot;
const { Link } = require('react-router-dom');

function Navbar() {
  const handleSearch = () => {};

  return (
    <div className="bg-white border-b border-black">
      <nav className="flex flex-wrap items-center justify-between p-4 max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-4">
          <h3 className="text-4xl font-bold text-orange-500 mr-10">Xlo</h3>
          <div className="flex items-center bg-white rounded border-2 border-black p-2">
            <FontAwesomeIcon className="text-orange-500 mr-2" icon={faLocationDot} />
            <input
              type="text"
              className="p-2 w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72"
              placeholder="Location"
            />
          </div>
          <div className="flex items-center bg-white rounded border-2 border-black p-2">
            <input
              type="text"
              className="p-2 w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72"
              placeholder="Search in all Categories"
            />
            <FontAwesomeIcon
              className="text-orange-500 hover:cursor-pointer ml-2"
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
            <Link to={'/post'} className="flex items-center space-x-2 ">
              <FontAwesomeIcon className="text-black " icon={faBox} size="lg" />
              <span className="text-black font-bold">BECH DAY</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
