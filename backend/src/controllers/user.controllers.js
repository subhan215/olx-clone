const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary");
const bcrypt = require('bcrypt')
async function postSignIn(req , res) {
    console.log(req.body)
      const { email, password } = req.body;
    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
      console.log("token: ", token);
      const user = await User.findOne({email :email})
      return res.cookie("token", token).status(200).json({
            userData: user , message: "Sign In Successfully" , success: true
      })
    } catch (error) {
          return res.status(400).json({
            success: false , 
            message: "Some Error Occured!"
          })
    }
  }
const validateEmail = (email)=>{
    //console.log("check mail")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const validatePassword = (password)=>{
    //console.log("check pass")

    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    const containsNumber = hasNumber.test(password);
    const containsSpecialChar = hasSpecialChar.test(password);
    return containsNumber && containsSpecialChar && (password.length>7 && password.length<21)
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

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
          fullName,
          email,
          password: hashedPassword,
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
    postSignUp
}