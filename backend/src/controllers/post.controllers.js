const Job = require("../models/Ad Models/Job");
const Mobile = require("../models/Ad Models/Mobile");
const Service = require("../models/Ad Models/Service");
const Vehicle = require("../models/Ad Models/Vehicle");
const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary");


async function allPosts(req, res) {
  try {
    const vehiclesAds = await Vehicle.find({completed: false})
    const mobileAds = await Mobile.find({completed: false})
    const jobAds = await Job.find({completed: false})
    const serviceAds = await Service.find({completed: false})
    return res.status(200).json({
      message: "Ads successfully fetched",
      success: true,
      adsData: [{ model: "vehicle", ads: [...vehiclesAds] }, { model: "mobile", ads: [...mobileAds] }, { model: "jobs", ads: [...jobAds] }, { model: "service", ads: [...serviceAds] }]
    })
  }
  catch (err) {
    console.log("error: ", err)
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    })
  }


}



async function postService(req, res) {
  const {
    adTitle,
    description,
    city,
    province,
    ownerName,
    phoneNo,
    category,
    createdBy
  } = req.body;

  if (!adTitle || !description || !city || !province || !ownerName || !phoneNo || !category || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Provide complete details!"
    });
  }

  console.log("service", createdBy);

  try {
    let cloudinaryUrls = [];

    if (req?.files?.images?.length > 0) {
      for (let i = 0; i < req.files.images.length; i++) {
        let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path);
        console.log("loop", cloudinaryURL);
        cloudinaryUrls.push(cloudinaryURL.url);
      }
    }

    const adId = req.params.adId;
    let service;

    if (adId) {
      // Update existing service ad
      service = await Service.findByIdAndUpdate(
        adId,
        {
          category,
          adTitle,
          description,
          city,
          province,
          ownerName,
          mobileNo: phoneNo,
          ...(cloudinaryUrls.length > 0 && { imagesURL: cloudinaryUrls }),
          createdBy
        },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service ad not found."
        });
      }

      return res.status(200).json({
        success: true,
        service,
        message: "Service ad updated successfully!"
      });
    } else {
      // Calculate the seller's average rating
      let user = await User.findById(createdBy);
      let totalRating = user.sellerRating.reduce((acc, r) => acc + r.rating, 0) / user.sellerRating.length;

      // Create a new service ad
      service = await Service.create({
        category,
        adTitle,
        description,
        city,
        province,
        ownerName,
        mobileNo: phoneNo,
        imagesURL: cloudinaryUrls,
        createdBy,
        userRating: totalRating
      });

      if (!service) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while creating service ad."
        });
      }

      return res.status(200).json({
        success: true,
        service,
        message: "Service ad created successfully!"
      });
    }
  } catch (error) {
    console.error("Error during creating/updating service:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}

async function postJob(req, res) {
  const {
    category,
    hiringPersonOrCompany,
    companyName,
    typeOfAd,
    salaryFrom,
    salaryTo,
    salaryPeriod,
    careerLevel,
    positionType,
    adTitle,
    description,
    city,
    province,
    ownerName,
    phoneNo,
    createdBy
  } = req.body;

  // Check if all required fields are provided
  if (
    !category || !hiringPersonOrCompany || !companyName || !typeOfAd ||
    !salaryFrom || !salaryTo || !salaryPeriod || !careerLevel ||
    !positionType || !adTitle || !description || !city ||
    !province || !ownerName || !phoneNo || !createdBy
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide complete details!"
    });
  }

  try {
    let cloudinaryUrls = [];

    // Upload images if provided
    if (req.files && req.files.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path);
        cloudinaryUrls.push(cloudinaryURL.url);
      }
    }

    // Calculate the seller's average rating
    let user = await User.findById(createdBy);
    let totalRating = user.sellerRating.reduce((acc, r) => acc + r.rating, 0) / user.sellerRating.length;

    const adId = req.params.adId;
    const adData = {
      category,
      hiringPersonOrCompany,
      companyName,
      typeOfAd,
      salaryFrom: Number(salaryFrom),
      salaryTo: Number(salaryTo),
      salaryPeriod,
      careerLevel,
      positionType,
      adTitle,
      description,
      province,
      city,
      ownerName,
      mobileNo: phoneNo,
      imagesURL: cloudinaryUrls,
      createdBy,
      userRating: totalRating
    };

    let job;
    if (adId) {
      console.log(`Attempting to update job with ID: ${adId}`);
      // Update existing job ad
      job = await Job.findByIdAndUpdate(adId, adData, { new: true });
      if (!job) {
        console.log(`No job found with ID: ${adId}`);
        return res.status(404).json({
          success: false,
          message: "Job Ad not found."
        });
      }
      return res.status(200).json({
        success: true,
        job,
        message: "Job Ad updated successfully!"
      });
    } else {
      // Create a new job ad
      console.log("Creating a new job ad.");
      job = await Job.create(adData);
      if (!job) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while creating job ad."
        });
      }
      return res.status(200).json({
        success: true,
        job,
        message: "Job Ad created successfully!"
      });
    }
  } catch (error) {
    console.error("Error during creating/updating job:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}

async function postVehicle(req, res) {
  const { adId } = req.params; // Extract adId from URL params
  const {
    category, make, adTitle, description, city, province, price,
    ownerName, phoneNo, createdBy
  } = req.body;

  if (!category || !make || !adTitle || !description || !city || !province || !price || !ownerName || !phoneNo || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Provide complete details!"
    });
  }

  try {
    let cloudinaryUrls = [];

    // Upload new images if any
    if (req.files && req.files.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path);
        cloudinaryUrls.push(cloudinaryURL.url);
      }
    }

    // Check if it's an update operation
    if (adId) {
      const existingVehicle = await Vehicle.findById(adId);

      if (!existingVehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle Ad not found!"
        });
      }

      // Update the existing vehicle ad
      existingVehicle.category = category;
      existingVehicle.make = make;
      existingVehicle.adTitle = adTitle;
      existingVehicle.description = description;
      existingVehicle.city = city;
      existingVehicle.province = province;
      existingVehicle.price = Number(price);
      existingVehicle.ownerName = ownerName;
      existingVehicle.mobileNo = phoneNo;
      if (cloudinaryUrls.length > 0) {
        existingVehicle.imagesURL = cloudinaryUrls;
      }

      await existingVehicle.save();

      return res.status(200).json({
        success: true,
        vehicle: existingVehicle,
        message: "Vehicle Ad updated successfully!"
      });
    } else {
      let user = await User.findById(req.body.createdBy)
    let totalRating= 0
    for(let i = 0 ; i < user.sellerRating.length ; i++) {
      totalRating += user.sellerRating[i].rating
    }
    totalRating /= user.sellerRating.length
      // Create a new Vehicle Ad
      const vehicle = await Vehicle.create({
        category, make, adTitle, description, city, province, price: Number(price),
        ownerName, mobileNo: phoneNo, imagesURL: cloudinaryUrls, createdBy , 
        userRating: totalRating
      });

      if (!vehicle) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while creating the ad."
        });
      }

      return res.status(200).json({
        success: true,
        vehicle: vehicle,
        message: "Vehicle Ad created successfully!"
      });
    }
  } catch (error) {
    console.error("Error during creating or updating vehicle:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
  
}

// if (!req.body.category || !req.body.make || !req.body.adTitle ||
  //   !req.body.description || !req.body.city || !req.body.province || !req.body.price ||
  //   !req.body.ownerName || !req.body.phoneNo || !req.body.createdBy) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Provide complete details!"
  //   })
  // }
  // console.log("Vehicle", req.body.createdBy)
  // try {
  //   let cloudinaryUrls = []
  //   for (let i = 0; i < req?.files?.images?.length; i++) {
  //     let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path)
  //     console.log("loop", cloudinaryURL)
  //     cloudinaryUrls.push(cloudinaryURL.url)
  //   }
  //   // Check if user already exists
  //   const vehicle = await Vehicle.create({
  //     category: req.body.category,
  //     make: req.body.make,
  //     adTitle: req.body.adTitle,
  //     description: req.body.description,
  //     city: req.body.city,
  //     province: req.body.province,
  //     price: Number(req.body.price),
  //     ownerName: req.body.ownerName,
  //     mobileNo: req.body.phoneNo,
  //     imagesURL: cloudinaryUrls,
  //     createdBy: req.body.createdBy
  //   })




  //   // Create a new Vehicle A ///

  //   if (!vehicle) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error while creating account."
  //     });
  //   }

  //   return res.status(200).json({
  //     success: true,
  //     vehicle: vehicle,
  //     message: "Vehicle Ad created succesfully!"
  //   });
  // }
  // catch (error) {
  //   console.error("Error during creating vehicle:", error);
  //   return res.status(500).json({
  //     success: false,
  //     message: "Internal server error."
  //   });
  // }

async function postMobile(req, res) {
  console.log(req.body);
  console.log(req.files);

  if (!req.body.category || !req.body.brand || !req.body.condition || !req.body.adTitle ||
    !req.body.description || !req.body.city || !req.body.province || !req.body.price ||
    !req.body.ownerName || !req.body.phoneNo || !req.body.createdBy) {
    return res.status(400).json({
      success: false,
      message: "Provide complete details!"
    });
  }

  try {
    let cloudinaryUrls = [];
    for (let i = 0; i < req?.files?.images?.length; i++) {
      let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path);
      cloudinaryUrls.push(cloudinaryURL.url);
    }

    if (req.params.adId) {
        const updatedMobile = await Mobile.findByIdAndUpdate(req.params.adId, {
        category: req.body.category,
        brand: req.body.brand,
        condition: req.body.condition,
        adTitle: req.body.adTitle,
        description: req.body.description,
        province: req.body.province,
        city: req.body.city,
        price: Number(req.body.price),
        ownerName: req.body.ownerName,
        mobileNo: req.body.phoneNo,
        imagesURL: cloudinaryUrls,
        // updatedBy: req.body.createdBy  // or use `updatedBy` if you want to track who updated
      }, { new: true });

      if (!updatedMobile) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while updating mobile ad."
        });
      }

      return res.status(200).json({
        success: true,
        mobileAd: updatedMobile,
        message: "Mobile Ad updated successfully!"
      });
    } else {
      let user = await User.findById(req.body.createdBy)
      let totalRating= 0
      for(let i = 0 ; i < user.sellerRating.length ; i++) {
        totalRating += user.sellerRating[i].rating
      }
      totalRating /= user.sellerRating.length
      const mobile = await Mobile.create({
        category: req.body.category,
        brand: req.body.brand,
        condition: req.body.condition,
        adTitle: req.body.adTitle,
        description: req.body.description,
        province: req.body.province,
        city: req.body.city,
        price: Number(req.body.price),
        ownerName: req.body.ownerName,
        mobileNo: req.body.phoneNo,
        imagesURL: cloudinaryUrls,
        createdBy: req.body.createdBy , 
        userRating: totalRating
      });

      if (!mobile) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while creating mobile ad."
        });
      }

      return res.status(200).json({
        success: true,
        mobileAd: mobile,
        message: "Mobile Ad created successfully!"
      });
    }
  } catch (error) {
    console.error("Error during creating/updating mobile ad:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
  // console.log(req.body)
  // console.log(req.files)
  // if (!req.body.category || !req.body.brand || !req.body.condition || !req.body.adTitle ||
  //   !req.body.description || !req.body.city || !req.body.province || !req.body.price ||
  //   !req.body.ownerName || !req.body.phoneNo || !req.body.createdBy) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Provide complete details!"
  //   })
  // }
  // console.log(`hllo ${req.body.createdBy}`)
  // try {
  //   let cloudinaryUrls = []
  //   for (let i = 0; i < req?.files?.images?.length; i++) {
  //     let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path)
  //     console.log("loop", cloudinaryURL)
  //     cloudinaryUrls.push(cloudinaryURL.url)
  //   }
  //   // Check if user already exists
  //   const mobile = await Mobile.create({
  //     category: req.body.category,
  //     brand: req.body.brand,
  //     condition: req.body.condition,
  //     adTitle: req.body.adTitle,
  //     description: req.body.description,
  //     province: req.body.province,
  //     city: req.body.city,
  //     price: Number(req.body.price),
  //     ownerName: req.body.ownerName,
  //     mobileNo: req.body.phoneNo,
  //     imagesURL: cloudinaryUrls,
  //     createdBy: req.body.createdBy
  //   })
  //   // Create a new Mobile ad ///
  //   if (!mobile) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error while creating account."
  //     });
  //   }

  //   return res.status(200).json({
  //     success: true,
  //     mobileAd: mobile,
  //     message: "Mobile Ad created succesfully!"
  //   });
  // }
  // catch (error) {
  //   console.error("Error during creating mobile:", error);
  //   return res.status(500).json({
  //     success: false,
  //     message: "Internal server error."
  //   });
  // }

}
async function postLike(req, res) {
  let adId = req.params.adId
  let { userId } = req.body
  console.log(adId , userId)
  let mobileAd = await Mobile.findById(adId)
  let vehicleAd = await Vehicle.findById(adId)
  let serviceAd = await Service.findById(adId)
  let jobAd = await Job.findById(adId)
  if (jobAd || serviceAd || vehicleAd || mobileAd) {
    let ad = mobileAd ? mobileAd : vehicleAd ? vehicleAd : serviceAd ? serviceAd : jobAd
    let user = await User.findById(userId)
    if (user) {
      if(ad.likes.includes(userId)) {
        let index = ad.likes.indexOf(userId)
        ad.likes.splice(index , index+1)
      }
      else {
        ad.likes.push(userId)
      }
     
      let adModel = jobAd ? Job : serviceAd ? Service : vehicleAd ? Vehicle : Mobile
      await adModel.findByIdAndUpdate(adId , {
        ...ad
      })
      return res.status(200).json({
        success: true , 
        message: "Liked Successfully!"
      })
    }
    else {
      return res.status(400).json({
        success: false,
        message: "Can't fetch user!"
      })
    }
  }
  return res.status(400).json({
    success: false,
    message: "Can't fetch ad!"
  })
}
const getSpecificAd = async (req , res) => {
  console.log(req.params.adId)
  const {adId} = req.params 
   if(!adId) {
    return res.status(400).json({
      success: false , 
      message: "adId is missing"
    })
   }
   let mobileAd = await Mobile.findById(adId)
   let vehicleAd = await Vehicle.findById(adId)
   let serviceAd = await Service.findById(adId)
   let jobAd = await Job.findById(adId)
   if(vehicleAd || mobileAd || serviceAd || jobAd) {
    let ad = mobileAd ? mobileAd : vehicleAd ? vehicleAd : serviceAd ? serviceAd : jobAd
    return res.status(200).json({
      success: true , 
       message: "ad fetched successfully!" , 
       ad
    })
   }
   else {
    return res.status(400).json({
      success: false , 
       message: "ad is missing!"
    })
   }
} 
module.exports = {
  postVehicle,
  postMobile,
  postJob,
  postService,
  allPosts,
  postLike , 
  getSpecificAd
}