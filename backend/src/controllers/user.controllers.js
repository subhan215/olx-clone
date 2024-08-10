const { validateToken, createTokenForUser } = require("../services/authentication");
const {Chat} = require("../models/chat.js")
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary")
const { validatePassword } = require("../validations/validatePassword");
const { validateEmail } = require("../validations/validateEmail");
const User = require("../models/User.js");
const Vehicle = require("../models/Ad Models/Vehicle.js");
const Job = require("../models/Ad Models/Job.js");
const Service = require("../models/Ad Models/Service.js");
const Mobile=require("../models/Ad Models/Mobile.js")

async function deleteUserAd(req,res){
  const { adId } = req.params;
    try {
        const isVehicle = await Vehicle.findById(adId);
        const isMobile = await Mobile.findById(adId);
        const isService = await Service.findById(adId);
        const isJob = await Job.findById(adId);

        if (isVehicle) {
            await Vehicle.findByIdAndDelete(adId);
            return res.status(200).json({ success: true, message: 'Vehicle ad deleted successfully' });
        }

        if (isMobile) {
            await Mobile.findByIdAndDelete(adId);
            return res.status(200).json({ success: true, message: 'Mobile ad deleted successfully' });
        }

        if (isService) {
            await Service.findByIdAndDelete(adId);
            return res.status(200).json({ success: true, message: 'Service ad deleted successfully' });
        }

        if (isJob) {
            await Job.findByIdAndDelete(adId);
            return res.status(200).json({ success: true, message: 'Job ad deleted successfully' });
        }

        return res.status(404).json({ success: false, message: 'Ad not found in any category' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

async function getUserAds(req,res){
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Fetch ads
    const [mobileAds, vehicleAds, jobAds, serviceAds] = await Promise.all([
      Mobile.find({ createdBy: userId }).exec(),
      Vehicle.find({ createdBy: userId }).exec(),
      Job.find({ createdBy: userId }).exec(),
      Service.find({ createdBy: userId }).exec()
    ]);

    // Helper function to get chat count
    const getChatCountForAds = async (ads) => {
      const adIds = ads.map(ad => ad._id);
      const chatCounts = await Chat.aggregate([
        { $match: { 'ad.adId': { $in: adIds } } },
        { $group: { _id: '$ad.adId', count: { $sum: 1 } } }
      ]);

      const chatCountMap = chatCounts.reduce((map, { _id, count }) => {
        map[_id.toString()] = count;
        return map;
      }, {});

      return ads.map(ad => ({
        ...ad.toObject(),
        chatCount: chatCountMap[ad._id.toString()] || 0
      }));
    };

    // Fetch chat counts for each ad type
    const adsWithChatCounts = await Promise.all([
      getChatCountForAds(mobileAds),
      getChatCountForAds(vehicleAds),
      getChatCountForAds(jobAds),
      getChatCountForAds(serviceAds)
    ]);

    const [mobileAdsWithChats, vehicleAdsWithChats, jobAdsWithChats, serviceAdsWithChats] = adsWithChatCounts;

    const userAds = {
      mobileAds: mobileAdsWithChats,
      vehicleAds: vehicleAdsWithChats,
      jobAds: jobAdsWithChats,
      serviceAds: serviceAdsWithChats
    };

    return res.status(200).json({
      success: true,
      userAds,
      message: "User ads have been fetched."
    });
  } catch (error) {
    console.error("Error fetching user ads:", error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch user ads data"
    });
  }
} 
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
  try {
    console.log(req.body.id,req.body.fullName)
    if (req.body.id) {
      let user = await User.findById(req.body.id);
      
      if (req.body.fullName) {
          user.fullName = req.body.fullName;
      }
      if (req.body.gender) {
          user.gender = req.body.gender;
      }
      if (req.body.phoneNo) {
          user.phoneNo = req.body.phoneNo;
      }
      if (req.body.email) {
          user.email = req.body.email;
      }
      if (req.files?.image) {
          const cloudinaryURL = await uploadOnCloudinary(req.files.image[0].path);
          user.profileImageURL = cloudinaryURL.url;
      }
  
      await User.findByIdAndUpdate(req.body.id, user);
  
      const token = createTokenForUser(user);
      return res.status(200).json({
          userData: token,
          success: true,
          message: "Profile Updated Successfully!",
      });
  }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Some error occurred during profile update!",
      success: false,
  });
  }


}


module.exports = {
    postSignIn,
    postSignUp  , 
    getUser , 
    postUpdateProf,
    getUserAds,
    deleteUserAd
}