import React, { useEffect, useState } from "react";
import { getCookie } from "../cookies/getCookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserDataWithRedux } from "../redux/slices/userData";
import Nav from "../components/Navbar/Nav";
import { setAdsDataWithRedux } from "../redux/slices/adsData";
const Home = () => {
  const dispatch = useDispatch()
  let token = getCookie("token")
  let ads = useSelector((state)=> state.adsData.data )
  const [userLoginBool , setUserLoginBool] = useState(false)
 useEffect(()=> {
    const getAllPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/posts/' , {
          headers : {
            'Content-Type' : "application/json"
          } , 
          method: "GET"
        })
        let data = await response.json()
        console.log(data)
        if(data.success) {
            dispatch(setAdsDataWithRedux({payload:data.adsData })) 
        }
        else {
            alert(data.message)
        }
      }
      catch(err) {
          console.log(err)
      }
    }
    const verifyToken = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/users/getUser' , {
          headers : {
            'Content-Type' : "application/json"
          } , 
          method: "POST" , 
          body: JSON.stringify({token})
        })
        let data = await response.json()
        console.log(data)
        if(data.success) {
            setUserLoginBool(true)
            dispatch(setUserDataWithRedux({payload:data.data })) 
        }
        else {
            alert(data.message)
        }
      }
      catch(err) {
          console.log(err)
      }
    }
    getAllPosts()
   
    if(token) {
      verifyToken()
    }
    
 } , [])
 
  return (
    <div>
      <Nav/>
       {
        ads.map((ad) => (
          <div className="card">
              <p>{ad.adTitle}</p>
          </div>
        ))
       }
    </div>
  );
};
export default Home;
