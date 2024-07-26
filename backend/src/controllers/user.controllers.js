const User = require("../models/User");
const { validateToken } = require("../services/authentication");
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary");
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
module.exports = {
    postSignIn , 
    getUser
}