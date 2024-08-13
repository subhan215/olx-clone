import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Navbar/Nav';

const ProfileUpdateForm = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [fullName, setFullName] = useState(user.fullName);
  const [gender, setGender] = useState(user.gender);
  const [phoneNo, setPhoneNo] = useState(user.phoneNo);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', user._id);
    if (fullName) formData.append('fullName', fullName);
    if (gender) formData.append('gender', gender);
    if (phoneNo) formData.append('phoneNo', phoneNo);
    if (email) formData.append('email', email);
    if (profileImage) formData.append('image', profileImage);
  
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/profileUpdate", {
        
        method: "POST",
        body: formData, // No need to set Content-Type manually
      });
      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  return (
    <>
      <Nav showSearchBar={false} showlocationBar={false}/>
      <div className='border border-black rounded p-4 my-8 mx-auto max-w-3xl'>
        <div className='pb-2 border-b border-black mb-2'>
          <h4>Edit Profile</h4>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto py-4 bg-white">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="fullName">
              Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded"
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="phoneNo">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNo"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-sm font-semibold mb-2 mr-4" htmlFor="profileImage">
              Profile Photo
            </label>
            <div className="relative w-full">
              <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className=" px-3 py-2 border border-black rounded bg-gray-100 text-sm text-black hover:bg-gray-200"
                onClick={() => document.getElementById('profileImage').click()}
              >
                {profileImage ? profileImage.name : 'Choose File'}
              </button>
            </div>
            <button
              type="submit"
              className="ml-4 px-16 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded transform hover:scale-105 transition duration-300 ease-in-out"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileUpdateForm;
