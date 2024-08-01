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
    const getAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/posts/", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        });
        let data = await response.json();
        console.log(data);
        if (data.success) {
          dispatch(setAdsDataWithRedux({ payload: data.adsData }));
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
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
    getAllPosts();

    if (token) {
      verifyToken();
    }
  }, []);
  return (
    <div class="container">
      <Nav />
      <div>
        <p>Edit Profile</p>
        <div>
          <p>Profile Photo</p>
          <input type="file" />
        </div>
        <div>
            <label htmlFor="">Name</label>
            <input type="text" value={user?.fullName}/>
        </div>
        <div>
        <label htmlFor="">Gender</label>
        <input type="text" value={user?.gender}/>
        </div>
        <div>
            <p>Contact Information</p>
            <div>
            <label htmlFor="">Phone No: </label>
            <input type="text" value={user?.phoneNo}/>
            </div>
            <div>
            <label htmlFor="">Email: </label>
            <input type="text" value={user?.email}/>
            </div>
       
        </div>
      </div>
    </div>
  );
};
export default Profile;
