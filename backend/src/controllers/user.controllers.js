const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary");
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
module.exports = {
    postSignIn
}