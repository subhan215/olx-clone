const User = require("../models/User");
const { validateToken, createTokenForUser } = require("../services/authentication");
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary")
const { validatePassword } = require("../validations/validatePassword");
const { validateEmail } = require("../validations/validateEmail");

async function postSignIn(req , res) {
    console.log(req.body)
      const { email, password } = req.body;
    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
      console.log("token: ", token);
      const user = await User.findOne({email :email})
      return res.status(200).json({
            userData: token , message: "Sign In Successfully" , success: true
      })
    } catch (error) {
          return res.status(400).json({
            success: false , 
            message: "Some Error Occured!"
          })
    }
  }
async function getUser(req ,res) {
      const {token} = req.body
      console.log(token)
      let userToken = validateToken(token)
      console.log(userToken)
      let user = User.findById(userToken._id)
      if(user) {
        return res.status(200).json({
          success: true , 
          data: {...userToken} , 
          message: "Successfully Verified Token!"
        })
      }
      else {
        return res.status(400).json({
          success: false , 
          message: "Couldn't Verify Token"
        })
      }
}

async function postSignUp(req, res) {
  console.log("Signup request received");

  let { email, password, confirmPassword, fullName } = req.body;
 
  fullName = fullName?.trim();
  email = email?.trim();
  password = password?.trim();
  confirmPassword = confirmPassword?.trim();
  console.log(fullName,email,password,confirmPassword)
  // Validate input fields
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match."
    });
  }
  

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format."
    });
  }
 
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must have at least 8 and a maximum of 20 characters, including numeric and special characters."
    });
  }

  try {
    // Check if user already exists
    console.log("db q1")
    const userExist = await User.findOne({ email });
    console.log("db q2  ")

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!"
      });
    }


    // Create a new user
    
    const user = await User.create({
      fullName,
      email,
      password
    });
    console.log(user)
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Internal server error while creating account."
      });
    }

    return res.status(200).json({
      success: true,
      userData: user,
      message: "Account registered successfully."
    });
  }
   catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  } 
}
async function postUpdateProf(req , res) {
    if(req.body.id) {
        let user = await User.findById(req.body.id)
        if(req.body.fullName !== "") {
          user.fullName =  req.body.fullName
        }
        if(req.body.gender !== "") {
          user.gender = req.body.gender
        }
        if(req.body.phoneNo !== "") {
          user.phoneNo = req.body.phoneNo
        } 
        if(req.body.email !== "") {
          user.email = req.body.email
        }
      
        if(req.files) {
          console.log(req.files)
          const cloudinaryURL = await uploadOnCloudinary(req?.files?.image[0]?.path)
          user.profileImageURL = cloudinaryURL.url
        }
        await User.findByIdAndUpdate(req.body.id , {
          ...user
        })
        const token = createTokenForUser(user)
        return res.status(200).json({
          userData: token , 
          success: true , 
          message: "Profile Updated Successfully!"
        })
    }
    return res.status(400).json({
      message: "Some error occured in user logIn!" , 
      success: false
    })
}


module.exports = {
    postSignIn,
    postSignUp  , 
    getUser , 
    postUpdateProf
}