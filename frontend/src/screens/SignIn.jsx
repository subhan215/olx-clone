import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserDataWithRedux } from "../redux/slices/userData";
import { useDispatch, useSelector } from "react-redux";
import { setCookie } from "../cookies/setCookie";
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faLock = require('@fortawesome/free-solid-svg-icons').faLock;
const faEnvelope = require('@fortawesome/free-solid-svg-icons').faEnvelope;
const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    email: ""  , 
    password: "" , 
  })
  const signIn = async (e) => {
    console.log("asasa")
      e.preventDefault()
    
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/signin' , {
          headers : {
            'Content-Type' : "application/json"
          } , 
          method: "POST" , 
          body: JSON.stringify(userData)
        })
        let data = await response.json()
        console.log(data)
        if(data.success) {
            dispatch(setUserDataWithRedux({payload: data.userData}))
            console.log(data.userData)
            setCookie("token" , data.userData)
            navigate("/home")

        }
        else {
            alert(data.message)
        }
      }
      catch(err) {
          console.log(err)
      }
  }
  return (
    <div className=' min-h-screen py-16 px-4'>  
          <div className="registration-form  max-w-md mx-auto p-6 bg-gray-500 shadow-2xl rounded-lg z-10">
        <form class="mt-4" onSubmit={signIn}>
        <div className='text-4xl font-extrabold text-orange-400 m-2 item-center flex justify-center '>
                <h3 className=' mb-6 font-bold' >K.o.F</h3>
              </div>
            <div class="relative mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input placeholder="Enter Email" type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" className="bg-gray-200 w-full px-8 py-3 border border-gray-300 rounded" required onChange={(e) => setUserData({...userData , email: e.target.value})}/>
            </div>
            <div class="relative mb-4">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type="password" class="form-control" id="password" className="bg-gray-200 w-full px-8 py-3 border border-gray-300 rounded" name="password"  required placeholder="Enter Password"
                onChange={(e) => setUserData({...userData , password: e.target.value})}/>
            </div>
            <button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded transform hover:scale-105 transition duration-300 ease-in-out"
              >
              Sign In
              </button>
        </form>
    </div>
    </div>
  );
};
export default SignIn;
