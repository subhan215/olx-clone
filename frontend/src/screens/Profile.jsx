import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserDataWithRedux } from "../redux/slices/userData";
import { useDispatch, useSelector } from "react-redux";
import { setCookie } from "../cookies/setCookie";
import { setAdsDataWithRedux } from "../redux/slices/adsData";
import { getCookie } from "../cookies/getCookie";
import Nav from "../components/Navbar/Nav";
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let token = getCookie("token");
  let user = useSelector((state) => state.userData.data);
  const [userData, setUserData] = useState({
    image: "",
    fullName: "",
    gender: "",
    phoneNo: "",
    email: "",
  });
  useEffect(() => {
    
    const verifyToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/users/getUser",
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ token }),
          }
        );
        let data = await response.json();
        console.log(data);
        if (data.success) {
          dispatch(setUserDataWithRedux({ payload: data.data }));
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };


    if (token) {
      verifyToken();
    }
  }, []);
  const handleSubmit = () => {

  }
  return (
    <div class="container">
      <Nav />
      <form onSubmit={handleSubmit}>
        <p>Edit Profile</p>
        <div>
          <p>Profile Photo</p>
          <input type="file" onChange={(e)=> setUserData({...userData , image: e.target.files[0]})}/>
        </div>
        <div>
            <label htmlFor="">Name</label>
            <input type="text" value={user?.fullName} onChange={(e)=> setUserData({...userData , fullName: e.target.value})}/>
        </div>
        <div>
        <label htmlFor="">Gender</label>
        <input type="text" value={user?.gender} onChange={(e)=> setUserData({...userData , gender: e.target.value})}/>
        </div>
        <div>
            <p>Contact Information</p>
            <div>
            <label htmlFor="">Phone No: </label>
            <input type="text" value={user?.phoneNo} onChange={(e)=> setUserData({...userData , phoneNo: e.target.value})}/>
            </div>
            <div>
            <label htmlFor="">Email: </label>
            <input type="text" value={user?.email} onChange={(e)=> setUserData({...userData , email: e.target.value})}/>
            </div>
       
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
export default Profile;
