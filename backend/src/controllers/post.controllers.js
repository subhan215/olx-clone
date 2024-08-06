const Job = require("../models/Ad Models/Job");
const Mobile = require("../models/Ad Models/Mobile");
const Service = require("../models/Ad Models/Service");
const Vehicle = require("../models/Ad Models/Vehicle");
const { uploadOnCloudinary } = require("../utils/cloudinary/cloudinary");


async function allPosts (req , res) {
  try{
    const vehiclesAds = await Vehicle.find({})
    const mobileAds = await Mobile.find({})
    const jobAds = await Job.find({})
    const serviceAds = await Service.find({})
    return res.status(200).json({
      message: "Ads successfully fetched" , 
      success: true , 
      adsData: [{model: "vehicle" , ads: [...vehiclesAds]} , {model: "mobile" , ads: [...mobileAds]} , {model: "jobs" , ads: [...jobAds]} , {model: "service" , ads: [...serviceAds]}]
    })
  }
  catch(err) {
    console.log("error: " , err)
    return res.status(500).json({
      message: "Internal Server Error" , 
      success: false
    })
  }
      

}



async function postService(req , res) {
  if( !req.body.adTitle || 
      !req.body.description || !req.body.city ||
      !req.body.province ||
      !req.body.ownerName || !req.body.phoneNo || 
    !req.body.category || !req.body.createdBy) 
  {
      return res.status(400).json({
          success: false , 
          message: "Provide complete details!"
      })
  }
  console.log("service",req.body.createdBy)
  try {
      let cloudinaryUrls = []
      for(let i = 0 ; i < req?.files?.images?.length ; i++) {
          let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path)
          console.log("loop" , cloudinaryURL)
          cloudinaryUrls.push(cloudinaryURL.url)
      }
     const service = await Service.create({
          category: req.body.category ,
          adTitle: req.body.adTitle , 
          description: req.body.description , 
          city: req.body.city,
          province:  req.body.province ,
          ownerName: req.body.ownerName , 
          mobileNo: req.body.phoneNo , 
          imagesURL: cloudinaryUrls,
          createdBy:req.body.createdBy 
      }) 
  
     
  
  
      // Create a new Vehicle A ///
      
      if (!service) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while creating account."
        });
      }
  
      return res.status(200).json({
        success: true,
        service: service,
        message: "Service Ad created succesfully!"
      }); 
    }
     catch (error) {
      console.error("Error during creating service:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error."
      });
    } 

}

async function postJob(req , res) {
  if(!req.body.category || !req.body.hiringPersonOrCompany
    ||  !req.body.companyName|| !req.body.typeOfAd ||
    !req.body.salaryFrom || !req.body.salaryTo ||
    !req.body.salaryPeriod ||  !req.body.careerLevel ||
    !req.body.positionType|| !req.body.adTitle || 
      !req.body.description || !req.body.city || 
      !req.body.province ||
      !req.body.ownerName || !req.body.phoneNo || !req.body.createdBy) 
  {
      return res.status(400).json({
          success: false , 
          message: "Provide complete details!"
      })
  }
  console.log("job",req.body.createdBy)

  try {
      let cloudinaryUrls = []
      for(let i = 0 ; i < req?.files?.images?.length ; i++) {
          let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path)
          console.log("loop" , cloudinaryURL)
          cloudinaryUrls.push(cloudinaryURL.url)
      }
      // Check if user already exists
     const job = await Job.create({
          category: req.body.category , 
          hiringPersonOrCompany: req.body.hiringPersonOrCompany , 
          companyName : req.body.companyName , 
          typeOfAd: req.body.typeOfAd , 
          salaryFrom : Number(req.body.salaryFrom) , 
          salaryTo: Number(req.body.salaryTo) , 
          salaryPeriod: Number(req.body.salaryPeriod) , 
          careerLevel: req.body.careerLevel  , 
          positionType: req.body.positionType , 
          adTitle: req.body.adTitle , 
          description: req.body.description , 
          province: req.body.province , 
          city: req.body.city , 
          ownerName: req.body.ownerName , 
          mobileNo: req.body.phoneNo , 
          imagesURL: cloudinaryUrls,
          createdBy:req.body.createdBy 
      }) 
  
     
  
  
      // Create a new Vehicle A ///
      
      if (!job) {
        return res.status(500).json({
          success: false,
          message: "Internal server error while creating account."
        });
      }
  
      return res.status(200).json({
        success: true,
        job: job,
        message: "Job Ad created succesfully!"
      }); 
    }
     catch (error) {
      console.error("Error during creating job:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error."
      });
    } 

}

async function postVehicle(req , res) {
    if(!req.body.category || !req.body.make || !req.body.adTitle || 
        !req.body.description || !req.body.city|| !req.body.province || !req.body.price || 
        !req.body.ownerName || !req.body.phoneNo || !req.body.createdBy) 
    {
        return res.status(400).json({
            success: false , 
            message: "Provide complete details!"
        })
    }
    console.log("Vehicle",req.body.createdBy)
    try {
        let cloudinaryUrls = []
        for(let i = 0 ; i < req?.files?.images?.length ; i++) {
            let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path)
            console.log("loop" , cloudinaryURL)
            cloudinaryUrls.push(cloudinaryURL.url)
        }
        // Check if user already exists
       const vehicle = await Vehicle.create({
            category: req.body.category , 
            make: req.body.make , 
            adTitle: req.body.adTitle , 
            description: req.body.description , 
            city: req.body.city ,
            province: req.body.province ,
            price: Number(req.body.price) , 
            ownerName: req.body.ownerName , 
            mobileNo: req.body.phoneNo , 
            imagesURL: cloudinaryUrls,
            createdBy:req.body.createdBy
        }) 
    
       
    
    
        // Create a new Vehicle A ///
        
        if (!vehicle) {
          return res.status(500).json({
            success: false,
            message: "Internal server error while creating account."
          });
        }
    
        return res.status(200).json({
          success: true,
          vehicle: vehicle,
          message: "Vehicle Ad created succesfully!"
        }); 
      }
       catch (error) {
        console.error("Error during creating vehicle:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error."
        });
      } 

}
async function postMobile(req , res) {
    console.log(req.body)
    if(!req.body.category || !req.body.brand || !req.body.condition || !req.body.adTitle || 
        !req.body.description || !req.body.city || !req.body.province || !req.body.price || 
        !req.body.ownerName || !req.body.phoneNo || !req.body.createdBy) 
    {
        return res.status(400).json({
            success: false , 
            message: "Provide complete details!"
        })
    }
    console.log(`hllo ${req.body.createdBy}`)
    try {
        let cloudinaryUrls = []
        for(let i = 0 ; i < req?.files?.images?.length ; i++) {
            let cloudinaryURL = await uploadOnCloudinary(req.files.images[i].path)
            console.log("loop" , cloudinaryURL)
            cloudinaryUrls.push(cloudinaryURL.url)
        }
        // Check if user already exists
       const mobile = await Mobile.create({
            category: req.body.category , 
            brand: req.body.brand ,
            condition: req.body.condition , 
            adTitle: req.body.adTitle , 
            description: req.body.description , 
            province: req.body.province , 
            city: req.body.city , 
            price: Number(req.body.price) , 
            ownerName: req.body.ownerName , 
            mobileNo: req.body.phoneNo , 
            imagesURL: cloudinaryUrls,
            createdBy:req.body.createdBy
        }) 
        // Create a new Mobile ad ///
        if (!mobile) {
          return res.status(500).json({
            success: false,
            message: "Internal server error while creating account."
          });
        }
    
        return res.status(200).json({
          success: true,
          mobileAd: mobile , 
          message: "Mobile Ad created succesfully!"
        }); 
      }
       catch (error) {
        console.error("Error during creating vehicle:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error."
        });
      } 

}
module.exports = {
    postVehicle , 
    postMobile , 
    postJob , 
    postService , 
    allPosts
}