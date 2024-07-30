import React, { useEffect, useState } from "react";
import { getCookie } from "../cookies/getCookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserDataWithRedux } from "../redux/slices/userData";
import Navbar from "../Components/Navbar/Navbar";
const Home = () => {
  const dispatch = useDispatch()
  let token = getCookie("token")
  const [userLoginBool , setUserLoginBool] = useState(false)
 useEffect(()=> {
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
    verifyToken()
 } , [])
  return (
    <>
      <Navbar/>
    </>
  );
};
export default Home;
