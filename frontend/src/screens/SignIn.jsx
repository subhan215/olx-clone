import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { setUserDataWithRedux } from "../redux/slices/userData";
//mport { useDispatch, useSelector } from "react-redux";
import { setCookie } from "../cookies/setCookie";
const SignIn = () => {
  //const navigate = useNavigate()
  //const dispatch = useDispatch()
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
            //dispatch(setUserDataWithRedux({payload: data.userData}))
            //console.log(data.userData._id)
            setCookie("user_id" , data.userData._id)
            //navigate("/home")

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
    <div class="container">
        <form class="mt-4" onSubmit={signIn}>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" required 
                onChange={(e) => setUserData({...userData , email: e.target.value})}/>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required 
                onChange={(e) => setUserData({...userData , password: e.target.value})}/>
            </div>
            <button type="submit" class="btn btn-primary">Sign In</button>
        </form>
    </div>
  );
};
export default SignIn;
