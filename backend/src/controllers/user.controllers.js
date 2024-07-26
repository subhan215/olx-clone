const User = require("../models/User");
const { validateToken } = require("../services/authentication");
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
  let { email, password, confirmPassword, fullName } = req.body;
  fullName = fullName?.trim();
  email = email?.trim();
  password = password?.trim();
  confirmPassword = confirmPassword?.trim();

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
      return res.status(401).json({
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
      const userExist = await User.findOne({ email });
      if (userExist) {
          return res.status(400).json({
              success: false,
              message: "Email already exists."
          });
      }

      const user = await User.create({
          fullName,
          email,
          password
      });

      if (!user) {
          return res.status(500).json({
              success: false,
              message: "Internal server error in creating account."
          });
      }

      return res.status(201).json({
          success: true,
          userData: user,
          message: "Account registered successfully."
      });
    }catch(error){
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Internal server error."
    });
    }
  }

module.exports = {
    postSignIn,
    postSignUp  , 
    getUser
}