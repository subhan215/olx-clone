import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserDataWithRedux } from "../redux/slices/userData";
import { useDispatch, useSelector } from "react-redux";
import { setCookie } from "../cookies/setCookie";
import { Link } from "react-router-dom";
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
    <div className='min-h-screen py-20 px-4 flex justify-center items-center'>
  <div className="flex max-w-3xl w-full">
    <div className="w-1/2 flex flex-col justify-center items-start bg-gradient-to-r from-gray-900 to-gray-800 text-white p-10 rounded-l-lg">
      <h1 className="text-5xl text-orange-600 font-extrabold mb-16"><div>Khareed.</div>o.<div>Farokht</div></h1>
      <h2 className="text-4xl text-white font-semibold mb-4">Welcome back</h2>
      <Link to="/signup" className="text-orange-600 text-lg no-underline hover:text-orange-700 transition duration-300">Don't have an account? Sign up</Link>
    </div>
    <div className="w-1/2 bg-white p-8 rounded-r-lg border border-black">
      <form id="loginForm" onSubmit={signIn}>
        <div className="relative mb-6 mt-12">
          <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter Email" 
            className="w-full px-8 py-4 border border-black rounded " 
            required 
            onChange={(e) => setUserData({...userData, email: e.target.value})} 
          />
        </div>
        <div className="relative mb-6">
          <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter Password" 
            className="w-full px-8 py-4 border border-black rounded " 
            required 
            onChange={(e) => setUserData({...userData, password: e.target.value})} 
          />
        </div>
        <button
          type="submit"
          className="w-full mt-12 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 px-4 rounded transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
</div>
  );
};
export default SignIn;
